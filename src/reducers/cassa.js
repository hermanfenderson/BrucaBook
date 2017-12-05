import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';

import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, isValidEditedItem} from '../helpers/form';
import moment from 'moment';

const ADD_ITEM_CASSA = 'ADD_ITEM_CASSA';
const CHANGE_ITEM_CASSA = 'CHANGE_ITEM_CASSA';
const DELETE_ITEM_CASSA = 'DELETE_ITEM_CASSA';

const ADD_ITEM_SCONTRINO = 'ADD_ITEM_SCONTRINO';
const CHANGE_ITEM_SCONTRINO= 'CHANGE_ITEM_SCONTRINO';
const DELETE_ITEM_SCONTRINO = 'DELETE_ITEM_SCONTRINO';
const SET_REDIRECT_CASSA = 'SET_REDIRECT_CASSA';

const editedRigaCassaValuesInitialState = 
	  {			numeroScontrino: 1,
	            oraScontrino: null,
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaCassaValuesInitialState, {} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {shouldRedirect : false,
                  }
	return initialStateHelper(eiis,extraState);
    }
    
    
const transformSelectedItem = (cei) =>
{
    var	oraScontrino = moment(cei.dataCassa);
    oraScontrino.hour(moment(cei.oraScontrino, "HH:mm").hour());
    oraScontrino.minute(moment(cei.oraScontrino, "HH:mm").minute());
	cei.oraScontrino = oraScontrino;

}

const transformEditedCassa = (row) =>
{   
	row.oraScontrino = moment(row.oraScontrino).format("HH:mm");
}



 
    
//Metodi reducer per le Form
const rigaCassaR = new FormReducer('CASSA', null, transformEditedCassa, transformSelectedItem, initialState, true); 




//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaCassa(cei, name, value)
{  	
	cei.values[name] = value;

  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
    errMgmt(cei, 'oraScontrino','invalidTime','Ora non valida',  (!cei.values.oraScontrino.isValid()));
  
  	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}




export default function cassa(state = initialState(), action) {
  var newState;
  switch (action.type) {
   case SET_REDIRECT_CASSA:
   		newState = {...state, shouldRedirect: action.shouldRedirect};
   		break;
   case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] -100;
   	    newState = {...state, tableHeight: height};
        break;
   //Over-ride del reducer form... gestisco diversamente i totali...     
   case ADD_ITEM_CASSA:
   case CHANGE_ITEM_CASSA:
   case DELETE_ITEM_CASSA:
   	
	     	newState =  {...state, staleTotali: false}
	    	break;	
	//I totali sono stale se cambia una voce dello scontrino sottostante... non la cassa in se!    	
    case ADD_ITEM_SCONTRINO:
   case CHANGE_ITEM_SCONTRINO:
   case DELETE_ITEM_SCONTRINO:
   	
	     	newState =  {...state, staleTotali: true, lastActionKey : action.key}
	    	break;	    	
    default:
        newState = rigaCassaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaCassa);
        //newState =  state;
    	break;
   
  }
 return newState;
}

//Il mio primo selettore colocato https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers!!!
//Questi rimarranno identici in tutti i casi... Posso migliorare queste ripetizioni inutili?
 export const getItems = (state) => {return state.itemsArray};  
 export const getEditedItem = (state) => {return state.editedItem};  
 export const getTestataCassa = (state) => {return state.testata};
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getTableScroll = (state)  => {return state.tableScroll};
 export const getMeasures = (state) => {return state.measures};
 export const getListeningTestataCassa = (state) => {return state.listeningTestata};
 export const getListeningItemCassa = (state) => {return state.listeningItem};
 export const isStaleTotali = (state) => {return state.staleTotali};
 export const shouldRedirect = (state) => {return state.shouldRedirect};
 
 
 
 
      



