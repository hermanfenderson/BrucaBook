import {NEW_SCONTRINO, TOTALI_CASSA_CHANGED } from '../actions/casse';


import {ADDED_RIGA_SCONTRINO } from '../actions/scontrini';
import {DELETED_RIGA_SCONTRINO } from '../actions/scontrini';
import {CHANGED_RIGA_SCONTRINO, TOTALI_SCONTRINO_CHANGED } from '../actions/scontrini';
import {SET_SELECTED_RIGA_SCONTRINO } from '../actions/scontrini';
import {TABLE_SCONTRINO_WILL_SCROLL } from '../actions/scontrini';
import {RESET_SCONTRINO } from '../actions/scontrini';

import { childAdded, childDeleted, childChanged } from '../helpers/firebase';

const initialState =  {
  scontrinoId: null,
  righeScontrinoArray: [],
  righeScontrinoArrayIndex: {},
  selectedRigaScontrino: null,
   tableBollaWillScroll: false,
   totali: {scontrini : 0, prezzoTotale : 0.0}
};

export default function casse(state = initialState, action) {
  switch (action.type) {
    
    case NEW_SCONTRINO:  
    	return {...state, scontrinoId: action.payload};
       
    case ADDED_RIGA_SCONTRINO:
       return (childAdded(action.payload, state, "righeScontrinoArray", "righeScontrinoArrayIndex")); 
      
   case DELETED_RIGA_SCONTRINO:
       return (childDeleted(action.payload, state, "righeScontrinoArray", "righeScontrinoArrayIndex")); 
   
   case CHANGED_RIGA_SCONTRINO:
       return (childChanged(action.payload, state, "righeScontrinoArray", "righeScontrinoArrayIndex")); 
    
   case TOTALI_CASSA_CHANGED:
       	   if (action.payload) return {...state, totali: action.payload};
   
   case SET_SELECTED_RIGA_SCONTRINO:
       return {
        ...state, selectedRigaScontrino: action.row
      }; 
      
     case TABLE_SCONTRINO_WILL_SCROLL:
       return {
        ...state,tableScontrinoWillScroll: action.scroll
      }; 
      
      case RESET_SCONTRINO:
      	return {
      		...initialState
      	}
      
    
      
       
    
    default:
      return state;
  }
}
