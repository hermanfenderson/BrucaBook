//Gestione dello stato della applicazione (componente da persistere in caso di refresh della pagina)
import {USER_INFO_CHANGED } from '../actions';

const initialState =  {
  catena: null,
  libreria: null
};

export default function status(state = initialState, action) {
  switch (action.type) {
  	 case USER_INFO_CHANGED:
      	return {
      	 ...state,
        catena: (action.info ? action.info.defaultCatena : null), //Questo in futuro cambia quando avrò gestione multi catena e multi libreria
        libreria: (action.info ? action.info.defaultLibreria : null), //Idem
       	}	
    default:
      return state;
  }
}

export const getCatena = (state) => {return state.catena}; 
export const getLibreria = (state) => {return state.libreria};

