//Gestione dello stato della applicazione (componente da persistere in caso di refresh della pagina)
import {USER_INFO_CHANGED } from '../actions';

const initialState =  {
  info: null,
  user: null,
  authenticated: true //Questo evita rimbalzi in caso di refresh
};

export default function status(state = initialState, action) {
  switch (action.type) {
  	 case USER_INFO_CHANGED:
      	return {
      	 ...state,
      	 authenticated: action.authenticated,
        user: action.user,
        catena: action.catena,
        libreria: action.libreria,
        info: action.info
      	}	
    default:
      return state;
  }
}

export const getCatena = (state) => {if (state.info) return state.info.catena; else return null;}; //In futuro questo lo cambierà... il resto no!
export const getLibreria = (state) => {if (state.info) return state.info.libreria; else return null;};
export const isAuthenticated = (state) => {return state.authenticated};
export const getUser = (state) => {return state.user};

