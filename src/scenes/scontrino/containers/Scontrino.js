import ScontrinoComponent from '../components/Scontrino'
import {rigaScontrinoFA} from '../../../actions/scontrino'
import {cassaFA, setRedirect} from '../../../actions/cassa'

import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getShowCatalogModalScontrino, getEditedCatalogItem, getListenersItemScontrino, getTestataScontrino, getListeningTestataScontrino, 
		isStaleTotaliScontrino, isStaleTotaliCassa, getEditedRigaScontrino, getEditedRigaCassa, getListeningTestataCassa, getTestataCassa, shouldRedirectCassa, getMessageBufferScontrino} from '../../../reducers'
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
	         shouldRedirectCassa: shouldRedirectCassa(state),
			 messageBuffer: getMessageBufferScontrino(state),
			 listenersItemScontrino: getListenersItemScontrino(state)
	  
		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ shiftMessage, resetScontrino, resetTableScontrino, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataScontrino, unlistenTestataScontrino, storeMeasure, setHeaderInfo, submitRigaCassa, listenTestataCassa, unlistenTestataCassa, resetCassa, setSelectedRigaCassa, setRedirect}, dispatch);
}

const Scontrino = connect(mapStateToProps, mapDispatchToProps)(ScontrinoComponent)


export default Scontrino