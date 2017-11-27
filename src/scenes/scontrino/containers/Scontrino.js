import ScontrinoComponent from '../components/Scontrino'
import {rigaScontrinoFA} from '../../../actions/scontrino'
import {cassaFA} from '../../../actions/cassa'

import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getShowCatalogModalScontrino, getEditedCatalogItem, getTestataScontrino, getListeningTestataScontrino, 
		isStaleTotaliScontrino, isStaleTotaliCassa, getEditedRigaCassa, getListeningTestataCassa, getTestataCassa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataScontrino = rigaScontrinoFA.listenTestata;
const unlistenTestataScontrino = rigaScontrinoFA.unlistenTestata;
const resetScontrino = rigaScontrinoFA.reset;
const submitRigaCassa = cassaFA.submitEditedItem;
const listenTestataCassa = cassaFA.listenTestata;
const unlistenTestataCassa = cassaFA.unlistenTestata;
const resetCassa = cassaFA.reset;

const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModalScontrino(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataScontrino: getTestataScontrino(state),
	         listeningTestataScontrino: getListeningTestataScontrino(state),
	         staleTotali: isStaleTotaliScontrino(state),
	         testataCassa: getTestataCassa(state),
	         staleTotaliCassa: isStaleTotaliCassa(state),
	         selectedScontrino: getEditedRigaCassa(state).selectedItem,
	         listeningTestataCassa: getListeningTestataCassa(state),

	  
		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetScontrino, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataScontrino, unlistenTestataScontrino, storeMeasure, setHeaderInfo, submitRigaCassa, listenTestataCassa, unlistenTestataCassa, resetCassa}, dispatch);
}

const Scontrino = connect(mapStateToProps, mapDispatchToProps)(ScontrinoComponent)


export default Scontrino