//Helper per generare automagicamente un pezzo del reducer nel caso debba gestire una specifica scene...
//E' polimorfico!  Se non esiste un campo EAN... si comporta senza doppi salti ecc ecc...
import {errMgmt, editedItemCopy, showError, showAllErrors} from '../helpers/form';
import {isValidEAN, generateEAN} from '../helpers/ean';
import {isValidBookCode} from '../helpers/validators';
import { childAdded, childDeleted, childChanged, initialLoading } from '../helpers/firebase';
import React from 'react';

//la funzione transforItem se c'e' è responsabile di trasformare il risultato di firebase in uno compatibile con la tabella che voglio
//mostrare.
//la funzione transformSelectedItem prende invece dalla riga in tabella e la porta verso il form...
//KeepOnSubmit non resetta il form al submit... serve per le casse..
function FormReducer(scene, foundCompleteItem, transformItem,transformSelectedItem, initialState, keepOnSubmit) {
this.scene = scene;
this.UPDATE_CATALOG_ITEM = 'UPDATE_CATALOG_ITEM_'+scene;
this.SEARCH_CATALOG_ITEM = 'SEARCH_CATALOG_ITEM_'+scene;
this.SEARCH_CLOUD_ITEM = 'SEARCH_CLOUD_ITEM_'+scene;
this.FOUND_CLOUD_ITEM = 'FOUND_CLOUD_ITEM_'+scene;
this.FOUND_CATALOG_ITEM = 'FOUND_CATALOG_ITEM_'+scene;
this.NOT_FOUND_CLOUD_ITEM = 'NOT_FOUND_CLOUD_ITEM_'+scene;
this.NOT_FOUND_CATALOG_ITEM = 'NOT_FOUND_CATALOG_ITEM_'+scene;
this.RESET_EDITED_CATALOG_ITEM = 'RESET_EDITED_CATALOG_ITEM_'+scene;
this.SUBMIT_EDITED_CATALOG_ITEM = 'SUBMIT_EDITED_CATALOG_ITEM_'+scene;

this.SET_READ_ONLY_FORM = 'SET_READ_ONLY_FORM_'+scene;
this.SET_FILTER = 'SET_FILTER_'+scene;
this.RESET_FILTER = 'RESET_FILTER_'+scene;


this.CHANGE_EDITED_ITEM = 'CHANGE_EDITED_ITEM_'+scene;
this.SUBMIT_EDITED_ITEM = 'SUBMIT_EDITED_ITEM_'+scene;
this.SET_SELECTED_ITEM = 'SET_SELECTED_ITEM_'+scene;
this.RESET_EDITED_ITEM = 'RESET_EDITED_ITEM_'+scene;
this.LISTEN_ITEM='LISTEN_ITEM_'+scene;
this.OFF_LISTEN_ITEM='OFF_LISTEN_ITEM_'+scene;
this.ADD_EAN_LISTENER = 'ADD_EAN_LISTENER_'+scene;


this.ADD_ITEM = 'ADD_ITEM_'+scene;
this.DELETE_ITEM = 'DELETE_ITEM_'+scene;
this.CHANGE_ITEM = 'CHANGE_ITEM_'+scene;
this.TOGGLE_PIN_ITEM = 'TOGGLE_PIN_ITEM_'+scene;

this.RESET='RESET_'+scene;

this.ADDED_ITEM = 'ADDED_ITEM_'+scene;
this.DELETED_ITEM = 'DELETED_ITEM_'+scene;
this.CHANGED_ITEM = 'CHANGED_ITEM_'+scene;
this.INITIAL_LOAD_ITEM = 'INITIAL_LOAD_ITEM_'+scene;
this.TOTALI_CHANGED = 'TOTALI_CHANGED_'+scene;
this.TOGGLE_TABLE_SCROLL = 'TOGGLE_TABLE_SCROLL_'+scene;
this.SET_TABLE_SCROLL_BY_KEY = 'SET_TABLE_SCROLL_BY_KEY_'+scene;

this.ADDED_STORICO_MAGAZZINO ='ADDED_STORICO_MAGAZZINO_'+scene;
this.CHANGED_STORICO_MAGAZZINO ='CHANGED_STORICO_MAGAZZINO_'+scene;
this.DELETED_STORICO_MAGAZZINO ='DELETED_STORICO_MAGAZZINO_'+scene;
this.INITIAL_LOAD_STORICO_MAGAZZINO ='INITIAL_LOAD_STORICO_MAGAZZINO_'+scene;
this.LISTEN_STORICO_MAGAZZINO ='LISTEN_STORICO_MAGAZZINO_'+scene;
this.UNLISTEN_STORICO_MAGAZZINO ='UNLISTEN_STORICO_MAGAZZINO_'+scene;
this.DATA_MAGAZZINO_CHANGED = 'DATA_MAGAZZINO_CHANGED_'+scene;

this.SET_TABLE_WINDOW_HEIGHT = 'SET_TABLE_WINDOW_HEIGHT_'+scene;
this.RESET_TABLE = 'RESET_TABLE_'+scene;
this.FOCUS_SET = 'FOCUS_SET_'+scene;
this.LISTEN_TESTATA='LISTEN_TESTATA_'+scene;
this.OFF_LISTEN_TESTATA='OFF_LISTEN_TESTATA_'+scene;
this.TESTATA_CHANGED = 'TESTATA_CHANGED_'+scene;
this.PUSH_MESSAGE = 'PUSH_MESSAGE_'+scene;
this.SHIFT_MESSAGE = 'SHIFT_MESSAGE_'+scene;

if (foundCompleteItem) this.foundCompleteItem = foundCompleteItem;
if (transformItem) this.transformItem = transformItem;
if (transformSelectedItem) this.transformSelectedItem = transformSelectedItem;


	
	//Questa funzione calcola gli stati ulteriori...l'override si fa definendo un case che reagisce alla stessa stringa nel padre...
	
	this.updateState =(state,action, editedItemInitialState, transformAndValidateEditedItem, calcolaTotali) =>
	{ var newState;
		switch(action.type)
		{
	
		case this.SET_READ_ONLY_FORM:
		{let cei = editedItemCopy(state.editedItem);
		cei.readOnlyForm=true;
		newState = {...state, editedItem: cei };
		}
		break;
    
 	case this.PUSH_MESSAGE: 
 		{
 		let messageBuf = [...state.messageBuffer];
 		messageBuf.push(action.element);
 		newState = {...state, messageBuffer: messageBuf};
 		}
 		break;
 		
  	case this.SHIFT_MESSAGE: 
 		{
 		let messageBuf = [...state.messageBuffer];
 		messageBuf.shift();
 		newState = {...state, messageBuffer: messageBuf};
 		}
 		break;
 		
 	case this.RESET_FILTER:
  		{
  		let filters = {}	
  		newState = {...state, filters: filters}	
  		}
  		break;	
  		
  	case this.SET_FILTER:
  		{
  		let filters = {...state.filters, [action.name]: action.value}	
  		newState = {...state, filters: filters}	
  		}
  		break;
	case this.TESTATA_CHANGED:
   	   if (action.payload) 
   		{   
   			newState = {...state, testata: action.payload};
   			if ((!state.lastActionKey) || (action.payload.totali && (action.payload.totali.lastActionKey === state.lastActionKey))) 
   				newState = {...newState, lastActionKey: null, staleTotali: false};
   		}
   			
   	   
   	 //  else newState = initialState(); //Ho gestito il caso che qualcuno mi cancella mentre sto scrivendo...
   	  else newState = state;
   	    break;
   	    
     case this.LISTEN_TESTATA:
	     	newState = {...state, listeningTestata: action.object}; 
	     	break;
   case this.OFF_LISTEN_TESTATA:
	     	newState = {...state, listeningTestata: null};
	     	break;
	     	
    case this.TOGGLE_TABLE_SCROLL:
		newState = {...state, tableScroll: action.toggle};
		break;
	 case this.SET_TABLE_SCROLL_BY_KEY:
		newState = {...state, tableScrollByKey: action.key};
		break;	
		
	case this.SEARCH_CATALOG_ITEM:
    case this.SEARCH_CLOUD_ITEM:	
    	{
    	let cei = editedItemCopy(state.editedItem);
    	cei.loading = true;
    	newState = {...state, editedItem: cei};
    	}
    	break;
    
    
    case this.NOT_FOUND_CATALOG_ITEM:
    	{
    	let cei = editedItemCopy(state.editedItem);
        cei.loading = false;
        cei.values.titolo = '';
    	cei.values.autore = '';
    	cei.values.prezzoListino = '';
    	
    	newState = {...state, editedItem: cei};
    	}
    	break;
    	
         
     case this.FOUND_CATALOG_ITEM:
     case this.FOUND_CLOUD_ITEM:
     	{
     	let cei = editedItemCopy(state.editedItem);
     	cei.loading = false;
        cei.eanState = 'COMPLETE';
           newState = {...state, editedItem: this.foundCompleteItem(cei, action)};
     	}
          break;
          
        
        
     case this.NOT_FOUND_CLOUD_ITEM:
     	//COMPRENDE ANCHE I CODICI INTERNI NON VALORIZZATI....
     	  {
     	  let cei = editedItemCopy(state.editedItem);
     	  
          cei.loading = false;
    	  newState = {...state, editedItem: cei, showCatalogModal : true};
     	  }
     	  
        break;
        
     case this.SUBMIT_EDITED_CATALOG_ITEM:
     	  //Se torno dal form sono sicuro che è completo...ma solo se il form è valido...
     	  if (action.isValid) newState = {...state, editedItem: foundCompleteItem(state.editedItem, action), showCatalogModal : false};
          else if (isValidEAN(state.editedItem.values.ean)) 
	    		     {
	    		      //Mostro gli errori nel form...
	    		      newState = {...state};
	    		     }
	    			
          else newState = state;
          break;
     
     case this.RESET_EDITED_CATALOG_ITEM:
     	  {
     	  let cei = editedItemCopy(state.editedItem);
     	  cei.values.ean = '';
     	  cei.eanState='BLANK';
     	  newState = {...state, editedItem: cei, showCatalogModal : false};
     	  }
          break;
  	
		case this.RESET_EDITED_ITEM:
	   	    newState = {...state, editedItem: {...editedItemInitialState()}}; //Reset dello stato della riga bolla...basta la copia superficiale
	   	    break;
	   	    
	   case this.CHANGE_EDITED_ITEM:
	      	newState =  {...state, editedItem: transformAndValidateEditedItem(editedItemCopy(state.editedItem), action.name, action.value, state.itemsArray)};
			break;
		
	   case this.SET_SELECTED_ITEM:
	   	   {
	   	   let cei = editedItemCopy(state.editedItem);
	   	   cei.selectedItem = action.row;
	   	   cei.values = {...action.row};
	   	   if (this.transformSelectedItem) transformSelectedItem(cei.values);
	   	   cei.eanState = 'COMPLETE';
	   	   cei.errors = {};
	   	   cei.errorMessages = {};
	   	   cei.isValid = true;
	       newState =  {...state, editedItem: cei}; 
	   	   }
		   break;
	 		
	   case this.SUBMIT_EDITED_ITEM:
		    //Posso sottomettere il form se lo stato della riga è valido
				
			if (state.editedItem.isValid)
		    	{
		    	if (keepOnSubmit) newState = state;
		    	else  newState = {...state, editedItem: {...editedItemInitialState()}};  //Reset dello stato della riga bolla...basta la copia superficiale
		    	}
		    else if ('ean' in state.editedItem.values)
		    	{
		    	let cei = {...state.editedItem};
	            //Se il form è invalid... e EAN è valido... Mostro gli altri errori (non posso farti salvare...)
		    	if (isValidEAN(state.editedItem.values.ean)) 
		    		     {
		    		     	//Mostro TUTTI gli errori del form...
		    		     	showAllErrors(cei); 
		    		     }
		    	else 
		    			{
		    			if (isValidBookCode(state.editedItem.values.ean)) //Altrimenti parto alla ricerca di un codice breve
		    				{
		    				cei.values.ean = generateEAN(cei.values.ean);
		    				cei.eanState = 'VALID'; //Valido per definizione...appena generato
		    	        	cei.loading = true;
		    				}
		    			else
		    				{
		    				//Se arrivo qui è un codice troppo lungo per codice e troppo corto per EAN
		    				if (cei.eanState === 'FILL') errMgmt(cei, 'ean','invalidEAN','codice (max. 8) o EAN (13) ',true);
		    				}
		    			}
                  newState = {...state, editedItem: cei};			    			
		    	}		
		    else {
		    	  let cei = {...state.editedItem};
		    	  showError(cei,'form'); 
		    	  newState = {...state, editedItem: cei};	
		    	 }
		    
	        break;
	     case this.LISTEN_ITEM:
	     	let listenersItem = {...state.listenersItem, ...action.listeners};
	     	newState = {...state, listeningItem: action.params, listenersItem: listenersItem}; 
	     	
	     	break;
	     case this.OFF_LISTEN_ITEM:
	     	newState = {...state, listeningItem: null};
	     	break;


	     case this.ADD_ITEM:
	     case this.DELETE_ITEM:
	     case this.CHANGE_ITEM:
	     	newState =  {...state, staleTotali: true, lastActionKey : action.key}
	    	break;
	     
	     case this.TOGGLE_PIN_ITEM:
	     	newState = state;
	     	break;
	     	
		 case this.ADDED_ITEM:
		 	if (state.itemsArrayIndex[action.payload.key]!==undefined) newState = state;
		 	else newState = childAdded(action.payload, state, "itemsArray", "itemsArrayIndex", this.transformItem); 
		    if (calcolaTotali) newState = calcolaTotali(newState); //Se mi viene passata una funzione di calcolo totali la applico...
            newState.tableScrollByKey = action.payload.key;
	    	break;
	       
		case this.DELETED_ITEM:
	    	newState = childDeleted(action.payload, state, "itemsArray", "itemsArrayIndex"); 
	    	 if (calcolaTotali) newState = calcolaTotali(newState); 
  
	    	break;
	   
		case this.CHANGED_ITEM:
			newState = childChanged(action.payload, state, "itemsArray", "itemsArrayIndex", this.transformItem); 
			 if (calcolaTotali) newState = calcolaTotali(newState);
			      newState.tableScrollByKey = action.payload.key;
	    
  
	    	break;
	    case this.INITIAL_LOAD_ITEM:
	    	 console.log("dati freschi!");
	    
	    	newState = initialLoading(action.payload, state, "itemsArray", "itemsArrayIndex", this.transformItem);
	    	newState = {...newState, tableScroll: true};
	    	 if (calcolaTotali) newState = calcolaTotali(newState);
            console.log("dati freschi pronti!");
	    
	    	break;
	  
	   case this.TOTALI_CHANGED:
	   	    if (action.payload) newState =  {...state, totali: action.payload};
	       	else newState = state;
			break;
			
	   case this.SET_TABLE_WINDOW_HEIGHT:
	   	    const newMeasures = {...state.measures, 'tableWindowHeight': action.tableWindowHeight}
	   	    newState = {...state, measures: newMeasures};
	   	    break;
	    case this.FOCUS_SET:
	    	 let cei = {...state.editedItem}; //Basta la shallow copy
	    	 cei.willFocus = null;
	   	   newState = {...state, editedItem: cei};
	   	    break;	    
	   	case this.RESET_TABLE:
	   		newState = {...state, itemsArray: [], itemsArrayIndex: {} }
            break;
            
         case this.RESET:
   	    //Trucchismo.... salvo l'altezza della tabella e le altre geometrie
   	    const tableHeight = state.tableHeight;
   	    const geometry = state.geometry;
      	newState =  {...initialState(), tableHeight: tableHeight, geometry: geometry};
		break;
		
	
			
      //Viene attivato solo se ho il listener attivo...  
      case 'ADDED_ITEM_MAGAZZINO':
      case	'CHANGED_ITEM_MAGAZZINO':
      	    let ean = action.payload.key;
      	    let createdAt = action.payload.val().createdAt;
      	    
      	    //Se ero in ascolto...smettto di ascoltare e metto il messaggio nel buffer...
      	    if (state.eanListeners && state.eanListeners[ean] && state.eanListeners[ean] < createdAt )
	      	   {
	      	   	   let pezzi = action.payload.val().pezzi;
      		   let titolo = action.payload.val().titolo;
      	 
	      	   	let eanListeners = {...state.eanListeners};
	      	   	delete eanListeners[ean];
	      	   	let element = <span><span style={{fontWeight: 'bold'}}>{titolo}</span><span> a magazzino: </span><span style={{fontWeight: 'bold'}}>{pezzi}</span></span>
  
				let messageBuf = [...state.messageBuffer];
 				messageBuf.push(element);
 			 	newState = {...state, eanListeners: eanListeners,messageBuffer: messageBuf};
	      	   }
      	   	else newState =  state;
    		
      	   break;
      	   
      case this.ADD_EAN_LISTENER:
      	   let listeners = {...state.eanListeners}
           listeners[action.ean] = action.timestamp;
           newState = {...state, eanListeners: listeners};
           
           break;
           

	    	
	 case this.LISTEN_STORICO_MAGAZZINO:
   	    newState = {...state, listeningStoricoMagazzino: action.params[0]};
   	    break;
    
    case this.INITIAL_LOAD_STORICO_MAGAZZINO:
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
        
    case this.ADDED_STORICO_MAGAZZINO:
   	case this.CHANGED_STORICO_MAGAZZINO:
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
    
    
   	case this.DELETED_STORICO_MAGAZZINO:
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
   	case this.DATA_MAGAZZINO_CHANGED:
   		
   		newState = {...state, dataMagazzino: action.dataMagazzino};	
   		
   		break;
    default:
        		newState =  state;
    		break;
			}
	 
	return(newState);	
	}

}
export default FormReducer

export const getItems = (state) => {return state.itemsArray};  
export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 export const getEditedItem = (state) => {return state.editedItem};  
 export const getTestata = (state) => {return state.testata};
 export const getShowCatalogModal = (state) => {return state.showCatalogModal};  
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getTableScroll = (state)  => {return state.tableScroll};
 export const getListeningTestata = (state) => {return state.listeningTestata};
 export const getListeningItem = (state) => {return state.listeningItem};
 export const isStaleTotali = (state) => {return state.staleTotali};
 export const getMessageBuffer = (state) => {return state.messageBuffer};
 export const listeningDataMagazzino = (state) => {return state.listeningDataMagazzino};
 export const getDataMagazzino = (state) => {return state.dataMagazzino};
 export const getGeometry = (state) => {return state.geometry};
 export const getFilters= (state) => {return state.filters};
 