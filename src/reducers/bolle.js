import {ADDED_RIGA_BOLLA } from '../actions/bolle';
import {DELETED_RIGA_BOLLA } from '../actions/bolle';
import {CHANGED_RIGA_BOLLA, TOTALI_CHANGED } from '../actions/bolle';
import {SET_SELECTED_RIGA_BOLLA } from '../actions/bolle';
import {TABLE_BOLLA_WILL_SCROLL } from '../actions/bolle';
import {RESET_BOLLA } from '../actions/bolle';

import { childAdded, childDeleted, childChanged } from '../helpers/firebase';

const initialState =  {
  righeBollaArray: [],
  righeBollaArrayIndex: {},
  selectedRigaBolla: null,
   tableBollaWillScroll: false,
   totali: {pezzi : 0, gratis : 0, prezzoTotale : 0.0}
};

export default function bolle(state = initialState, action) {
  switch (action.type) {
    
    case ADDED_RIGA_BOLLA:
       return (childAdded(action.payload, state, "righeBollaArray", "righeBollaArrayIndex")); 
      
   case DELETED_RIGA_BOLLA:
       return (childDeleted(action.payload, state, "righeBollaArray", "righeBollaArrayIndex")); 
   
   case CHANGED_RIGA_BOLLA:
       return (childChanged(action.payload, state, "righeBollaArray", "righeBollaArrayIndex")); 
    
   case TOTALI_CHANGED:
       	   if (action.payload) return {...state, totali: action.payload};
   
   case SET_SELECTED_RIGA_BOLLA:
       return {
        ...state, selectedRigaBolla: action.row
      }; 
      
     case TABLE_BOLLA_WILL_SCROLL:
       return {
        ...state,tableBollaWillScroll: action.scroll
      }; 
      
      case RESET_BOLLA:
      	return {
      		...initialState
      	}
      
    
      
       
    
    default:
      return state;
  }
}
