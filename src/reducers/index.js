import { combineReducers } from 'redux';
import AppReducer, * as fromApp from './app';
import AuthReducer, * as fromAuth from './auth';
import CatalogoReducer, * as fromCatalog from './catalogo';
import BollaReducer, * as fromBolla from './bolla';
import CassaReducer, * as fromCassa from './cassa';
import ElencoBolleReducer, * as fromElencoBolle from './elencoBolle';
import ElencoCasseReducer, * as fromElencoCasse from './elencoCasse';
import ElencoInventariReducer, * as fromElencoInventari from './elencoInventari';
import InventarioReducer, * as fromInventario from './inventario';
import DettagliArticoloReducer, * as fromDettagliArticolo from './dettagliArticolo';
import MagazzinoReducer, * as fromMagazzino from './magazzino';
import MeasuresReducer, * as fromMeasures from './measures';
import ScontrinoReducer, * as fromScontrino from './scontrino';
import UserMgmtReducer, * as fromUserMgmt from './userMgmt';
import StatusReducer, * as fromStatus from './status';
import ReadmeViewerReducer, * as fromReadmeViewer from './readmeViewer';

const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  bolla: BollaReducer,
  cassa: CassaReducer,
  dettagliArticolo: DettagliArticoloReducer,
  elencoBolle: ElencoBolleReducer,
  elencoCasse: ElencoCasseReducer,
  elencoInventari: ElencoInventariReducer,
  inventario: InventarioReducer,
  magazzino: MagazzinoReducer,
  measures: MeasuresReducer,
  readmeViewer: ReadmeViewerReducer,
  scontrino: ScontrinoReducer,
  userMgmt: UserMgmtReducer,
  catalogo: CatalogoReducer,
  status: StatusReducer
});

export default rootReducer;
//Dalla App
export const getCollapsed = (state) => {return fromApp.getCollapsed(state.app)};
export const getHeaderInfo = (state) => {return fromApp.getHeaderInfo(state.app)};
export const getMenuSelectedKeys = (state) => {return fromApp.getMenuSelectedKeys(state.app)};

//Scene Bolla
export const getRigheBolla = (state) => {return fromBolla.getItems(state.bolla)};
export const getEditedRigaBolla = (state) => {return fromBolla.getEditedItem(state.bolla)};
export const getTestataBolla = (state) => {return fromBolla.getTestataBolla(state.bolla)};
export const getShowCatalogModal = (state) => {return fromBolla.getShowCatalogModal(state.bolla)};
export const getTableHeight = (state) => {return fromBolla.getTableHeight(state.bolla)};
export const getTableScroll = (state)  => {return fromBolla.getTableScroll(state.bolla)};
export const getListeningTestataBolla = (state) => {return fromBolla.getListeningTestataBolla(state.bolla)};
export const getListeningItemBolla = (state) => {return fromBolla.getListeningItemBolla(state.bolla)};
export const isStaleTotali = (state) => {return fromBolla.isStaleTotali(state.bolla)};
export const getMessageBufferBolla = (state) => {return fromBolla.getMessageBuffer(state.bolla)};

//Scena DettagliArticolo
export const getListeningEAN = (state) => {return fromDettagliArticolo.getListeningEAN(state.dettagliArticolo)};
export const getDettagliEAN = (state) => {return fromDettagliArticolo.getDettagliEAN(state.dettagliArticolo)};
export const getHeaderEAN = (state) => {return fromDettagliArticolo.getHeaderEAN(state.dettagliArticolo)};

//Scene ElencoBolle
export const getElencoBolle = (state) => {return fromElencoBolle.getItems(state.elencoBolle)};
export const getEditedBolla = (state) => {return fromElencoBolle.getEditedItem(state.elencoBolle)};
export const getTableElencoBolleHeight = (state) => {return fromElencoBolle.getTableHeight(state.elencoBolle)};
export const getTableElencoBolleScroll = (state)  => {return fromElencoBolle.getTableScroll(state.elencoBolle)};
export const getReadOnlyFormBolla = (state)  => {return fromElencoBolle.getReadOnlyForm(state.elencoBolle)};
export const getPeriod = (state) => {return fromElencoBolle.getPeriod(state.elencoBolle)};
export const getListeningItem = (state) => {return fromElencoBolle.getListeningItem(state.elencoBolle)};

