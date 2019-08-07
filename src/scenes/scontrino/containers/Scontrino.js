import ScontrinoComponent from '../components/Scontrino'
import {rigaScontrinoFA} from '../../../actions/scontrino'
import {cassaFA} from '../../../actions/cassa'

import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getFiltersCassa, getShowCatalogModalScontrino, getEditedCatalogItem, getListenersItemScontrino, getTestataScontrino, getListeningTestataScontrino, getMeasures,
		isStaleTotaliScontrino, isStaleTotaliCassa, getEditedRigaScontrino, getEditedRigaCassa, getListeningTestataCassa, getTestataCassa,  getMessageBufferScontrino, getTotaliScontrino, getTotaliCassa, getGeometry, getTableHeightScontrino, getEanLookupOpen, getOrdiniModalVisible} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataScontrino = rigaScontrinoFA.listenTestata;
const unlistenTestataScontrino = rigaScontrinoFA.unlistenTestata;
const resetTableScontrino = rigaScontrinoFA.resetTable;
const resetScontrino = rigaScontrinoFA.reset;


const submitRigaCassa = cassaFA.submitEditedItem;
const listenTestataCassa = cassaFA.listenTestata;
const unlistenTestataCassa = cassaFA.unlistenTestata;
const resetCassa = cassaFA.reset;
const setSelectedRigaCassa = cassaFA.setSelectedItem;
const setFilter = cassaFA.setFilter;
const resetFilter = cassaFA.resetFilter;


const shiftMessage = rigaScontrinoFA.shiftMessage;



const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModalScontrino(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataScontrino: getTestataScontrino(state),
	         listeningTestataScontrino: getListeningTestataScontrino(state),
	         staleTotali: isStaleTotaliScontrino(state),
	         testataCassa: getTestataCassa(state),
	         staleTotaliCassa: isStaleTotaliCassa(state),
	         editedRigaScontrino: getEditedRigaScontrino(state),
	        
	         selectedScontrino: getEditedRigaCassa(state).selectedItem,
	         listeningTestataCassa: getListeningTestataCassa(state),
			 messageBuffer: getMessageBufferScontrino(state),
			 listenersItemScontrino: getListenersItemScontrino(state),
			 filters: getFiltersCassa(state), 
			 totaliScontrino: getTotaliScontrino(state),
			 totaliCassa: getTotaliCassa(state),
			 geometryS: getGeometry(state,'SCONTRINO'),
			 geometryC: getGeometry(state,'CASSA'),
			 
			 eanLookupOpen: getEanLookupOpen(state),
			 ordiniModalVisible: getOrdiniModalVisible(state)

		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetFilter, setFilter, shiftMessage, resetScontrino, resetTableScontrino, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataScontrino, unlistenTestataScontrino, storeMeasure, setHeaderInfo, submitRigaCassa, listenTestataCassa, unlistenTestataCassa, resetCassa, setSelectedRigaCassa}, dispatch);
}

const Scontrino = connect(mapStateToProps, mapDispatchToProps)(ScontrinoComponent)


export default Scontrino