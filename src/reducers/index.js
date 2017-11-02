import { combineReducers } from 'redux';
import MeasuresReducer from './measures';
import CatalogoReducer, * as fromCatalog from './catalogo';
import BollaReducer, * as fromBolla from './bolla';
import ElencoBolleReducer, * as fromElencoBolle from './elencoBolle';
import LoginReducer, * as fromLogin from './login';
import SignupReducer, * as fromSignup from './signup';
import StatusReducer, * as fromStatus from './status';

const rootReducer = combineReducers({
  bolla: BollaReducer,
  elencoBolle: ElencoBolleReducer,
  login: LoginReducer,
  signup: SignupReducer,
  catalogo: CatalogoReducer,
  measures: MeasuresReducer,
  status: StatusReducer
});

export default rootReducer;

//Scene Bolla
export const getTotaliBolla = (state) => {return fromBolla.getTotali(state.bolla)};
export const getRigheBolla = (state) => {return fromBolla.getItems(state.bolla)};
export const getEditedRigaBolla = (state) => {return fromBolla.getEditedItem(state.bolla)};
export const getShowCatalogModal = (state) => {return fromBolla.getShowCatalogModal(state.bolla)};
export const getTableHeight = (state) => {return fromBolla.getTableHeight(state.bolla)};
export const getTableScroll = (state)  => {return fromBolla.getTableScroll(state.bolla)};
export const getMeasures = (state) => {return fromBolla.getMeasures(state.bolla)};


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

//Scene Signup
export const getEditedItemSignup = (state) => {return fromSignup.getEditedItem(state.signup)};


//Dallo stato
export const getLibreria = (state) => {return fromStatus.getLibreria(state.status)};
export const getCatena = (state) => {return fromStatus.getCatena(state.status)};
export const isAuthenticated = (state) => {return fromStatus.isAuthenticated(state.status)};
export const getUser = (state) => {return fromStatus.getUser(state.status)};



 