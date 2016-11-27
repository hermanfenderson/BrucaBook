import {ADDED_RIGA_BOLLA } from '../actions';
import {DELETED_RIGA_BOLLA } from '../actions';
import {CALCOLA_SCONTO_MAN} from '../actions';
import {CALCOLA_SCONTO_AUT} from '../actions';
import {SET_EAN_INPUT_REF} from '../actions';


const initialState =  {
  righeBollaArray: [],
  righeBollaArrayIndex: {},
  selectedRigaBolla: null,
  eanInputRef: null,
  discountGroupDisabled: false //Questo serve a ingrigire i campi sconto...
};

export default function bolle(state = initialState, action) {
  switch (action.type) {
    case ADDED_RIGA_BOLLA:
      var righeBollaArrayNew = state.righeBollaArray.slice();
      var righeBollaArrayIndexNew = {...(state.righeBollaArrayIndex)};
      var tmp = action.payload.val();
      tmp['key'] = action.payload.key;
       righeBollaArrayNew.push(tmp);
      righeBollaArrayIndexNew[action.payload.key] = righeBollaArrayNew.length - 1;
      
       return {
        ...state, righeBollaArray: righeBollaArrayNew, righeBollaArrayIndex: righeBollaArrayIndexNew
      };
      
   case DELETED_RIGA_BOLLA:
       var righeBollaArrayNew2 = state.righeBollaArray.slice();
      var righeBollaArrayIndexNew2 = {...(state.righeBollaArrayIndex)};
      
     
      var index = righeBollaArrayIndexNew2[action.payload.key];
       delete righeBollaArrayIndexNew2[action.payload.key]
      righeBollaArrayNew2.splice(index,1);
      for(var propt in righeBollaArrayIndexNew2){
          if (righeBollaArrayIndexNew2[propt] > index) righeBollaArrayIndexNew2[propt]--;
      }
      
      return {
        ...state, righeBollaArray: righeBollaArrayNew2, righeBollaArrayIndex: righeBollaArrayIndexNew2
     
      };
      
     case CALCOLA_SCONTO_MAN:
       return {
        ...state, discountGroupDisabled: true
      }; 
     
      case CALCOLA_SCONTO_AUT:
       return {
        ...state, discountGroupDisabled: false
      }; 
      
       case SET_EAN_INPUT_REF:
          return {
        ...state, eanInputRef: action.input
      }; 
     
    
    default:
      return state;
  }
}