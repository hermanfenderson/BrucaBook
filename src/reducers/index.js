import { combineReducers } from 'redux';
import AppReducer, * as fromApp from './app';
import AuthReducer, * as fromAuth from './auth';
import CatalogoReducer, * as fromCatalog from './catalogo';
import BollaReducer, * as fromBolla from './bolla';
import CassaReducer, * as fromCassa from './cassa';
import ElencoBolleReducer, * as fromElencoBolle from './elencoBolle';
import ElencoCasseReducer, * as fromElencoCasse from './elencoCasse';
import MagazzinoReducer, * as fromMagazzino from './magazzino';
import MeasuresReducer from './measures';
import ScontrinoReducer, * as fromScontrino from './scontrino';
import UserMgmtReducer, * as fromUserMgmt from './userMgmt';
import StatusReducer, * as fromStatus from './status';

const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  bolla: BollaReducer,
  cassa: CassaReducer,
  elencoBolle: ElencoBolleReducer,
  elencoCasse: ElencoCasseReducer,
  magazzino: MagazzinoReducer,
  measures: MeasuresReducer,
  scontrino: ScontrinoReducer,
  userMgmt: UserMgmtReducer,
  catalogo: CatalogoReducer,
  status: StatusReducer
});

export default rootReducer;
//Dalla App
export const getCollapsed = (state) => {return fromApp.getCollapsed(state.app)};
export const getHeaderInfo = (state) => {return fromApp.getHeaderInfo(state.app)};

//Scene Bolla
export const getRigheBolla = (state) => {return fromBolla.getItems(state.bolla)};
export const getEditedRigaBolla = (state) => {return fromBolla.getEditedItem(state.bolla)};
export const getTestataBolla = (state) => {return fromBolla.getTestataBolla(state.bolla)};
export const getShowCatalogModal = (state) => {return fromBolla.getShowCatalogModal(state.bolla)};
export const getTableHeight = (state) => {return fromBolla.getTableHeight(state.bolla)};
export const getTableScroll = (state)  => {return fromBolla.getTableScroll(state.bolla)};
export const getMeasures = (state) => {return fromBolla.getMeasures(state.bolla)};
export const getListeningTestataBolla = (state) => {return fromBolla.getListeningTestataBolla(state.bolla)};
export const getListeningItemBolla = (state) => {return fromBolla.getListeningItemBolla(state.bolla)};
export const isStaleTotali = (state) => {return fromBolla.isStaleTotali(state.bolla)};
export const getMessageBufferBolla = (state) => {return fromBolla.getMessageBuffer(state.bolla)};


//Scene ElencoBolle
export const getElencoBolle = (state) => {return fromElencoBolle.getItems(state.elencoBolle)};
export const getEditedBolla = (state) => {return fromElencoBolle.getEditedItem(state.elencoBolle)};
export const getTableElencoBolleHeight = (state) => {return fromElencoBolle.getTableHeight(state.elencoBolle)};
export const getTableElencoBolleScroll = (state)  => {return fromElencoBolle.getTableScroll(state.elencoBolle)};
export const getReadOnlyFormBolla = (state)  => {return fromElencoBolle.getReadOnlyForm(state.elencoBolle)};
export const getPeriod = (state) => {return fromElencoBolle.getPeriod(state.elencoBolle)};
export const getListeningItem = (state) => {return fromElencoBolle.getListeningItem(state.elencoBolle)};

//Scene ElencoCasse
export const getElencoCasse = (state) => {return fromElencoCasse.getItems(state.elencoCasse)};
export const getEditedCassa = (state) => {return fromElencoCasse.getEditedItem(state.elencoCasse)};
export const getTableElencoCasseHeight = (state) => {return fromElencoCasse.getTableHeight(state.elencoCasse)};
export const getTableElencoCasseScroll = (state)  => {return fromElencoCasse.getTableScroll(state.elencoCasse)};
export const getReadOnlyFormCassa = (state)  => {return fromElencoCasse.getReadOnlyForm(state.elencoCasse)};
export const getPeriodElencoCasse = (state) => {return fromElencoCasse.getPeriod(state.elencoCasse)};
export const getListeningItemElencoCasse = (state) => {return fromElencoCasse.getListeningItem(state.elencoCasse)};

//Scene Cassa
export const getRigheCassa = (state) => {return fromCassa.getItems(state.cassa)};
export const getRigheCassaIndex = (state) => {return fromCassa.getItemsIndex(state.cassa)};
export const getEditedRigaCassa = (state) => {return fromCassa.getEditedItem(state.cassa)};
export const getTestataCassa = (state) => {return fromCassa.getTestataCassa(state.cassa)};
export const getTableHeightCassa = (state) => {return fromCassa.getTableHeight(state.cassa)};
export const getTableScrollCassa = (state)  => {return fromCassa.getTableScroll(state.cassa)};
export const getMeasuresCassa = (state) => {return fromCassa.getMeasures(state.cassa)};
export const getListeningTestataCassa = (state) => {return fromCassa.getListeningTestataCassa(state.cassa)};
export const getListeningItemCassa = (state) => {return fromCassa.getListeningItemCassa(state.cassa)};
export const isStaleTotaliCassa = (state) => {return fromCassa.isStaleTotali(state.cassa)};
export const shouldRedirectCassa = (state) => {return fromCassa.shouldRedirect(state.cassa)};


//Scene Scontrino
export const getRigheScontrino = (state) => {return fromScontrino.getItems(state.scontrino)};
export const getEditedRigaScontrino = (state) => {return fromScontrino.getEditedItem(state.scontrino)};
export const getTestataScontrino = (state) => {return fromScontrino.getTestataScontrino(state.scontrino)};
export const getShowCatalogModalScontrino = (state) => {return fromScontrino.getShowCatalogModal(state.scontrino)};
export const getTableHeightScontrino = (state) => {return fromScontrino.getTableHeight(state.scontrino)};
export const getTableScrollScontrino = (state)  => {return fromScontrino.getTableScroll(state.scontrino)};
export const getMeasuresScontrino = (state) => {return fromScontrino.getMeasures(state.scontrino)};
export const getListeningTestataScontrino = (state) => {return fromScontrino.getListeningTestataScontrino(state.scontrino)};
export const getListeningItemScontrino = (state) => {return fromScontrino.getListeningItemScontrino(state.scontrino)};
export const getListenersItemScontrino = (state) => {return fromScontrino.getListenersItemScontrino(state.scontrino)};

export const isStaleTotaliScontrino = (state) => {return fromScontrino.isStaleTotali(state.scontrino)};
export const getMessageBufferScontrino = (state) => {return fromBolla.getMessageBuffer(state.scontrino)};


//Scene Catalogo
export const getEditedCatalogItem = (state) => {return fromCatalog.getEditedCatalogItem(state.catalogo)};


//Scene Magazzino
export const getMagazzino = (state) => {return fromMagazzino.getItems(state.magazzino)};
export const getTableMagazzinoHeight = (state) => {return fromMagazzino.getTableHeight(state.magazzino)};
export const getListeningMagazzino = (state) => {return fromMagazzino.getListeningItem(state.magazzino)};


//Scene UserMgmt
export const getEditedItemUserMgmt = (state) => {return fromUserMgmt.getEditedItem(state.userMgmt)};


//Dallo stato
export const getLibreria = (state) => {return fromStatus.getLibreria(state.status)};
export const getCatena = (state) => {return fromStatus.getCatena(state.status)};

//da auth
export const isAuthenticated = (state) => {return fromAuth.isAuthenticated(state.auth)};
export const getUser = (state) => {return fromAuth.getUser(state.auth)};



 