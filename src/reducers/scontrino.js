//Per pura pigrizia lascio rigabolla qua e la....

import FormReducer from '../helpers/formReducer'
import {
INITIAL_LOAD_ITEM_ELENCOSCONTRINI, 
ADDED_ITEM_ELENCOSCONTRINI, 
CHANGED_ITEM_ELENCOSCONTRINI, 
DELETED_ITEM_ELENCOSCONTRINI, 
INITIAL_LOAD_ITEM_SCONTRINI, 
ADDED_ITEM_SCONTRINI, 
CHANGED_ITEM_SCONTRINI, 
DELETED_ITEM_SCONTRINI, 	
} from '../actions/cassa';


import {SET_SCONTO_SCONTRINO, SET_EAN_LOOKUP_OPEN, SET_SCONTRINO_ID} from '../actions/scontrino';
import {COL_H_S, COL_H, FORM_COL_H, GE_H,FMH, FMW, initCalcGeometry, calcHeaderFix, calcFormColsFix, calcGeneralError} from '../helpers/geometry'

import {persistTree} from '../helpers/firebase';
import memoizeOne from 'memoize-one';


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

let geometryParams = {cal: {
	                    
						formHeight: 2 * FORM_COL_H + GE_H,
						totaliWidth: 190,
						totaliHeight: 60,
						infoHeight : COL_H_S,
						editScontrinoHeight: COL_H,
						nuovoScontrinoHeight : COL_H_S,
						scontoFormHeight: COL_H,
							restoFormHeight: FORM_COL_H,
					
					 
						immagineWidth: 190,
						immagineHeight: 200,
						formWidth: 190,
						scontoFormWidth: 190,
						restoFormWidth: 190,
						formTestataWidth: 190,
						
						colParams1: [
									{name: 'ean', min: 200, max: 200},
									{name: 'titolo', min: 446 },
									{name: 'autore', min: 180 },
									
									],
						colParams2: [
								{name: 'listino', min: 70, max: 70},
								
									{name: 'man', min: 30, max: 30},
									{name: 'sconto', min: 60, max: 70},
									{name: 'prezzo', min: 80, max: 90},
									{name: 'pezzi', min: 70, max: 80},
									{name: 'totale', min: 90, max: 100},
								
									{name: 'annulla', min: 120, max: 240},
									{name: 'aggiungi', min: 120, max: 240}
									
									],
									
						colTestataParams1: [
									{name: 'numero', min: 52, max: 52},
									{name: 'oraScontrino', min: 78, max: 78},
									{name: 'edit', min: 30, max: 30},
									
									],
						colTestataParams2: [
									{name: 'sconto', min: 60, max: 60},
									{name: 'submit', min: 80, max: 80},
									
									
									],
									
						headerParams: [
									  {name: 'ean', label: 'EAN', min: 130, max: 130},
									  {name: 'titolo', label: 'Titolo', min: 212, ellipsis: true},
									  {name: 'prezzoUnitario', label: 'Eur', min: 50, max: 50},
									  {name: 'pezzi', label: 'Q.Tà', min: 40, max: 40},
									  {name: 'sconto', label: 'Sc.', min: 40, max: 40},
									
									  {name: 'prezzoTotale', label: 'Tot.', min: 60, max: 60},
									
									 ],
						
						},
				  tbc: [{cassaWidth: (cal) => {return(cal.w/4-2)}},
				  	   	{scontrinoWidth: (cal) => {return(3*cal.cassaWidth)}},
				  	    {scontrinoHeight: (cal) =>  {return(cal.h)}},
				  	     
				  	    {tableWidth: (cal) => {return(cal.scontrinoWidth-cal.totaliWidth)}},
				  	    {tableHeight: (cal) =>  {return(cal.h-cal.formHeight)}},
				  	    {formWidth: (cal) =>  {return(cal.w*3/4)}},
				  	   ],
				 geo: [ 
				  	   	{scontrinoCoors: (cal) => {return({height: cal.scontrinoHeight, width: cal.scontrinoWidth, top: 0, left: cal.cassaWidth+5})}},
    				     //Tutti gli altri sono relativi...
     		    		{infoCoors: (cal) => {return({height: cal.infoHeight, width: cal.infoWidth, top: 0, left: 0})}},
    				    {editScontrinoCoors: (cal) => {return({height: cal.editScontrinoHeight, width: cal.nuovoScontrinoWidth, top: cal.infoHeight, left: 0})}},
    				    {scontoFormCoors: (cal) => {return({height: cal.scontoFormHeight, width: cal.infoWidth, top: cal.infoHeight+cal.editScontrinoHeight+cal.emptyHeight, left: 0})}},
    					{totaliCoors: (cal) => {return({height: cal.totaliHeight, width: cal.totaliWidth, top: cal.infoHeight+cal.editScontrinoHeight+cal.scontoFormHeight, left: 0})}},
    				
    				    {restoFormCoors: (cal) => {return({height: cal.restoFormHeight, width: cal.restoFormWidth, top:  cal.infoHeight+cal.editScontrinoHeight+cal.scontoFormHeight+cal.totaliHeight, left: 0})}},
    					{nuovoScontrinoCoors: (cal) => {return({height: cal.nuovoSContrinoHeight, width: cal.nuovoScontrinoWidth, top: cal.infoHeight+cal.editScontrinoHeight+cal.scontoFormHeight+cal.totaliHeight+cal.restoFormHeight, left: 0})}},
    				    
    					{immagineCoors: (cal) => {return({height: cal.immagineHeight, width: cal.immagineWidth, top: cal.h - cal.formHeight -cal.immagineHeight, left: 0})}},
						{header: (cal) =>  {return(calcHeaderFix({colParams: cal.headerParams, width: cal.tableWidth-FMW}))}},
    				
					    {tableCoors: (cal) =>  {return({height: cal.tableHeight, width: cal.tableWidth, top: 0, left: cal.totaliWidth})}},
    				
     		    		{formCoors: (cal) =>  {return({height: cal.formHeight - FMH, width: cal.formWidth -FMW -10, top: cal.tableHeight, left: 0})}},
    				    {formCols1: (cal) =>  {return(calcFormColsFix({colParams: cal.colParams1, width: cal.formWidth-10, offset: 0}))}}, 
    				    {formCols2: (cal) =>  {return(calcFormColsFix({colParams: cal.colParams2, width: cal.formWidth-10, offset: 1}))}}, 
    					{formTestataCols1: (cal) =>  {let cols1 = calcFormColsFix({colParams: cal.colTestataParams1, width: cal.formTestataWidth-10, offset: 0});  cols1.edit.top = -30; return(cols1)}}, 
    				    {formTestataCols2: (cal) =>  {let cols2 = calcFormColsFix({colParams: cal.colTestataParams2, width: cal.formTestataWidth-10, offset: 1}); cols2.submit.top = cols2.submit.top -50;  cols2.sconto.top = cols2.sconto.top -20; return(cols2)}}, 
    					
    					{generalError: (cal) =>  {return(calcGeneralError({width: cal.formWidth-10, offset: 2}))}},	 
    		//Header ha tolleranza per barra di scorrimento in tabella e sel 
    				     
    		
						
						]
				 }	
