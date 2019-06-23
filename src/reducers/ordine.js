import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';
import {SET_ORDINI_MODAL_VISIBLE} from '../actions/ordine';

import {isAmount, isNotNegativeInteger,  isPercentage} from '../helpers/validators';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  noErrors,eanState, updateEANErrors} from '../helpers/form';
import {calcFormCols, calcHeader} from '../helpers/geometry';
//Mi servono i clienti!

const editedRigaOrdineValuesInitialState = 
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
				imgFirebaseUrl: '', 
				stato: 'D',
				history: {},
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaOrdineValuesInitialState, {} ));
}

const formWidth = (880 -16) - 8;
const tableWidth = (880 -16)  * 5 / 6 -8;
const colSearchParams = [
	{name: 'ean', min: 120, max: 120},
	{name: 'titolo', min: 396},
	{name: 'reset', min: 180, max: 240},

	]
 
const colParams1 = [
	{name: 'ean', min: 170, max: 170},
	{name: 'titolo', min: 446 },
	{name: 'autore', min: 180 },
	{name: 'listino', min: 60, max: 60}
	
	];
	
const colParams2 = [
	{name: 'man', min: 30, max: 30},
	{name: 'sconto', min: 60, max: 70},
	{name: 'prezzo', min: 80, max: 90},
	{name: 'pezzi', min: 70, max: 80},
	{name: 'totale', min: 90, max: 100},
	{name: 'stato', min: 70, max: 80},

	{name: 'annulla', min: 120, max: 240},
	{name: 'crea', min: 120, max: 240}
	
	];
	

	
const headerParams = [{name: 'ean', label: 'EAN', min: 130, max: 130},
			    {name: 'titolo', label: 'Titolo', min: 312},
			    {name: 'prezzoUnitario', label: 'Prezzo', min: 60, max: 60},
			    {name: 'prezzoTotale', label: 'Totale', min: 60, max: 100},
			   {name: 'pezzi', shortLabel: 'Pz.', label: 'Pezzi', shortBreak: 50, min: 40, max: 80},
			    {name: 'stato', label: 'Stato', min: 110},
			     
			   ];
			   
const headerParamsOA = [{name: 'ean', label: 'EAN', min: 130, max: 130},
			    {name: 'titolo', label: 'Titolo', min: 252},
			    {name: 'prezzoUnitario', label: 'Prezzo', min: 60, max: 60},
			    {name: 'prezzoTotale', label: 'Totale', min: 60, max: 100},
			   {name: 'pezzi', shortLabel: 'Pz.', label: 'Pezzi', shortBreak: 50, min: 40, max: 80},
			   {name: 'dataOrdine',  label: 'Data',  min: 120, max: 120},
			   
			    {name: 'stato', shortLabel: 'St.', label: 'Stato', min: 140},
			    {name: 'cliente',  label: 'Cliente', min: 160},
			    ];	
const ordiniModalHeader = [
	  {dataField: 'cliente',  label: 'Cliente', width: 160},
			  
			     {dataField: 'pezzi', label: 'Pezzi',  width: 80},
			   {dataField: 'dataOrdine',  label: 'Data',  width: 120},
			     
			   ];			   

const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
		
    		geometry: {ordiniModalHeader: ordiniModalHeader, formSearchCols: calcFormCols(colSearchParams,8,tableWidth), formCols1: calcFormCols(colParams1,8,formWidth), formCols2: calcFormCols(colParams2,8,formWidth), header: calcHeader(headerParams, tableWidth - 60)
    					},	
    		ordiniModalVisible: false,			
    				}

	return initialStateHelper(eiis,extraState);
    }
    

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
 
    
//Metodi reducer per le Form
const rigaOrdineR = new FormReducer('ORDINE', foundCompleteItem, null, null, initialState); 


function discountPrice(prezzoListino, sconto)
{  
  return ((1 - sconto/100) * prezzoListino).toFixed(2);    
}  

