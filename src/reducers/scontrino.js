//Per pura pigrizia lascio rigabolla qua e la....

import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';
import {SET_SCONTO_SCONTRINO, SET_EAN_LOOKUP_OPEN} from '../actions/scontrino';



import {isAmount, isNotZeroInteger,  isPercentage} from '../helpers/validators';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  noErrors,eanState, updateEANErrors} from '../helpers/form';


const editedRigaBollaValuesInitialState = 
	  {			ean: '',
				titolo: '',
				autore: '',
				prezzoListino: '',
				sconto: '',
				manSconto: false,
				prezzoUnitario: '',
				pezzi: '1',
				prezzoTotale: '',
				imgUrl: '',
				imgFirebaseUrl: ''
	};
	
	
const calcolaTotali = (state) =>
{
	let totalePezzi = 0;
	let totaleImporto = 0.00;
	let righe = state.itemsArray;
	for (let propt=0; propt<righe.length; propt++)
		{	
			totalePezzi = parseInt(righe[propt].pezzi, 10) + totalePezzi;
	    	totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
		}
	const totali = {'pezzi' : totalePezzi, 
						'prezzoTotale' : totaleImporto.toFixed(2)}; 
	return ({...state, totali: totali});				
};

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaBollaValuesInitialState, {} ));
}

const formRigaScontrinoColsInitial = {
			                                 	   ean: 160,
			                                 	   titolo: 325,
			                                 	   autore: 165,
			                                 	   listino: 80,
			                                 	   man: 10,
			                                 	   sconto: 60,
			                                 	   prezzoUnitario: 80,
			                                 	   pezzi: 60,
			                                 	   prezzoTotale: 90,
			                                 	   annulla: 80,
			                                 	   aggiungi: 115
			                                 };
			                                 
const initialState = () => {
    const eiis = editedItemInitialState();
    
	return initialStateHelper(eiis,{geometry: {
			                                  colonnaTestataScontrinoWidth: 180,
			                                  tableScontrinoCols: {
			                                  		ean: 120,
			                                  		prezzoUnitario: 50,
			                                  		pezzi: 45,
			                                  		sconto: 45,
			                                  		prezzoTotale: 65,
			                                  		titolo: 80,
			                                						},
			                                 formRigaScontrinoGutter: 8,
			                                 formRigaScontrinoCols: {...formRigaScontrinoColsInitial},
											  },
									defaultSconto: '', 
									eanLookupOpen: false,
									totali: {pezzi: 0, prezzoTotale: 0.00}});
    }
    



 
    
//Metodi reducer per le Form
const scontrinoR = new FormReducer('SCONTRINO', foundCompleteItem, null, null, initialState); 


function discountPrice(prezzoListino, sconto)
{  
  return ((1 - sconto/100) * prezzoListino).toFixed(2);    
}  

//Si comporta diversamente nei vari casi...
function pricesMgmt(changedEditedRigaBolla, name)
{
	const prezzoListino = changedEditedRigaBolla.values['prezzoListino'];	
	const sconto = changedEditedRigaBolla.values['sconto'];
    const pezzi = changedEditedRigaBolla.values['pezzi'];
	const manSconto = changedEditedRigaBolla.values['manSconto'];
	if (name !== 'prezzoUnitario' && sconto>=0)
		{
		if (manSconto) 
			{changedEditedRigaBolla.values['prezzoUnitario'] = prezzoListino;
			changedEditedRigaBolla.values['sconto'] = '';
			}
		else changedEditedRigaBolla.values['prezzoUnitario'] = discountPrice(prezzoListino, sconto);
		}
	const prezzoUnitario = changedEditedRigaBolla.values['prezzoUnitario'];
	if (prezzoUnitario >=0 && pezzi>=0) changedEditedRigaBolla.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);	
}



