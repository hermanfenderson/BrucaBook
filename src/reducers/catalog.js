import {UPDATE_CATALOG_ITEM} from '../actions/catalogo';
import {SEARCH_CATALOG_ITEM } from '../actions/catalogo';

import { childAdded, childDeleted, childChanged } from '../helpers/firebase';

const initialState =  {
  catalogItem: null,
};

export default function catalog(state = initialState, action) {
  switch (action.type) {     
    default:
      return state;
  }
}