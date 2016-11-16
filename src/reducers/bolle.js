import {ADDED_RIGA_BOLLA } from '../actions';
import {DELETED_RIGA_BOLLA } from '../actions';


const initialState =  {
  righeBolla: {}
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
    
    default:
      return state;
  }
}