//Si comporta diversamente nei vari casi...
function pricesMgmt(changedEditedRigaOrdine, name)
{
	const prezzoListino = changedEditedRigaOrdine.values['prezzoListino'];	
	const sconto = changedEditedRigaOrdine.values['sconto'];
	const pezzi = changedEditedRigaOrdine.values['pezzi'];
	const manSconto = changedEditedRigaOrdine.values['manSconto'];
	if (name !== 'prezzoUnitario' && sconto>=0 )
		{
		if (manSconto) changedEditedRigaOrdine.values['prezzoUnitario'] = prezzoListino;
		else changedEditedRigaOrdine.values['prezzoUnitario'] = discountPrice(prezzoListino, sconto);
		}
	const prezzoUnitario = changedEditedRigaOrdine.values['prezzoUnitario'];
	if (prezzoUnitario >=0 && pezzi>=0) changedEditedRigaOrdine.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);	
}



//In input il nuovo campo... in output il nuovo editedRigaOrdine
function transformAndValidateEditedRigaOrdine(cei, name, value)
{  	
	cei.values[name] = value;
	//Gestione cambiamenti
    switch (name) {
		case 'sconto':
	  case 'manSconto':
	    case 'prezzoUnitario':
	        if (name === 'manSconto' && value) 
	        	{
	        		cei.values.sconto = '';
	        		
	        	}
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

  
		
   errMgmt(cei, 'sconto','invalidPercentage','0-99',  ((value) => {return !isPercentage(value)})(cei.values.sconto));
   	
   
   	errMgmt(cei, 'prezzoUnitario','invalidAmount','Importo (19.99)',  
   	    ((value) => {return !isAmount(value)})(cei.values.prezzoUnitario), 
   	    ((value) => {return (value.length>0 && !isAmount(value))})(cei.values.prezzoUnitario));
   	    
    errMgmt(cei, 'pezzi','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cei.values.pezzi));
  
  


    errMgmt(cei, 'pezzi','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cei.values.pezzi));
  	
   	
  	
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

export default function Ordine(state = initialState(), action) {
  var newState;
  switch (action.type) {
   case  SET_ORDINI_MODAL_VISIBLE:
   	 newState = state;
   	 newState = {...newState, ordiniModalVisible: action.visible};
   	 break;
   case STORE_MEASURE:
   	    newState = state;
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    if (action.newMeasure.name==='viewPortHeight')
   			{
   	    	let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formRigaOrdineHeight'] -150;
   	    	newState = {...state, tableHeight: height};
   			}
   		if (action.newMeasure.name==='viewPortWidth' || action.newMeasure.name==='siderWidth')
   	   		{
   			let formWidth = (measures['viewPortWidth'] -measures['siderWidth'] -16) - 8;	
   			let tableWidth = formWidth * 5 / 6 -8 ;
   			let formSearchCols = calcFormCols(colSearchParams,8,tableWidth);
   		
   			let formCols1 = calcFormCols(colParams1,8,formWidth);
   			let formCols2 = calcFormCols(colParams2,8,formWidth);
   			let header = calcHeader(headerParams, tableWidth - 60);
   				let headerOA = calcHeader(headerParamsOA, tableWidth - 60);
   		
   			let geometry = {...newState.geometry};
   			
   		    newState = {...newState, geometry: {...geometry, formWidth: formWidth, formCols1: formCols1, formCols2: formCols2, formSearchCols: formSearchCols, header: header, headerOA: headerOA}};
   			}
   	
        break;
  	
    default:
        newState = rigaOrdineR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaOrdine, calcolaTotali);
        //newState =  state;
    	break;
   
  }
 return newState;
}

//Il mio primo selettore colocato https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers!!!
//Questi rimarranno identici in tutti i casi... Posso migliorare queste ripetizioni inutili?
 export const getItems = (state) => {return state.itemsArray};  
 export const getEditedItem = (state) => {return state.editedItem};  
 export const getTestataOrdine = (state) => {return state.testata};
 export const getShowCatalogModal = (state) => {return state.showCatalogModal};  
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getTableScroll = (state)  => {return state.tableScroll};
 export const getListeningTestataOrdine = (state) => {return state.listeningTestata};
 export const getListeningItemOrdine = (state) => {return state.listeningItem};
  export const getListenersItemOrdine = (state) => {return state.listenersItem};
 
 export const isStaleTotali = (state) => {return state.staleTotali};
 export const getMessageBuffer = (state) => {return state.messageBuffer};
 export const getFiltersOrdine = (state) => {return state.filters};
 
 export const getTotali = (state) => {return state.totali};
 export const getOrdiniModalVisible = (state) => {return state.ordiniModalVisible};
 //Questa per memoria storica
 //export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 
 
 
      



