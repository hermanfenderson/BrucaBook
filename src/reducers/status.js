//Gestione dello stato della applicazione (componente da persistere in caso di refresh della pagina)
import {USER_INFO_CHANGED } from '../actions';

const initialState =  {
  catena: null,
  libreria: null,
  nomeLibreria: '',
  nick: ''
};

export default function status(state = initialState, action) {
  switch (action.type) {
  	 case USER_INFO_CHANGED:
      	return {
      	 ...state,
        catena: (action.info ? action.info.defaultCatena : null), //Questo in futuro cambia quando avrò gestione multi catena e multi libreria
        libreria: (action.info ? action.info.defaultLibreria : null), //Idem
        nomeLibreria: (action.info ? action.info.elencoLibrerie[action.info.defaultCatena].librerie[action.info.defaultLibreria] : null), //Idem
        nick: (action.info ? action.info.nick : null)
       	}	
    default:
      return state;
  }
}

export const getCatena = (state) => {return state.catena}; 
export const getLibreria = (state) => {return state.libreria};
export const getInfo = (state) => {return state};

