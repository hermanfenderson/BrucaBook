import {ADDED_RIGA_BOLLA } from '../actions/bolle';
import {DELETED_RIGA_BOLLA } from '../actions/bolle';
import {CHANGED_RIGA_BOLLA } from '../actions/bolle';
import {SET_SELECTED_RIGA_BOLLA } from '../actions/bolle';
import {TABLE_BOLLA_WILL_SCROLL } from '../actions/bolle';
import { childAdded, childDeleted, childChanged } from '../helpers/firebase';

const initialState =  {
  righeBollaArray: [],
  righeBollaArrayIndex: {},
  selectedRigaBolla: null,
   tableBollaWillScroll: false 
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
      
     case TABLE_BOLLA_WILL_SCROLL:
       return {
        ...state,tableBollaWillScroll: action.scroll
      }; 
      
    
      
       
    
    default:
      return state;
  }
}
