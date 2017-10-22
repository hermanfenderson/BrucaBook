import { combineReducers } from 'redux';
import AuthReducer from './auth';
import MeasuresReducer from './measures';
import { combineForms } from 'react-redux-form';
import CatalogoReducer, * as fromCatalog from './catalogo';
import BollaReducer, * as fromBolle from './bolla';
import ScontriniReducer from './scontrini';
import CasseReducer from './casse';
import StatusReducer from './status';
import RigaScontrinoReducer from './rigaScontrino';
import { reducer as FormReducer } from 'redux-form';

const rootReducer = combineReducers({
  auth: AuthReducer,
  bolla: BollaReducer,
  scontrini: ScontriniReducer,
  casse: CasseReducer,
  catalogo: CatalogoReducer,
  form: FormReducer,
  measures: MeasuresReducer,
  status: StatusReducer,
  form2: combineForms({
    rigaScontrino: RigaScontrinoReducer
  }, 'form2')
});

export default rootReducer;


export const getTotaliBolla = (state) => {return fromBolle.getTotaliBolla(state.bolla)};
export const getRigheBolla = (state) => {return fromBolle.getRigheBolla(state.bolla)};
export const getEditedRigaBolla = (state) => {return fromBolle.getEditedRigaBolla(state.bolla)};
export const getShowCatalogModal = (state) => {return fromBolle.getShowCatalogModal(state.bolla)};
export const getEditedCatalogItem = (state) => {return fromCatalog.getEditedCatalogItem(state.catalogo)};