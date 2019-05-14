import FormReducer from '../helpers/formReducer'
import {initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper} from '../helpers/form';
import {SET_ORDINIAPERTI_PER_EAN} from '../actions/ordiniAperti';
const editedRigaOrdineValuesInitialState = 
	  {			
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaOrdineValuesInitialState, {} ));
}

const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
		              eanTree: {}
    							
    				}

	return initialStateHelper(eiis,extraState);
    }

const ordiniApertiR = new FormReducer('ORDINIAPERTI', null, null, null, initialState); 

export default function Ordine(state = initialState(), action) {
  var newState;
   
  switch (action.type) {
     case SET_ORDINIAPERTI_PER_EAN:
     	newState = {...state, eanArray: action.eanArray};
     	break;
     default:
        newState = ordiniApertiR.updateState(state,action,editedItemInitialState, null, null);
        //newState =  state;
    	break;
   
  }
 return newState;
}


export const getItems = (state) => {return state.itemsArray};  
 
export const getListeningItemOrdine = (state) => {return state.listeningItem};
 