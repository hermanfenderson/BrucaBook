import {ADDED_RIGA_BOLLA } from '../actions';
import {DELETED_RIGA_BOLLA } from '../actions';
import {CALCOLA_SCONTO_MAN} from '../actions';
import {CALCOLA_SCONTO_AUT} from '../actions';
import {SET_EAN_INPUT_REF} from '../actions';


const initialState =  {
  righeBolla: {},
  selectedRigaBolla: null,
  eanInputRef: null,
  discountGroupDisabled: false //Questo serve a ingrigire i campi sconto...
};

export default function bolle(state = initialState, action) {
  switch (action.type) {
    case ADDED_RIGA_BOLLA:
      var righeBollaNew = {...(state.righeBolla)}; //Copia profonda di un oggetto...
      righeBollaNew[action.payload.key] = action.payload.val();
      console.log(action.payload);
      console.log(righeBollaNew);
      return {
        ...state, righeBolla: righeBollaNew
      };
      
   case DELETED_RIGA_BOLLA:
      //console.log(action.payload.val());
      //console.log(action.payload.key);
      var righeBollaNew2 = {...(state.righeBolla)}; //Copia profonda di un oggetto...
      delete righeBollaNew2[action.payload.key];
      console.log(action.payload);
      console.log(righeBollaNew2);
       return {
        ...state, righeBolla: righeBollaNew2
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
        console.log(action.input);
         return {
        ...state, eanInputRef: action.input
      }; 
     
    
    default:
      return state;
  }
}