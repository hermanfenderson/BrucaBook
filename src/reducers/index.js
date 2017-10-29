import { combineReducers } from 'redux';
import AuthReducer from './auth';
import MeasuresReducer from './measures';
import { combineForms } from 'react-redux-form';
import CatalogoReducer, * as fromCatalog from './catalogo';
import BollaReducer, * as fromBolla from './bolla';
import ElencoBolleReducer, * as fromElencoBolle from './elencoBolle';
import LoginReducer, * as fromLogin from './login';
import ScontriniReducer from './scontrini';
import CasseReducer from './casse';
import StatusReducer, * as fromStatus from './status';
import RigaScontrinoReducer from './rigaScontrino';
import { reducer as FormReducer } from 'redux-form';

const rootReducer = combineReducers({
  auth: AuthReducer,
  bolla: BollaReducer,
  elencoBolle: ElencoBolleReducer,
  login: LoginReducer,
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

//Scene Bolla
export const getTotaliBolla = (state) => {return fromBolla.getTotali(state.bolla)};
export const getRigheBolla = (state) => {return fromBolla.getItems(state.bolla)};
export const getEditedRigaBolla = (state) => {return fromBolla.getEditedItem(state.bolla)};
export const getShowCatalogModal = (state) => {return fromBolla.getShowCatalogModal(state.bolla)};
export const getTableHeight = (state) => {return fromBolla.getTableHeight(state.bolla)};
export const getTableScroll = (state)  => {return fromBolla.getTableScroll(state.bolla)};


//Scene ElencoBolle
export const getElencoBolle = (state) => {return fromElencoBolle.getItems(state.elencoBolle)};
export const getEditedBolla = (state) => {return fromElencoBolle.getEditedItem(state.elencoBolle)};
export const getTableElencoBolleHeight = (state) => {return fromElencoBolle.getTableHeight(state.elencoBolle)};
export const getTableElencoBolleScroll = (state)  => {return fromElencoBolle.getTableScroll(state.elencoBolle)};
export const getReadOnlyFormBolla = (state)  => {return fromElencoBolle.getReadOnlyForm(state.elencoBolle)};
export const getGotoBolla = (state) => {return fromElencoBolle.getGotoBolla(state.elencoBolle)};


//Scene Catalogo
export const getEditedCatalogItem = (state) => {return fromCatalog.getEditedCatalogItem(state.catalogo)};

//Scene Login
export const getEditedItemLogin = (state) => {return fromLogin.getEditedItem(state.login)};


//Dallo stato
export const getLibreria = (state) => {return fromStatus.getLibreria(state.status)};
export const getCatena = (state) => {return fromStatus.getCatena(state.status)};
export const isAuthenticated = (state) => {return fromStatus.isAuthenticated(state.status)};


 