//Scene Inventario
export const getRigheInventario = (state) => {return fromInventario.getItems(state.inventario)};
export const getEditedRigaInventario = (state) => {return fromInventario.getEditedItem(state.inventario)};
export const getTestataInventario = (state) => {return fromInventario.getTestataBolla(state.inventario)};
export const getShowCatalogModalInventario = (state) => {return fromInventario.getShowCatalogModal(state.inventario)};
export const getTableHeightInventario = (state) => {return fromInventario.getTableHeight(state.inventario)};
export const getTableScrollInventario = (state)  => {return fromInventario.getTableScroll(state.inventario)};
export const getListeningTestataInventario = (state) => {return fromInventario.getListeningTestataBolla(state.inventario)};
export const getListeningItemInventario = (state) => {return fromInventario.getListeningItemBolla(state.inventario)};
export const isStaleTotaliInventario = (state) => {return fromInventario.isStaleTotali(state.inventario)};
export const getMessageBufferInventario = (state) => {return fromInventario.getMessageBuffer(state.inventario)};


//Scene ElencoInventari
export const getElencoInventari = (state) => {return fromElencoInventari.getItems(state.elencoInventari)};
export const getEditedInventario = (state) => {return fromElencoInventari.getEditedItem(state.elencoInventari)};
export const getTableElencoInventariHeight = (state) => {return fromElencoInventari.getTableHeight(state.elencoInventari)};
export const getTableElencoInventariScroll = (state)  => {return fromElencoInventari.getTableScroll(state.elencoInventari)};
export const getReadOnlyFormInventario = (state)  => {return fromElencoInventari.getReadOnlyForm(state.elencoInventari)};
export const getListeningItemElencoInventari = (state) => {return fromElencoInventari.getListeningItem(state.elencoInventari)};

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
export const getListeningTestataCassa = (state) => {return fromCassa.getListeningTestataCassa(state.cassa)};
export const getListeningItemCassa = (state) => {return fromCassa.getListeningItemCassa(state.cassa)};
export const isStaleTotaliCassa = (state) => {return fromCassa.isStaleTotali(state.cassa)};
export const shouldRedirectCassa = (state) => {return fromCassa.shouldRedirect(state.cassa)};
export const getFiltersCassa = (state) => { return fromCassa.getFilters(state.cassa)};


//Scene Scontrino
export const getRigheScontrino = (state) => {return fromScontrino.getItems(state.scontrino)};
export const getEditedRigaScontrino = (state) => {return fromScontrino.getEditedItem(state.scontrino)};
export const getTestataScontrino = (state) => {return fromScontrino.getTestataScontrino(state.scontrino)};
export const getShowCatalogModalScontrino = (state) => {return fromScontrino.getShowCatalogModal(state.scontrino)};
export const getTableHeightScontrino = (state) => {return fromScontrino.getTableHeight(state.scontrino)};
export const getTableScrollScontrino = (state)  => {return fromScontrino.getTableScroll(state.scontrino)};
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
export const getFiltersMagazzino = (state) => {return fromMagazzino.getFilters(state.magazzino)};


//Scene UserMgmt
export const getEditedItemUserMgmt = (state) => {return fromUserMgmt.getEditedItem(state.userMgmt)};


//Dallo stato
export const getLibreria = (state) => {return fromStatus.getLibreria(state.status)};
export const getCatena = (state) => {return fromStatus.getCatena(state.status)};
export const getInfo = (state) => {return fromStatus.getInfo(state.status)};

//da auth
export const isAuthenticated = (state) => {return fromAuth.isAuthenticated(state.auth)};
export const getUser = (state) => {return fromAuth.getUser(state.auth)};

//da measures
export const getMeasures = (state) => {return fromMeasures.getMeasures(state.measures)};


//da readmeViewer
export const getReadme = (state) => {return fromReadmeViewer.getReadme(state.readmeViewer)};
export const getReadmeHeight = (state) => {return fromReadmeViewer.getReadmeHeight(state.readmeViewer)};
export const getShowModal = (state) => {return fromReadmeViewer.getShowModal(state.readmeViewer)};


 