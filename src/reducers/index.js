import { combineReducers } from 'redux';
import AuthReducer from './auth';
import MeasuresReducer from './measures';
import { combineForms } from 'react-redux-form';
import CatalogReducer, * as fromCatalog from './catalog';
import OldCatalogReducer from './oldCatalog';

import ItemCatalogReducer from './itemCatalog';
import BolleReducer, * as fromBolle from './bolle';
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
  oldCatalog: OldCatalogReducer,
  form: FormReducer,
  measures: MeasuresReducer,
  status: StatusReducer,
  form2: combineForms({
    rigaBolla: RigaBollaReducer, itemCatalog: ItemCatalogReducer, rigaScontrino: RigaScontrinoReducer
  }, 'form2')
});

export default rootReducer;


export const getTotaliBolla = (state) => {return fromBolle.getTotaliBolla(state.bolle)};
export const getRigheBolla = (state) => {return fromBolle.getRigheBolla(state.bolle)};
export const getEditedRigaBolla = (state) => {return fromBolle.getEditedRigaBolla(state.bolle)};
export const getShowCatalogModal = (state) => {return fromBolle.getShowCatalogModal(state.bolle)};
export const getEditedCatalogItem = (state) => {return fromCatalog.getEditedCatalogItem(state.catalog)};