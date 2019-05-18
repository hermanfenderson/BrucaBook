import FormReducer from '../helpers/formReducer'
import {initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper} from '../helpers/form';
import {SET_ORDINIAPERTI_PER_EAN, SET_SHOW_ORDINIAPERTI_MODAL} from '../actions/ordiniAperti';
import {calcHeader} from '../helpers/geometry';

const editedRigaOrdineValuesInitialState = 
	  {			
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaOrdineValuesInitialState, {} ));
}

const headerParams = [{name: 'cliente', label: 'Cliente', min: 200, max: 200},
			    {name: 'dataOrdine', label: 'Data', min: 100, max:100},
			    {name: 'stato', label: 'Stato', min: 150, max: 150},
			    {name: 'pezzi', label: 'Ord.', min: 60, max: 60},
			   {name: 'pezziDelta', label: 'Ass.', min: 60, max: 60},
			     
			   ];

const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
		              eanArray: [],
		              geometry: {header: calcHeader(headerParams, 880),
		             	},
		              showOrdiniApertiModal: false,
    				
    		
    							
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
     case SET_SHOW_ORDINIAPERTI_MODAL:
     	newState = {...state, showOrdiniApertiModal: action.showOrdiniApertiModal};
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

export const getEanArray = (state) => {return state.eanArray};

export const getShowOrdiniApertiModal = (state) => {return state.showOrdiniApertiModal};
 