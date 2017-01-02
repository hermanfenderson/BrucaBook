import { combineReducers } from 'redux';
import AuthReducer from './auth';
import MeasuresReducer from './measures';
import { combineForms } from 'react-redux-form';
import CatalogReducer from './catalog';
import ItemCatalogReducer from './itemCatalog';
import ModalReducer from './modal';
import BolleReducer from './bolle';
import StatusReducer from './status';
import RigaBollaReducer from './rigaBolla'; 

import { reducer as FormReducer } from 'redux-form';

const rootReducer = combineReducers({
  auth: AuthReducer,
  bolle: BolleReducer,
  catalog: CatalogReducer,
  form: FormReducer,
  measures: MeasuresReducer,
  modal: ModalReducer,
  status: StatusReducer,
  form2: combineForms({
    rigaBolla: RigaBollaReducer, itemCatalog: ItemCatalogReducer
  }, 'form2')
});

export default rootReducer;