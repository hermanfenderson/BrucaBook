import {FETCH_RIGHE_BOLLA } from '../actions';

const initialState =  {
  righeBolla: {}
};

export default function bolle(state = initialState, action) {
  switch (action.type) {
    case FETCH_RIGHE_BOLLA:
      //console.log(action.payload.val());
      //console.log(action.payload.key);
      var righeBollaNew = {...(state.righeBolla)}; //Copia profonda di un oggetto...
      righeBollaNew[action.payload.key] = action.payload.val();
     
      return {
        ...state, righeBolla: righeBollaNew
      };
    
    default:
      return state;
  }
}