//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaScontrino(cei, name, value)
{  	
	cei.values[name] = value;
	//Gestione cambiamenti
    switch (name) {
		case 'sconto':
		case 'manSconto':
	    case 'prezzoUnitario':
	    	if (cei.values['prezzoListino'] > 0) pricesMgmt(cei, name);
		break;		
		case 'pezzi':
			const pezzi = cei.values['pezzi'];
			const prezzoUnitario = cei.values['prezzoUnitario'];
			if (prezzoUnitario >=0 && pezzi!==0) cei.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);
	    break;
		
		default:
		break;
		
	}

  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
   
   //Se tocco EAN il form è svalido sempre 
   if (name === 'ean') 
        {
        //Aggiorno lo stato di EAN
        eanState(cei);
        //cancello provvisoriamente tutti gli error
        noErrors(cei, 'ean');
		//E cancello i campi del libro...
		cei.values.titolo = '';
		cei.values.autore = '';
		cei.values.prezzoListino = '';
		//Rivaluto gli errori e cosa mostrare
	    updateEANErrors(cei);
		}

  
		
   errMgmt(cei, 'sconto','invalidPercentage','0-99',  ((value) => {return ((value.length > 0)  && (!isPercentage(value)))})(cei.values.sconto));
   	
   
   	errMgmt(cei, 'prezzoUnitario','invalidAmount','Importo (19.99)',  
   	    ((value) => {return !isAmount(value)})(cei.values.prezzoUnitario), 
   	    ((value) => {return (value.length>0 && !isAmount(value))})(cei.values.prezzoUnitario));
   	    
    errMgmt(cei, 'pezzi','notZero','numero intero',  ((value) => {return !isNotZeroInteger(value)})(cei.values.pezzi));
  
 
  	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}


function foundCompleteItem(editedItem, action) 
	{   
		let cei = editedItemCopy(editedItem);
		 
		 cei.willFocus = 'pezzi';
     
       	//Copio l'esito della ricerca...
       		cei.values = {...cei.values, ...action.item}
        /*
    	cei.values.titolo = action.item.titolo;
    	cei.values.autore = action.item.autore;
    	cei.values.prezzoListino = action.item.prezzoListino;
    	if ('editore' in cei.values) cei.values.editore = action.item.editore;
    	*/
    	
    	//Aggiorno i prezi e i totali
    	if (cei.values['prezzoListino'] > 0) pricesMgmt(cei,'prezzoListino');
    	
    	//Il form e' potenzialmente valido... sgancio gli errori...
    	//Se sono qui... EAN è sicuramente valido...
        noErrors(cei,'ean');
        noErrors(cei,'form');
        noErrors(cei,'prezzoUnitario');
      	 cei.isValid = isValidEditedItem(cei);
       return(cei);
	}

