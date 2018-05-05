import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';
import {GENERA_RIGHE_INVENTARIO,LISTEN_STORICO_MAGAZZINO_INVENTARIO, UNLISTEN_STORICO_MAGAZZINO_INVENTARIO,
INITIAL_LOAD_STORICO_MAGAZZINO_INVENTARIO, ADDED_STORICO_MAGAZZINO_INVENTARIO, CHANGED_STORICO_MAGAZZINO_INVENTARIO, DELETED_STORICO_MAGAZZINO_INVENTARIO, 
DATA_MAGAZZINO_CHANGED} from '../actions/inventario';
import { childAdded, childDeleted, childChanged, initialLoading } from '../helpers/firebase';


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


const initialState = () => {
    const eiis = editedItemInitialState();
	return initialStateHelper(eiis,{totaleOccorrenze: 0});
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
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formRigaInventarioHeight'] -180;
   	    newState = {...state, tableHeight: height};
        break;
   case GENERA_RIGHE_INVENTARIO:
   	    newState = state;
   	    break;
   /*	
   case LISTEN_STORICO_MAGAZZINO_INVENTARIO:
   	    newState = {...state, listeningStoricoMagazzino: action.params[0]};
   	    break;
    
    case INITIAL_LOAD_STORICO_MAGAZZINO_INVENTARIO:
    	{
   	   let estrattoStoricoMagazzino = {...state.estrattoStoricoMagazzino};
   	    let itemsArray = [...state.itemsArray];
   	    let itemsArrayIndex = state.itemsArrayIndex;
   	    let totaleOccorrenze = state.totaleOccorrenze;
   	    let stock = {...state.stock};
   	    	for (let ean in action.payload.val())
   	    		{
   	    		estrattoStoricoMagazzino[ean] = action.payload.val()[ean];
		   		stock[ean] = parseInt(action.payload.val()[ean].pezzi,10);
		   		if (stock[ean] !== 0) totaleOccorrenze++;
		   		if (itemsArrayIndex[ean] >= 0 ) itemsArray[itemsArrayIndex[ean]].stock = stock[ean];
   	    		}
		newState = {...state, estrattoStoricoMagazzino: estrattoStoricoMagazzino, itemsArray: itemsArray, stock: stock, totaleOccorrenze: totaleOccorrenze};
   		}
   	    break;
        
    case ADDED_STORICO_MAGAZZINO_INVENTARIO:
   	case CHANGED_STORICO_MAGAZZINO_INVENTARIO:
   		{
   	   let estrattoStoricoMagazzino = {...state.estrattoStoricoMagazzino};
   	    let itemsArray = [...state.itemsArray];
   	    let itemsArrayIndex = state.itemsArrayIndex;
   	    let totaleOccorrenze = state.totaleOccorrenze;
   	    let stock = {...state.stock};
   	    	let ean = action.payload.key;
		let oldStock = stock[ean] ? stock[ean] : null;  
   		estrattoStoricoMagazzino[ean] = action.payload.val();
   		stock[ean] = action.payload.val().pezzi;
   		
   		if ((oldStock === null) || (oldStock === 0 && stock[ean] !== 0)) totaleOccorrenze++;
   		else if (oldStock !== 0 && stock[ean] === 0) totaleOccorrenze--;
   		if (itemsArrayIndex[ean] >= 0 ) itemsArray[itemsArrayIndex[ean]].stock = stock[ean];
   	    newState = {...state, estrattoStoricoMagazzino: estrattoStoricoMagazzino, itemsArray: itemsArray, stock: stock, totaleOccorrenze: totaleOccorrenze};
   		}
   	    break;
    
    
   	case DELETED_STORICO_MAGAZZINO_INVENTARIO:
   	    {
   	    let estrattoStoricoMagazzino = {...state.estrattoStoricoMagazzino};
   	
   	    let stock = {...state.stock};
   	     let totaleOccorrenze = state.totaleOccorrenze;
   	   
   		delete estrattoStoricoMagazzino[action.payload.key];
   		delete stock[action.payload.key];
   		totaleOccorrenze--;
   	    newState = {...state, estrattoStoricoMagazzino: estrattoStoricoMagazzino, stock: stock, totaleOccorrenze: totaleOccorrenze};
   		}
   	    break;	        

   	 */   
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
	    	
	    	
   	    	    
   case UNLISTEN_STORICO_MAGAZZINO_INVENTARIO:
   	    newState = {...state, listeningStoricoMagazzino: false, estrattoStoricoMagazzino: {}, stock: {}, totaleOccorrenze: 0};
   	    break;        
   	    
    case DATA_MAGAZZINO_CHANGED:
    	newState = {...state, dataMagazzino: action.dataMagazzino};
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
 
 
 
 
      



