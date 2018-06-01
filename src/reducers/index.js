import { combineReducers } from 'redux';
import AppReducer, * as fromApp from './app';
import AuthReducer, * as fromAuth from './auth';
import CatalogoReducer, * as fromCatalog from './catalogo';
import BollaReducer, * as fromBolla from './bolla';
import CassaReducer, * as fromCassa from './cassa';
import ResaReducer, * as fromResa from './resa';
import ResaLiberaReducer, * as fromResaLibera from './resaLibera';

import DashboardReducer, * as fromDashboard from './dashboard';


import ElencoBolleReducer, * as fromElencoBolle from './elencoBolle';
import ElencoCasseReducer, * as fromElencoCasse from './elencoCasse';
import ElencoReseReducer, * as fromElencoRese from './elencoRese';

import ElencoInventariReducer, * as fromElencoInventari from './elencoInventari';
import FornitoriReducer, * as fromFornitori from './fornitori';
import InventarioReducer, * as fromInventario from './inventario';
import DettagliArticoloReducer, * as fromDettagliArticolo from './dettagliArticolo';
import MagazzinoReducer, * as fromMagazzino from './magazzino';
import MeasuresReducer, * as fromMeasures from './measures';
import ScontrinoReducer, * as fromScontrino from './scontrino';
import UserMgmtReducer, * as fromUserMgmt from './userMgmt';
import StatusReducer, * as fromStatus from './status';
import ReadmeViewerReducer, * as fromReadmeViewer from './readmeViewer';

import * as fromFormReducer from '../helpers/formReducer';

const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  bolla: BollaReducer,
  cassa: CassaReducer,
  resa: ResaReducer,
  resaLibera: ResaLiberaReducer,
  dashboard: DashboardReducer,
  dettagliArticolo: DettagliArticoloReducer,
  elencoBolle: ElencoBolleReducer,
  elencoCasse: ElencoCasseReducer,
  elencoInventari: ElencoInventariReducer,
  elencoRese: ElencoReseReducer,
  fornitori: FornitoriReducer,
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
export const getTotaliBolla = (state) => {return fromBolla.getTotali(state.bolla)};
export const getFiltersBolla = (state) => {return fromBolla.getFiltersBolla(state.bolla)};

//export const getTableScrollByKeyBolla = (state)  => {return fromBolla.getTableScrollByKey(state.bolla)};

//Scena Dashboard
export const isWaitingForData = (state) => {return fromDashboard.isWaitingForData(state.dashboard)};

export const getSerieIncassi = (state) => {return fromDashboard.getSerieIncassi(state.dashboard)};
export const getSerieIncassiMesi = (state) => {return fromDashboard.getSerieIncassiMesi(state.dashboard)};
export const getSerieIncassiAnni = (state) => {return fromDashboard.getSerieIncassiAnni(state.dashboard)};
export const getTop5thisYear = (state) => {return fromDashboard.getTop5thisYear(state.dashboard)};
export const getTop5lastYear = (state) => {return fromDashboard.getTop5lastYear(state.dashboard)};
export const getTop5lastMonth = (state) => {return fromDashboard.getTop5lastMonth(state.dashboard)};


//Scena DettagliArticolo
export const getListeningEAN = (state) => {return fromDettagliArticolo.getListeningEAN(state.dettagliArticolo)};
export const getDettagliEAN = (state) => {return fromDettagliArticolo.getDettagliEAN(state.dettagliArticolo)};
export const getHeaderEAN = (state) => {return fromDettagliArticolo.getHeaderEAN(state.dettagliArticolo)};
export const getPeriodDetails = (state) => {return fromDettagliArticolo.getPeriod(state.dettagliArticolo)};

//Scene ElencoBolle
export const getElencoBolle = (state) => {return fromElencoBolle.getItems(state.elencoBolle)};
export const getEditedBolla = (state) => {return fromElencoBolle.getEditedItem(state.elencoBolle)};
export const getTableElencoBolleHeight = (state) => {return fromElencoBolle.getTableHeight(state.elencoBolle)};
export const getTableElencoBolleScroll = (state)  => {return fromElencoBolle.getTableScroll(state.elencoBolle)};
export const getReadOnlyFormBolla = (state)  => {return fromElencoBolle.getReadOnlyForm(state.elencoBolle)};
export const getPeriod = (state) => {return fromElencoBolle.getPeriod(state.elencoBolle)};
export const getListeningItem = (state) => {return fromElencoBolle.getListeningItem(state.elencoBolle)};

