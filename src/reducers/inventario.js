import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';
import {GENERA_RIGHE_INVENTARIO} from '../actions/inventario';
import { childAdded, childDeleted, childChanged, initialLoading } from '../helpers/firebase';
import {calcFormCols, calcHeader} from '../helpers/geometry';


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

const tableWidth = 880 / 6 * 5 -24;
const colParams1 = [
	{name: 'ean', min: 170, max: 170},
	{name: 'titolo', min: 360},
	{name: 'autore', min: 160},
	];
 
 const colParams2 = [
	{name: 'listino', min: 65, max: 65},
	{name: 'stock', min: 65, max: 65},
	{name: 'delta', min: 404},

	{name: 'annulla', min: 55, max: 55},
	{name: 'inserisci', min: 55, max: 55},
	

	];
	
const headerParams = [
	{name: 'ean', label: 'EAN', min: 120, max: 120},
	{name: 'titolo', label: 'Titolo', min: 250},
	{name: 'autore', label: 'Autore', min: 110},
	{name: 'prezzoListino', label: 'Prezzo', min: 60, max: 60},
	{name: 'stock', label: 'Stock', min: 50, max: 50},
	{name: 'pezzi', label: 'Delta', min: 50, max: 50},

	] 

 
const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
		    totaleOccorrenze: 0,
    		geometry: {header: calcHeader(headerParams, tableWidth - 60), 
    				  formCols1: calcFormCols(colParams1,8,tableWidth), 
    				  formCols2: calcFormCols(colParams2,8,tableWidth), 
    				  
    				  	}		
    				}
	return initialStateHelper(eiis, extraState);
    }
    


 
    
//Metodi reducer per le Form
const rigaInventarioR = new FormReducer('INVENTARIO', foundCompleteItem, null, null, initialState); 







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
    
   case STORE_MEASURE:
   	    newState = state;
   	    
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	       if (action.newMeasure.name==='viewPortHeight')
   			{
   	  
   			 let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formRigaInventarioHeight'] -180;
   	    	newState = {...state, tableHeight: height};
   			}
   		   
   		    if (action.newMeasure.name==='viewPortWidth' || action.newMeasure.name==='siderWidth')
   	   		{
	   	   		let tableWidth = (measures['viewPortWidth'] -measures['siderWidth'] -16) * 5 / 6 - 8;	
	   			let formCols1 = calcFormCols(colParams1,8,tableWidth);
	   			let formCols2 = calcFormCols(colParams2,8,tableWidth);
	   		
	   			let header = calcHeader(headerParams, tableWidth - 60);
	   			let geometry = {...newState.geometry};
	   		newState = {...newState, geometry: {...geometry, formCols1: formCols1, formCols2: formCols2, header: header}};
   		
			}
        	
        break;
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
		 	
		    newState = initialLoading(action.payload, state, "itemsArray", "itemsArrayIndex", rigaInventarioR.transformItem); 
		 	//Se ho un dato migliore per stock lo metto qui...per ogni riga
		 	for (let key in action.payload.val())
		 		{
		 			let ean = action.payload.val()[key].ean;
		 			
		 			if (newState.estrattoStoricoMagazzino && newState.estrattoStoricoMagazzino[ean]) newState.itemsArray[newState.itemsArrayIndex[key]].stock = newState.stock[ean];
		 		}
		 	newState = {...newState, tableScroll: true};
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
 
 
 
 
      



