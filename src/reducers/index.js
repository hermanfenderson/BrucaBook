import { combineReducers } from 'redux';
import AuthReducer from './auth';
import MeasuresReducer from './measures';
import { combineForms } from 'react-redux-form';
import CatalogReducer from './catalog';
import ItemCatalogReducer from './itemCatalog';
import BolleReducer from './bolle';
import ScontriniReducer from './scontrini';
import CasseReducer from './casse';
import StatusReducer from './status';
import RigaBollaReducer from './rigaBolla'; 
import RigaScontrinoReducer from './rigaScontrino';
import { reducer as FormReducer } from 'redux-form';

const rootReducer = combineReducers({
  auth: AuthReducer,
  bolle: BolleReducer,
  scontrini: ScontriniReducer,
  casse: CasseReducer,
  catalog: CatalogReducer,
  form: FormReducer,
  measures: MeasuresReducer,
  status: StatusReducer,
  form2: combineForms({
    rigaBolla: RigaBollaReducer, itemCatalog: ItemCatalogReducer, rigaScontrino: RigaScontrinoReducer
  }, 'form2')
});

export default rootReducer;