import FormReducer from '../helpers/formReducer'
import {initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper} from '../helpers/form';
import {SET_ORDINIAPERTI_PER_EAN, SET_SHOW_ORDINIAPERTI_MODAL, SAVE_ORDINI_APERTI_DIFF} from '../actions/ordiniAperti';
import {ADDED_ITEM_ORDINIAPERTI,  CHANGED_ITEM_ORDINIAPERTI, DELETED_ITEM_ORDINIAPERTI,  INITIAL_LOAD_ITEM_ORDINIAPERTI, deltaOrdiniAperti} from '../helpers/ordiniAperti';

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
		              eanTreeBolla: {},
		              eanTreeScontrino: {}
    				
    		
    							
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
     case ADDED_ITEM_ORDINIAPERTI:
  	 case CHANGED_ITEM_ORDINIAPERTI:
  	 case	DELETED_ITEM_ORDINIAPERTI:
  	 case	INITIAL_LOAD_ITEM_ORDINIAPERTI:
  	 	//Solo gli ordini fino a R
  	 	var newStateTmp;
  	 	newStateTmp = {...state, eanTreeBolla: deltaOrdiniAperti(state.eanTreeBolla, action.payload, action.type, 'R' ), eanTreeScontrino: deltaOrdiniAperti(state.eanTreeScontrino, action.payload, action.type, 'Z' )};
   	    //Recupero il default
   	    newState = ordiniApertiR.updateState(newStateTmp,action,editedItemInitialState, null, null);
        
   	
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

export const getEanTreeBolla = (state) => {return state.eanTreeBolla};
export const getEanTreeScontrino = (state) => {return state.eanTreeScontrino};


export const getShowOrdiniApertiModal = (state) => {return state.showOrdiniApertiModal};


 