//Scene ElencoRese
export const getElencoRese = (state) => {return fromElencoRese.getItems(state.elencoRese)};
export const getEditedResa = (state) => {return fromElencoRese.getEditedItem(state.elencoRese)};
export const getTableElencoReseHeight = (state) => {return fromElencoRese.getTableHeight(state.elencoRese)};
export const getTableElencoReseScroll = (state)  => {return fromElencoRese.getTableScroll(state.elencoRese)};
export const getReadOnlyFormResa = (state)  => {return fromElencoRese.getReadOnlyForm(state.elencoRese)};
export const getPeriodElencoRese = (state) => {return fromElencoRese.getPeriod(state.elencoRese)};
export const getListeningItemElencoRese = (state) => {return fromElencoRese.getListeningItem(state.elencoRese)};

//Scene Resa
export const getRigheResa = (state) => {return fromResa.getItems(state.resa)};
export const getRigheResaIndexed = (state) => {return fromResa.getRigheResaIndexed(state.resa)};

export const getEditedRigaResa = (state) => {return fromResa.getEditedItem(state.resa)};
export const getTestataResa = (state) => {return fromResa.getTestataResa(state.resa)};
export const getTableResaHeight = (state) => {return fromResa.getTableHeight(state.resa)};
export const getTableResaScroll = (state)  => {return fromResa.getTableScroll(state.resa)};
export const getListeningTestataResa = (state) => {return fromResa.getListeningTestataResa(state.resa)};
export const getListeningItemResa = (state) => {return fromResa.getListeningItemResa(state.resa)};
export const isStaleTotaliResa = (state) => {return fromResa.isStaleTotali(state.resa)};
export const getMessageBufferResa = (state) => {return fromResa.getMessageBuffer(state.resa)};
export const getBolleOsservate = (state) => {return fromResa.getBolleOsservate(state.resa)};
export const getIndiceEAN = (state) => {return fromResa.getIndiceEAN(state.resa)};
export const getTabellaEAN = (state) => {return fromResa.getTabellaEAN(state.resa)};
export const getDettagliEANResa = (state) => {return fromResa.getDettagliEAN(state.resa)};
export const getTabelleRigheEAN = (state) => {return fromResa.getTabelleRigheEAN(state.resa)};
export const getTabellaRighe = (state) => {return fromResa.getTabellaRighe(state.resa)};
export const getActiveModal = (state) => {return fromResa.getActiveModal(state.resa)};
export const getPeriodResa = (state) => {return fromResa.getPeriod(state.resa)};
export const getMatrixEAN = (state) => {return fromResa.getMatrixEAN(state.resa)};
export const getHeaderEANResa = (state) => {return fromResa.getHeaderEAN(state.resa)};

//Scene ResaLibera
export const getRigheResaLibera = (state) => {return fromResaLibera.getItems(state.resaLibera)};
export const getEditedRigaResaLibera = (state) => {return fromResaLibera.getEditedItem(state.resaLibera)};
export const getTestataResaLibera = (state) => {return fromResaLibera.getTestataResa(state.resaLibera)};
export const getShowCatalogModalResaLibera = (state) => {return fromResaLibera.getShowCatalogModal(state.resaLibera)};
export const getTableHeightResaLibera = (state) => {return fromResaLibera.getTableHeight(state.resaLibera)};
export const getTableScrollResaLibera = (state)  => {return fromResaLibera.getTableScroll(state.resaLibera)};
export const getListeningTestataResaLibera = (state) => {return fromResaLibera.getListeningTestataResa(state.resaLibera)};
export const getListeningItemResaLibera = (state) => {return fromResaLibera.getListeningItemResa(state.resaLibera)};
export const isStaleTotaliResaLibera = (state) => {return fromResaLibera.isStaleTotali(state.resaLibera)};
export const getMessageBufferResaLibera = (state) => {return fromResaLibera.getMessageBuffer(state.resaLibera)};


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

//Scene Fornitori
export const getFornitori = (state) => {return fromFornitori.getItems(state.fornitori)};
export const getEditedFornitore = (state) => {return fromFornitori.getEditedItem(state.fornitori)};
export const getTableFornitoriHeight = (state) => {return fromFornitori.getTableHeight(state.fornitori)};
export const getTableFornitoriScroll = (state)  => {return fromFornitori.getTableScroll(state.fornitori)};
export const getListeningItemFornitori = (state) => {return fromFornitori.getListeningItem(state.fornitori)};

//Scene Cassa
export const getRigheCassa = (state) => {return fromCassa.getItems(state.cassa)};
export const getRigheCassaIndex = (state) => {return fromCassa.getItemsIndex(state.cassa)};
export const getEditedRigaCassa = (state) => {return fromCassa.getEditedItem(state.cassa)};
export const getTestataCassa = (state) => {return fromCassa.getTestataCassa(state.cassa)};
export const getTableHeightCassa = (state) => {return fromCassa.getTableHeight(state.cassa)};
export const getTableScrollCassa = (state)  => {return fromCassa.getTableScroll(state.cassa)};

