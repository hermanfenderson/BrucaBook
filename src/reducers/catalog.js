import {UPDATE_CATALOG_ITEM, SEARCH_CATALOG_ITEM, SET_CATALOG_STATE, SET_CATALOG_ITEM, SET_CATALOG_EAN } from '../actions/catalog';
import {IDLE, SEARCH, FAIL, ABORT, INCOMPLETE, OK } from '../actions/catalog';
//Stati di una ricerca... fail non ho tovato.. Abort è annullato dall'utente...
import { childAdded, childDeleted, childChanged } from '../helpers/firebase';

const initialState =  {
  item: null,
  ean: null,
  img: null,
  status: IDLE,
  statusText: ""
};

export default function catalog(state = initialState, action) {
  switch (action.type) {
    case SET_CATALOG_STATE:
      return {
        ...state,
        status: action.status,
        statusText: action.statusText
      };
    case SET_CATALOG_ITEM:
      return {
        ...state,
       item: action.item
      };  
     case SET_CATALOG_EAN:
      return {
        ...state,
       ean: action.ean
      };    
    default:
      return state;
  }
}