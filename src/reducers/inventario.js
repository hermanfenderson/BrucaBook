import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';
import {GENERA_RIGHE_INVENTARIO} from '../actions/inventario';

import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  noErrors,eanState, updateEANErrors} from '../helpers/form';


const editedRigaBollaValuesInitialState = 
	  {			ean: '',
				titolo: '',
				autore: '',
				prezzoListino: '',
				stock: 0,
				pezzi: 0,
				imgUrl: ''	
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaBollaValuesInitialState, {} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
	return initialStateHelper(eiis,{});
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

  
		
     errMgmt(cei, 'pezzi','notInteger','numero intero',  ((value) => {return !Number.isInteger(value)})(cei.values.pezzi));
  	
  	
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
    	if (action.item.stock) cei.values.stock = action.item.stock; 
    	if ('editore' in cei.values) cei.values.editore = action.item.editore;
    	
     	
    	//Il form e' potenzialmente valido... sgancio gli errori...
    	//Se sono qui... EAN è sicuramente valido...
        noErrors(cei,'ean');
        noErrors(cei,'form');
      	 cei.isValid = isValidEditedItem(cei);
       return(cei);
	}

export default function inventario(state = initialState(), action) {
  var newState;
  switch (action.type) {
    
   case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formInventarioHeight'] -150;
   	    newState = {...state, tableHeight: height};
        break;
   case GENERA_RIGHE_INVENTARIO:
   	    newState = state;
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
 
 
 
 
      



