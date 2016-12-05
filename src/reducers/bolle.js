import {ADDED_RIGA_BOLLA } from '../actions';
import {DELETED_RIGA_BOLLA } from '../actions';
import {CHANGED_RIGA_BOLLA } from '../actions';
import {SET_SELECTED_RIGA_BOLLA } from '../actions';

import {CALCOLA_SCONTO_MAN} from '../actions';
import {CALCOLA_SCONTO_AUT} from '../actions';
import { childAdded, childDeleted, childChanged } from '../helpers/firebase';

const initialState =  {
  righeBollaArray: [],
  righeBollaArrayIndex: {},
  selectedRigaBolla: null,
   discountGroupDisabled: false //Questo serve a ingrigire i campi sconto...
};

export default function bolle(state = initialState, action) {
  switch (action.type) {
    
    case ADDED_RIGA_BOLLA:
       return (childAdded(action.payload, state, "righeBollaArray", "righeBollaArrayIndex")); 
      
   case DELETED_RIGA_BOLLA:
       return (childDeleted(action.payload, state, "righeBollaArray", "righeBollaArrayIndex")); 
   
   case CHANGED_RIGA_BOLLA:
       return (childChanged(action.payload, state, "righeBollaArray", "righeBollaArrayIndex")); 
    
   case SET_SELECTED_RIGA_BOLLA:
       return {
        ...state, selectedRigaBolla: action.row
      }; 
      
     case CALCOLA_SCONTO_MAN:
       return {
        ...state, discountGroupDisabled: true
      }; 
     
      case CALCOLA_SCONTO_AUT:
       return {
        ...state, discountGroupDisabled: false
      }; 
      
       
    
    default:
      return state;
  }
}