const calcGeometry = initCalcGeometry(geometryParams);



const initialState = () => {
    const eiis = editedItemInitialState();
    
	return initialStateHelper(eiis,{geometry: calcGeometry(),
									defaultSconto: '', 
									eanLookupOpen: false,
									scontrinoId: null,
									scontrini: {},
									elencoScontrini: {},
									totali: {pezzi: 0, prezzoTotale: 0.00}});
    }
    



 
    
//Metodi reducer per le Form
const scontrinoR = new FormReducer(
	{scene: 'SCONTRINO',
						foundCompleteItem: foundCompleteItem,
								transformItem: null, 
								transformSelectedItem: null, 
								initialState: initialState, 
								keepOnSubmit: false, 
								calcGeometry: calcGeometry});


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
  		break
  	case SET_SCONTRINO_ID:
  		 newState ={...state, scontrinoId: action.scontrinoId};
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
  	    
  	case INITIAL_LOAD_ITEM_ELENCOSCONTRINI:
	case ADDED_ITEM_ELENCOSCONTRINI:
	case CHANGED_ITEM_ELENCOSCONTRINI:
	case DELETED_ITEM_ELENCOSCONTRINI:
			newState = persistTree({state: state, type: action.type, payload: action.payload, objName: 'elencoScontrini'});
    
			break;
			
	case INITIAL_LOAD_ITEM_SCONTRINI:
	case ADDED_ITEM_SCONTRINI:
	case CHANGED_ITEM_SCONTRINI:
	case DELETED_ITEM_SCONTRINI:
			newState = persistTree({state: state, type: action.type, payload: action.payload, objName: 'scontrini'});
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
 //export const getTestataScontrino = (state) => {return state.testata};
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
 


  const calcScontrinoItems = (scontrino) =>
  {
    if (scontrino) 
    	{let scontrinoArray = Object.entries(scontrino);
    	let result = [];
    	for (let i=0; i<scontrinoArray.length; i++) {scontrinoArray[i][1].key = scontrinoArray[i][0]; result.push(scontrinoArray[i][1]);}
    	return(result)
    	}
    else return [];
  }
  //Lo memoizzo in modo che se non cambia lo scontrino ma ne cambia un altro... non aggiorno inutilmente
  const memoizedCalcScontrinoItems = memoizeOne(calcScontrinoItems);	
  
  export const getItemsScontrino = (state) => {return memoizedCalcScontrinoItems(state.scontrini[state.scontrinoId])}
  export const getTestataScontrino = (state) => {return state.elencoScontrini[state.scontrinoId]}
 
 
      



