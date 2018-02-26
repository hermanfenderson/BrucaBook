//Gestione dello stato della applicazione (componente da persistere in caso di refresh della pagina)
import {TOGGLE_COLLAPSED, SET_MENU_SELECTED_KEYS, GET_URL_FROM_PATH} from '../actions';
export const SET_HEADER_INFO='SET_HEADER_INFO';

const initialState =  {
  collapsed: false,
  headerInfo: '',
  menuSelectedKeys: [],
  path2url: {}
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
     case SET_MENU_SELECTED_KEYS:
     	return {
      	 ...state,
        menuSelectedKeys: action.menuSelectedKeys
      	}
     case GET_URL_FROM_PATH:
     	let path2url={...state.path2url};
     	path2url[action.path] = action.url;
     	return {
      	 ...state,
        path2url: path2url
      	} 	
    default:
      return state;
  }
}

export const getCollapsed = (state) => {return state.collapsed};
export const getHeaderInfo = (state) => {return state.headerInfo};
export const getMenuSelectedKeys = (state) => {return state.menuSelectedKeys};
export const getPath2Url = (state) => {return state.path2url}; 

