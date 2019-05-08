import FormReducer from '../helpers/formReducer'
import {initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper} from '../helpers/form';

const editedRigaOrdineValuesInitialState = 
	  {			
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaOrdineValuesInitialState, {} ));
}

const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
		
    							
    				}

	return initialStateHelper(eiis,extraState);
    }

const ordiniApertiR = new FormReducer('ORDINIAPERTI', null, null, null, initialState); 

export default function Ordine(state = initialState(), action) {
  var newState;
  switch (action.type) {
    
   
    default:
        newState = ordiniApertiR.updateState(state,action,editedItemInitialState, null, null);
        //newState =  state;
    	break;
   
  }
 return newState;
}


export const getItems = (state) => {return state.itemsArray};  
 
export const getListeningItemOrdine = (state) => {return state.listeningItem};
 