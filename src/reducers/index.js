import { combineReducers } from 'redux';
import AppReducer, * as fromApp from './app';
import AuthReducer, * as fromAuth from './auth';
import CatalogoReducer, * as fromCatalog from './catalogo';
import BollaReducer, * as fromBolla from './bolla';
import ElencoBolleReducer, * as fromElencoBolle from './elencoBolle';
import LoginReducer, * as fromLogin from './login';
import MagazzinoReducer, * as fromMagazzino from './magazzino';
import MeasuresReducer from './measures';
import SignupReducer, * as fromSignup from './signup';
import StatusReducer, * as fromStatus from './status';

const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  bolla: BollaReducer,
  elencoBolle: ElencoBolleReducer,
  login: LoginReducer,
  magazzino: MagazzinoReducer,
  measures: MeasuresReducer,
  signup: SignupReducer,
  catalogo: CatalogoReducer,
  status: StatusReducer
});

export default rootReducer;
//Dalla App
export const getCollapsed = (state) => {return fromApp.getCollapsed(state.app)};
export const getHeaderInfo = (state) => {return fromApp.getHeaderInfo(state.app)};

//Scene Bolla
export const getTotaliBolla = (state) => {return fromBolla.getTotali(state.bolla)};
export const getRigheBolla = (state) => {return fromBolla.getItems(state.bolla)};
export const getEditedRigaBolla = (state) => {return fromBolla.getEditedItem(state.bolla)};
export const getTestataBolla = (state) => {return fromBolla.getTestataBolla(state.bolla)};
export const getShowCatalogModal = (state) => {return fromBolla.getShowCatalogModal(state.bolla)};
export const getTableHeight = (state) => {return fromBolla.getTableHeight(state.bolla)};
export const getTableScroll = (state)  => {return fromBolla.getTableScroll(state.bolla)};
export const getMeasures = (state) => {return fromBolla.getMeasures(state.bolla)};
export const getListeningTotaliBolla = (state) => {return fromBolla.getListeningTotaliBolla(state.bolla)};
export const getListeningTestataBolla = (state) => {return fromBolla.getListeningTestataBolla(state.bolla)};
export const getListeningItemBolla = (state) => {return fromBolla.getListeningItemBolla(state.bolla)};
export const isStaleTotali = (state) => {return fromBolla.isStaleTotali(state.bolla)};


//Scene ElencoBolle
export const getElencoBolle = (state) => {return fromElencoBolle.getItems(state.elencoBolle)};
export const getEditedBolla = (state) => {return fromElencoBolle.getEditedItem(state.elencoBolle)};
export const getTableElencoBolleHeight = (state) => {return fromElencoBolle.getTableHeight(state.elencoBolle)};
export const getTableElencoBolleScroll = (state)  => {return fromElencoBolle.getTableScroll(state.elencoBolle)};
export const getReadOnlyFormBolla = (state)  => {return fromElencoBolle.getReadOnlyForm(state.elencoBolle)};
export const getPeriod = (state) => {return fromElencoBolle.getPeriod(state.elencoBolle)};
export const getListeningItem = (state) => {return fromElencoBolle.getListeningItem(state.elencoBolle)};



//Scene Catalogo
export const getEditedCatalogItem = (state) => {return fromCatalog.getEditedCatalogItem(state.catalogo)};

//Scene Login
export const getEditedItemLogin = (state) => {return fromLogin.getEditedItem(state.login)};

//Scene Magazzino
export const getMagazzino = (state) => {return fromMagazzino.getItems(state.magazzino)};
export const getTableMagazzinoHeight = (state) => {return fromMagazzino.getTableHeight(state.magazzino)};


//Scene Signup
export const getEditedItemSignup = (state) => {return fromSignup.getEditedItem(state.signup)};


//Dallo stato
export const getLibreria = (state) => {return fromStatus.getLibreria(state.status)};
export const getCatena = (state) => {return fromStatus.getCatena(state.status)};

//da auth
export const isAuthenticated = (state) => {return fromAuth.isAuthenticated(state.auth)};
export const getUser = (state) => {return fromAuth.getUser(state.auth)};



 