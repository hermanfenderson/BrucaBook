//Gestione dello stato della applicazione (componente da persistere in caso di refresh della pagina)
import {TOGGLE_COLLAPSED} from '../actions';
export const SET_HEADER_INFO='SET_HEADER_INFO';

const initialState =  {
  collapsed: false,
  headerInfo: ''
};

export default function status(state = initialState, action) {
  switch (action.type) {
  	 case TOGGLE_COLLAPSED:
      	return {
      	 ...state,
        collapsed: !state.collapsed
      	}	
     case SET_HEADER_INFO:
     	return {
      	 ...state,
        headerInfo: action.headerInfo
      	}
    default:
      return state;
  }
}

export const getCollapsed = (state) => {return state.collapsed};
export const getHeaderInfo = (state) => {return state.headerInfo};

