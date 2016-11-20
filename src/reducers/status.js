//Gestione dello stato della applicazione (componente da persistere in caso di refresh della pagina)
import {RESET_STATUS } from '../actions';

const initialState =  {
  catena: "A",
  libreria: "B"
};

export default function status(state = initialState, action) {
  switch (action.type) {
    case RESET_STATUS:
      return {
        catena: null,
        libreria: null
      }
    default:
      return state;
  }
}