//export const getTableScrollByKeyCassa = (state)  => {return fromCassa.getTableScrollByKey(state.cassa)};

export const getListeningTestataCassa = (state) => {return fromCassa.getListeningTestataCassa(state.cassa)};
export const getListeningItemCassa = (state) => {return fromCassa.getListeningItemCassa(state.cassa)};
export const getListenersItemCassa = (state) => {return fromCassa.getListenersItemCassa(state.cassa)};

export const isStaleTotaliCassa = (state) => {return fromCassa.isStaleTotali(state.cassa)};
export const getFiltersCassa = (state) => { return fromCassa.getFilters(state.cassa)};
export const getTotaliCassa = (state) => { return fromCassa.getTotaliCassa(state.cassa)};


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
export const getTotaliScontrino = (state) => {return fromScontrino.getTotali(state.scontrino)};
export const getEanLookupOpen = (state) => {return fromScontrino.getEanLookupOpen(state.scontrino)};


//Scene Catalogo
export const getEditedCatalogItem = (state) => {return fromCatalog.getEditedCatalogItem(state.catalogo)};
export const getSaveGeneral = (state) => {return fromCatalog.getSaveGeneral(state.catalogo)};


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
export const getAnagrafiche = (state) => {return fromStatus.getAnagrafiche(state.status)};
export const getAnagraficheLocali = (state) => {return fromStatus.getAnagraficheLocali(state.status)};
export const getSelettoreIVA = (state) => {return fromStatus.getSelettoreIVA(state.status)};


//da auth
export const isAuthenticated = (state) => {return fromAuth.isAuthenticated(state.auth)};
export const getUser = (state) => {return fromAuth.getUser(state.auth)};

//da measures
export const getMeasures = (state) => {return fromMeasures.getMeasures(state.measures)};


//da readmeViewer
export const getReadme = (state) => {return fromReadmeViewer.getReadme(state.readmeViewer)};
export const getReadmeHeight = (state) => {return fromReadmeViewer.getReadmeHeight(state.readmeViewer)};
export const getShowModal = (state) => {return fromReadmeViewer.getShowModal(state.readmeViewer)};

//Strato per andare da scena a sorgente e pezzo di stato
export const s2s = (scene) => {
	let s = {};
	switch (scene)	
		{
			case 'INVENTARIO':
				s.stato = 'inventario';
				s.origin = fromInventario;
			break;
			case 'ELENCOBOLLE':
				s.stato = 'elencoBolle';
				s.origin = fromBolla;
			break;
			case 'BOLLA':
				s.stato = 'bolla';
				s.origin = fromBolla;
			break;
			case 'CASSA':
				s.stato = 'cassa';
				s.origin = fromCassa;
			break;	
		    case 'SCONTRINO':
				s.stato = 'scontrino';
				s.origin = fromCassa;
			break;
			case 'RESA':
				s.stato = 'resa';
				s.origin = fromResa;
			break;
			default:
		
			
		}
	return(s);	
}



//Multi-scena (ragiono in modo diverso... passo esplicitamente la scena...con strato piccolino per disaccoppiamento...


//export const listeningDataMagazzino = (state, scene) => {let s=s2s(scene); return s.origin.listeningDataMagazzino(state[s.stato])};
//export const getDataMagazzino = (state, scene) => {let s=s2s(scene);  return s.origin.getDataMagazzino(state[s.stato])};
//Tengo questa per ricordarmi strada alternativa...se ha senso...

//export const getTableScrollByKey = (state, scene) => {let s=s2s(scene);  return s.origin.getTableScrollByKey(state[s.stato])};

//Questo che segue è l'uovo di Colombo...

export const getItems = (state, scene) => {let s=s2s(scene); return fromFormReducer.getItems(state[s.stato])};
export const getTableScrollByKey = (state, scene) => {let s=s2s(scene);  return fromFormReducer.getTableScrollByKey(state[s.stato])};

export const getGeometry = (state, scene) => {let s=s2s(scene); return fromFormReducer.getGeometry(state[s.stato])};
export const listeningDataMagazzino = (state, scene) => {let s=s2s(scene); return fromFormReducer.listeningDataMagazzino(state[s.stato])};
export const getDataMagazzino = (state, scene) => {let s=s2s(scene);  return fromFormReducer.getDataMagazzino(state[s.stato])};

 