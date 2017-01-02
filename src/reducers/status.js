//Gestione dello stato della applicazione (componente da persistere in caso di refresh della pagina)
import {SET_USER_STATUS, RESET_USER_STATUS } from '../actions';

const initialState =  {
  catena: null,
  libreria: null
};

export default function status(state = initialState, action) {
  switch (action.type) {
  	case SET_USER_STATUS:
  	    return {...state, catena: action.payload.catena, libreria: action.payload.libreria};	
  	case RESET_USER_STATUS:
  		return {...state, catena: null, libreria: null};
    default:
      return state;
  }
}