//Gestione dello stato della applicazione (componente da persistere in caso di refresh della pagina)
import {TOGGLE_COLLAPSED} from '../actions';

const initialState =  {
  collapsed: false,
};

export default function status(state = initialState, action) {
  switch (action.type) {
  	 case TOGGLE_COLLAPSED:
      	return {
      	 ...state,
        collapsed: !state.collapsed
      	}	
    default:
      return state;
  }
}

export const getCollapsed = (state) => {return state.collapsed};

