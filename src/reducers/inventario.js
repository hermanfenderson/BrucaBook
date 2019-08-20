import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';
import {GENERA_RIGHE_INVENTARIO} from '../actions/inventario';
import { childAdded, childDeleted, childChanged, initialLoading } from '../helpers/firebase';
import {calcFormColsFix, calcHeaderFix, calcGeneralError, initCalcGeometry, FMH, FMW, FORM_COL_H, GE_H} from '../helpers/geometry';


import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  noErrors,eanState, updateEANErrors} from '../helpers/form';
import {isInteger} from '../helpers/validators';

const editedInventarioValuesInitialState = 
	  {			ean: '',
				titolo: '',
				autore: '',
				prezzoListino: '',
				stock: 0,
				pezzi: 0,
				imgUrl: ''	
	};
	


const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedInventarioValuesInitialState, {willFocus: 'ean'} ));
}


//Auto-magico! Il calcolo è fatto in una funzione generalizzata... l'esito è passato a formReducer			   
let geometryParams = {cal: {
						formHeight: 2 * FORM_COL_H + GE_H,
						caricaWidth: 190,
						caricaHeight: 200,
						immagineWidth: 190,
						immagineHeight: 200,
						formSearchHeight: FORM_COL_H,
						
						colSearchParams: [
										{name: 'ean', min: 120, max: 120},
										{name: 'titolo', min: 250},
										{name: 'autore', min: 110},
										{name: 'reset', min: 150, max: 240},
										],
						colParams1: [
										{name: 'ean', min: 170, max: 170},
										{name: 'titolo', min: 360},
					
									
									],
						colParams2: [
									{name: 'autore', min: 160},

									{name: 'listino', min: 65, max: 65},
									{name: 'stock', min: 65, max: 65},
									{name: 'delta', min: 65, max: 65},
								
									{name: 'annulla', min: 70, max: 100},
									{name: 'inserisci', min: 70, max: 100},

									
									],
						headerParams: [
									  	{name: 'ean', label: 'EAN', min: 130, max: 130,sort:'number'},
										{name: 'titolo', label: 'Titolo', min: 250,sort:'string', ellipsis: true},
										{name: 'autore', label: 'Autore', min: 110,sort:'string', ellipsis: true},
										{name: 'prezzoListino', label: 'Prezzo', min: 60, max: 60},
										{name: 'stock', label: 'Stock', min: 50, max: 50},
										{name: 'pezzi', label: 'Delta', min: 50, max: 50},

									 ],
						
						},
				  tbc: [
				  	    {tableWidth: (cal) => {return(cal.w-cal.caricaWidth)}},
				  	    {tableHeight: (cal) =>  {return(cal.h-cal.formHeight-cal.formSearchHeight)}},
				  	    {formWidth: (cal) =>  {return(cal.w - cal.caricaWidth)}},
				  	    {formSearchWidth: (cal) =>  {return(cal.tableWidth)}},
				  	   ],
				 geo: [ 
				  	   
     		    		{formSearchCoors: (cal) =>  {return({height: FORM_COL_H, width: cal.formSearchWidth, top: 0, left: cal.caricaWidth})}},
    					{formSearchCols: (cal) =>  {return(calcFormColsFix({colParams: cal.colSearchParams, width: cal.formSearchWidth, offset: 0}))}}, 
    					{formCoors: (cal) =>  {return({height: cal.formHeight - FMH, width: cal.formWidth -FMW, top: cal.tableHeight+cal.formSearchHeight, left: cal.caricaWidth})}},
    				    {formCols1: (cal) =>  {return(calcFormColsFix({colParams: cal.colParams1, width: cal.formWidth, offset: 0}))}}, 
    				    {formCols2: (cal) =>  {return(calcFormColsFix({colParams: cal.colParams2, width: cal.formWidth, offset: 1}))}}, 
    					{tableCoors: (cal) =>  {return({height: cal.tableHeight, width: cal.tableWidth, top: cal.formSearchHeight, left: cal.caricaWidth})}},
    				
    					{generalError: (cal) =>  {return(calcGeneralError({width: cal.formWidth, offset: 2}))}},	 
    		//Header ha tolleranza per barra di scorrimento in tabella e sel 
    					{header: (cal) =>  {return(calcHeaderFix({colParams: cal.headerParams, width: cal.tableWidth-FMW}))}},
    				
    					{caricaCoors: (cal) => {return({height: cal.caricaHeight, width: cal.caricaWidth, top: 0, left: 0})}},
    					{immagineCoors: (cal) => {return({height: cal.immagineHeight, width: cal.immagineWidth, top: cal.h -cal.immagineHeight, left: 0})}}
						]
				 }	
const calcGeometry = initCalcGeometry(geometryParams);

	

	


 
const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
		    totaleOccorrenze: 0,
    		geometry: calcGeometry()	
    				}
	return initialStateHelper(eiis, extraState);
    }
    


 
    
//Metodi reducer per le Form
const rigaInventarioR = new FormReducer(
						{scene: 'INVENTARIO',
						foundCompleteItem: foundCompleteItem,
								transformItem: null, 
								transformSelectedItem: null, 
								initialState: initialState, 
								keepOnSubmit: false, 
								calcGeometry: calcGeometry}); 


var stockMap = new Map();



