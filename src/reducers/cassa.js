import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';

import {isAmount, isNotNegativeInteger,  isPercentage} from '../helpers/validators';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  noErrors,eanState, updateEANErrors} from '../helpers/form';


const editedRigaBollaValuesInitialState = 
	  {			ean: '',
				titolo: '',
				autore: '',
				prezzoListino: '',
				sconto1: '',
				sconto2: '',
				sconto3: '',
				manSconto: false,
				prezzoUnitario: '',
				pezzi: '1',
				gratis: '',
				prezzoTotale: '',
				imgUrl: ''	
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaBollaValuesInitialState, {} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
						totali: {pezzi : 0, gratis : 0, prezzoTotale : 0.0},
  	
    				}
	return initialStateHelper(eiis,extraState);
    }
    


/*

const initialState = () => {

	return {
			itemsArray: [],
			itemsArrayIndex: {},
		    tableScroll: false,
		    lastActionKey: null,
			staleTotali: true,
			showCatalogModal: false,
			tableHeight: 2048,
			totali: {pezzi : 0, gratis : 0, prezzoTotale : 0.0},
			editedItem: {...editedItemInitialState()},
			testata: null,
			listeningTestata: null,
			listeningItem: null
	    	}
    }
 */
 
    
//Metodi reducer per le Form
const rigaBollaR = new FormReducer('BOLLA', foundCompleteItem, null, null, initialState); 


function discountPrice(prezzoListino, sconto1, sconto2, sconto3)
{  
  return ((1 - sconto1/100) *((1 - sconto2 /100) *((1 - sconto3/100) * prezzoListino))).toFixed(2);    
}  

//Si comporta diversamente nei vari casi...
function pricesMgmt(changedEditedRigaBolla, name)
{
	const prezzoListino = changedEditedRigaBolla.values['prezzoListino'];	
	const sconto1 = changedEditedRigaBolla.values['sconto1'];
	const sconto2 = changedEditedRigaBolla.values['sconto2'];
	const sconto3 = changedEditedRigaBolla.values['sconto3'];
	const pezzi = changedEditedRigaBolla.values['pezzi'];
	const manSconto = changedEditedRigaBolla.values['manSconto'];
	if (name !== 'prezzoUnitario' && sconto1>=0 && sconto2>=0 && sconto3>=0)
		{
		if (manSconto) changedEditedRigaBolla.values['prezzoUnitario'] = prezzoListino;
		else changedEditedRigaBolla.values['prezzoUnitario'] = discountPrice(prezzoListino, sconto1, sconto2, sconto3);
		}
	const prezzoUnitario = changedEditedRigaBolla.values['prezzoUnitario'];
	if (prezzoUnitario >=0 && pezzi>=0) changedEditedRigaBolla.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);	
}



//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaBolla(cei, name, value)
{  	
	cei.values[name] = value;
	//Gestione cambiamenti
    switch (name) {
		case 'sconto1':
		case 'sconto2':
	    case 'sconto3':
	    case 'manSconto':
	    case 'prezzoUnitario':
	    	if (cei.values['prezzoListino'] > 0) pricesMgmt(cei, name);
		break;		
		case 'pezzi':
			const pezzi = cei.values['pezzi'];
			const prezzoUnitario = cei.values['prezzoUnitario'];
			if (prezzoUnitario >=0 && pezzi>=0) cei.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);
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

  
		
   errMgmt(cei, 'sconto1','invalidPercentage','0-99',  ((value) => {return !isPercentage(value)})(cei.values.sconto1));
   errMgmt(cei, 'sconto2','invalidPercentage','0-99',  ((value) => {return !isPercentage(value)})(cei.values.sconto2));
   errMgmt(cei, 'sconto3','invalidPercentage','0-99',  ((value) => {return !isPercentage(value)})(cei.values.sconto3));
   	
   
   	errMgmt(cei, 'prezzoUnitario','invalidAmount','Importo (19.99)',  
   	    ((value) => {return !isAmount(value)})(cei.values.prezzoUnitario), 
   	    ((value) => {return (value.length>0 && !isAmount(value))})(cei.values.prezzoUnitario));
   	    
    errMgmt(cei, 'pezzi','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cei.values.pezzi));
  	errMgmt(cei, 'gratis','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cei.values.gratis));
  
  


    errMgmt(cei, 'pezzi','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cei.values.pezzi));
  	errMgmt(cei, 'gratis','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cei.values.gratis));
  	//Così si accendono i campi vuoti quando valida...
  	
  	errMgmt(cei, 'pezzi','noItems','',  ((pezzi,gratis) => {return (!((pezzi>=0) && (gratis>=0) && (pezzi+gratis>0)))})(cei.values.pezzi,cei.values.gratis), false);
  	errMgmt(cei, 'gratis','noItems','',  ((pezzi,gratis) => {return (!((pezzi>=0) && (gratis>=0) && (pezzi+gratis>0)))})(cei.values.pezzi,cei.values.gratis), false);
  	
  	
  	errMgmt(cei, 'form','noItems','almeno un oggetto!',  ((pezzi,gratis) => {return (!((pezzi>=0) && (gratis>=0) && (pezzi+gratis>0)))})(cei.values.pezzi,cei.values.gratis),false);
  	
  	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}


function foundCompleteItem(editedItem, action) 
	{   
		let cei = editedItemCopy(editedItem);
		 
		 cei.willFocus = 'pezzi';
     
       	//Copio l'esito della ricerca...
    	cei.values.titolo = action.item.titolo;
    	cei.values.autore = action.item.autore;
    	cei.values.prezzoListino = action.item.prezzoListino;
    	if ('editore' in cei.values) cei.values.editore = action.item.editore;
    	
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

export default function bolla(state = initialState(), action) {
  var newState;
  switch (action.type) {
    
   case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formRigaBollaHeight'] -100;
   	    newState = {...state, tableHeight: height};
        break;
  	
    default:
        newState = rigaBollaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaBolla);
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
 export const getTestataBolla = (state) => {return state.testata};
 export const getShowCatalogModal = (state) => {return state.showCatalogModal};  
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getTableScroll = (state)  => {return state.tableScroll};
 export const getMeasures = (state) => {return state.measures};
 export const getListeningTotaliBolla = (state) => {return state.listeningTotali};
 export const getListeningTestataBolla = (state) => {return state.listeningTestata};
 export const getListeningItemBolla = (state) => {return state.listeningItem};
 export const isStaleTotali = (state) => {return state.staleTotali};
 
 
 
 
      