export default function scontrino(state = initialState(), action) {
  var newState;
  switch (action.type) {
    
   case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    newState = {...state, measures: measures};
   	    if (action.newMeasure.name==='viewPortHeight' || action.newMeasure.name==='headerHeight' || action.newMeasure.name==='formRigaScontrinoHeight' )
   	    	{
   	        let vPH = measures['viewPortHeight'] ? measures['viewPortHeight'] : 600;
   	        let hH = measures['headerHeight'] ? measures['headerHeight'] : 64;
   	        let fRSH = measures['formRigaScontrinoHeight'] ? measures['formRigaScontrinoHeight'] : 100;
   	    	let height = vPH - hH -fRSH;
   	    	let geometry = {...state.geometry};
   	    	geometry.tableScontrinoHeight = height - 30; 
   	    	geometry.sezioneScontrinoHeight = height - 85; 
   	    	
   	    	newState = {...newState, tableHeight: geometry.tableScontrinoHeight, geometry: geometry};
			}
   	    if (action.newMeasure.name==='viewPortWidth' || action.newMeasure.name==='siderWidth')
   	    	{
   	    	let formRigaScontrinoWidth = (measures['viewPortWidth'] -measures['siderWidth'] -16) * 3 / 4;
   	    	let formRigaScontrinoSpread = formRigaScontrinoWidth - 660;
   	    	let tableScontrinoWidth = (measures['viewPortWidth'] -measures['siderWidth'] -16) * 3 / 4 - state.geometry['colonnaTestataScontrinoWidth'];
   		    let tableScontrinoCols = {...state.geometry.tableScontrinoCols};
   	    	if (tableScontrinoCols && tableScontrinoWidth) 
   	    		{
   	    		tableScontrinoCols.titolo = tableScontrinoWidth - 60 - (tableScontrinoCols.ean + tableScontrinoCols.prezzoUnitario + tableScontrinoCols.pezzi+ tableScontrinoCols.sconto + tableScontrinoCols.prezzoTotale) - 10; 
   				let geometry = {...state.geometry};
   	    		geometry.tableScontrinoWidth = tableScontrinoWidth;
   	    		geometry.tableScontrinoCols = tableScontrinoCols;
   	    		geometry.formRigaScontrinoGutter = 8 + formRigaScontrinoSpread / 14;
   	    		//Quanto spazio ho per titolo e autore?
   	    		let formRigaScontrinoSpread2 = formRigaScontrinoSpread - 2 * geometry.formRigaScontrinoGutter ;
   	    		geometry.formRigaScontrinoCols.titolo = formRigaScontrinoColsInitial.titolo + formRigaScontrinoSpread2  * 2 / 3;
   	    		geometry.formRigaScontrinoCols.autore = formRigaScontrinoColsInitial.autore + formRigaScontrinoSpread2 / 3;
   	    		
   	    		for (let propt in {'man' : true,'sconto': true, 'prezzoUnitario': true, 'pezzi': true, 'prezzoTotale': true,'annulla': true,'aggiungi': true})
   	    			{
   	    				geometry.formRigaScontrinoCols[propt] = formRigaScontrinoColsInitial[propt] + formRigaScontrinoSpread / 14;
   	    			}
   	    			
   	    		newState = {...newState, geometry: geometry};
   	    		}
			}
   	   	
   	        break;
  	case SET_SCONTO_SCONTRINO: 
  		newState = {...state, defaultSconto: action.sconto};
  		break;
  	 case SET_EAN_LOOKUP_OPEN: 
  		newState = {...state, eanLookupOpen: action.value};
  		break;
 	
  		
  	case scontrinoR.SUBMIT_EDITED_ITEM:
  		newState = scontrinoR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaScontrino);
  		//Forzo qui lo stato dello sconto al valore di default se ho una form valida (e quindi un campo pulito)
  		if (newState.editedItem.eanState === 'BLANK') 
  			{   let cei = editedItemCopy(newState.editedItem);
		        cei.values.sconto = newState.defaultSconto;
  				newState = {...newState, editedItem: cei};
  			}	
  		break;
    case scontrinoR.TESTATA_CHANGED:
  		newState = scontrinoR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaScontrino);
  		//Forzo qui lo stato dello sconto al valore di default 
  		if (action.payload && action.payload.sconto)
  			{
	  		let defaultSconto = action.payload.sconto;
	  		let cei = editedItemCopy(newState.editedItem);
			cei.values.sconto = defaultSconto;
			if (cei.values['prezzoListino'] > 0) pricesMgmt(cei, 'sconto');
	  	    newState = {...newState, editedItem: cei, defaultSconto: defaultSconto};
  			}
	  	break;
    case scontrinoR.RESET_EDITED_ITEM:
    	{
  		newState = scontrinoR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaScontrino);
  	  	let cei = editedItemCopy(newState.editedItem);
		cei.values.sconto = newState.defaultSconto;
	    newState = {...newState, editedItem: cei};
    	}
  	    break;
      default:
        newState = scontrinoR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaScontrino, calcolaTotali);
        //newState =  state;
    	break;
   
  }
 return newState;
}

//Il mio primo selettore colocato https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers!!!
//Questi rimarranno identici in tutti i casi... Posso migliorare queste ripetizioni inutili?
 export const getTotali = (state) => {return state.totali};  
 export const getItems = (state) => {return state.itemsArray};  
 export const getEditedItem = (state) => {return state.editedItem};  
 export const getTestataScontrino = (state) => {return state.testata};
 export const getShowCatalogModal = (state) => {return state.showCatalogModal};  
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getTableScroll = (state)  => {return state.tableScroll};
 export const getListeningTotaliScontrino = (state) => {return state.listeningTotali};
 export const getListeningTestataScontrino = (state) => {return state.listeningTestata};
 export const getListeningItemScontrino = (state) => {return state.listeningItem};
 export const getListenersItemScontrino = (state) => {return state.listenersItem};
export const getEanLookupOpen = (state) => {return state.eanLookupOpen};  
 
 export const isStaleTotali = (state) => {return state.staleTotali};
 export const getMessageBuffer = (state) => {return state.messageBuffer};
 //export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 

 
 
      