//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaInventario(cei, name, value)
{  	
	cei.values[name] = value;
	//Gestione cambiamenti... forse non serve...
    switch (name) {
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

  
		
     errMgmt(cei, 'pezzi','notInteger','numero intero',  ((value) => {return !isInteger(value)})(cei.values.pezzi));
  	
  	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}


function foundCompleteItem(editedItem, action) 
	{   
		let cei = editedItemCopy(editedItem);
		//Copio l'esito della ricerca...
			cei.values = {...cei.values, ...action.item}
        /*
    	cei.values.titolo = action.item.titolo;
    	cei.values.autore = action.item.autore;
    	cei.values.prezzoListino = action.item.prezzoListino;
    	if (action.item.stock) cei.values.stock = action.item.stock; 
    	if ('editore' in cei.values) cei.values.editore = action.item.editore;
    	*/
     	
    	//Il form e' potenzialmente valido... sgancio gli errori...
    	//Se sono qui... EAN è sicuramente valido...
        noErrors(cei,'ean');
        noErrors(cei,'form');
      	 cei.isValid = isValidEditedItem(cei);
      	 cei.willFocus = 'pezzi';
       return(cei);
	}

export default function inventario(state = initialState(), action) {
  var newState;
  switch (action.type) {
    
 
   case GENERA_RIGHE_INVENTARIO:
   	    newState = state;
   	    break;
  
   	 case rigaInventarioR.ADDED_ITEM:
		 	{
		 	if (state.itemsArrayIndex[action.payload.key]!==undefined) newState = state;
		 	else newState = childAdded(action.payload, state, "itemsArray", "itemsArrayIndex", rigaInventarioR.transformItem); 
		 	//Se ho un dato migliore per stock lo metto qui...
		 	let ean = action.payload.val().ean;
		 	let key = action.payload.key;
		 	if (newState.estrattoStoricoMagazzino[ean]) newState.itemsArray[newState.itemsArrayIndex[key]].stock = state.stock[ean];
		 	}
		 	newState.tableScrollByKey = action.payload.key;
	    	
	    	break;
	  case rigaInventarioR.INITIAL_LOAD_ITEM:
		  let obj = state.estrattoStoricoMagazzino;
			if (obj)
				{Object.keys(obj).forEach(key => {
    				stockMap.set(key, obj[key].stock);
					});
				}	
		
		    newState = initialLoading(action.payload, state, "itemsArray", "itemsArrayIndex", rigaInventarioR.transformItem); 
		    
		 	//Se ho un dato migliore per stock lo metto qui...per ogni riga
		 	/*
		 	for (let key in action.payload.val())
		 		{
		 			let ean = action.payload.val()[key].ean;
		 			
		 			if (newState.estrattoStoricoMagazzino && newState.estrattoStoricoMagazzino[ean]) newState.itemsArray[newState.itemsArrayIndex[key]].stock = newState.stock[ean];
		 		}
		 	*/
		 	
		 	newState = {...newState, tableScroll: true};
		 	console.log("dati freschi pronti bis!")
	    	break;     
		case rigaInventarioR.DELETED_ITEM:
			newState = childDeleted(action.payload, state, "itemsArray", "itemsArrayIndex"); 
	       	break;
	   
		case rigaInventarioR.CHANGED_ITEM:
			newState = childChanged(action.payload, state, "itemsArray", "itemsArrayIndex", rigaInventarioR.transformItem); 
				//Se ho un dato migliore per stock lo metto qui...
		 	let key = action.payload.key;
		 	if (newState.estrattoStoricoMagazzino[key]) newState.itemsArray[newState.itemsArrayIndex[key]].stock = state.stock[key];
		    newState.tableScrollByKey = action.payload.key;
	        break;
	    //Arricchisco per andare alla riga quando ho un EAN valido...
	    case rigaInventarioR.CHANGE_EDITED_ITEM:
	    	newState = rigaInventarioR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaInventario);
            //Se sgto agendo su ho un EAN valido...
	        if (action.name === 'ean' && newState.editedItem.eanState === 'VALID' && state.itemsArrayIndex[action.value] >=0 ) newState.tableScrollByKey = action.value;
	    	break;	    
	    	
	    	
   	    	    
      default:
    
        newState = rigaInventarioR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaInventario);
        //newState =  state;
    	break;
   
  }
 return newState;
}

//Il mio primo selettore colocato https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers!!!
//Questi rimarranno identici in tutti i casi... Posso migliorare queste ripetizioni inutili?
 export const getItems = (state) => {return state.itemsArray};  
 export const getEditedItem = (state) => {return state.editedItem};  
 export const getTestataBolla = (state) => {return state.testata};
 export const getShowCatalogModal = (state) => {return state.showCatalogModal};  
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getTableScroll = (state)  => {return state.tableScroll};
 export const getListeningTestataBolla = (state) => {return state.listeningTestata};
 export const getListeningItemBolla = (state) => {return state.listeningItem};
 export const isStaleTotali = (state) => {return state.staleTotali};
 export const getMessageBuffer = (state) => {return state.messageBuffer};
 export const listeningDataMagazzino = (state) => {return state.listeningDataMagazzino};
 export const getDataMagazzino = (state) => {return state.dataMagazzino};
 export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 
 
 
 
      



