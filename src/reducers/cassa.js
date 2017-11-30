import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';

import {isAmount, isNotNegativeInteger,  isPercentage} from '../helpers/validators';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  noErrors,eanState, updateEANErrors} from '../helpers/form';
import moment from 'moment';

const editedRigaCassaValuesInitialState = 
	  {			numeroScontrino: 1,
	            oraScontrino: null,
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaCassaValuesInitialState, {} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
                  }
	return initialStateHelper(eiis,extraState);
    }
    
    
const transformSelectedItem = (cei) =>
{
	cei.oraScontrino = moment(cei.oraScontrino);

}



 
    
//Metodi reducer per le Form
const rigaCassaR = new FormReducer('CASSA', null, null, transformSelectedItem, initialState); 




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
    
   case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] -100;
   	    newState = {...state, tableHeight: height};
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
 
 
 
 
      



