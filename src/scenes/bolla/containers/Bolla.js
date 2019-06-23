import BollaComponent from '../components/Bolla'
import {rigaBollaFA} from '../../../actions/bolla'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getMessageBufferBolla, getShowCatalogModal, getEditedCatalogItem, getTestataBolla, getOrdiniModalVisible, getListeningTestataBolla, isStaleTotali, getEditedRigaBolla, getTotaliBolla, getFiltersBolla, getGeometry} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataBolla = rigaBollaFA.listenTestata;
const unlistenTestataBolla = rigaBollaFA.unlistenTestata;
const resetBolla = rigaBollaFA.reset;
const shiftMessage = rigaBollaFA.shiftMessage;
const setFilter = rigaBollaFA.setFilter;
const resetFilter = rigaBollaFA.resetFilter;


const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModal(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataBolla: getTestataBolla(state),
	         listeningTestataBolla: getListeningTestataBolla(state),
	         staleTotali: isStaleTotali(state),
	         editedRigaBolla: getEditedRigaBolla(state),
	         messageBuffer: getMessageBufferBolla(state),
	         totaliBolla: getTotaliBolla(state),
		   filters: getFiltersBolla(state),
		   geometry: getGeometry(state,'BOLLA'),
		   	ordiniModalVisible: getOrdiniModalVisible(state)

		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ shiftMessage, resetBolla, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataBolla, unlistenTestataBolla, storeMeasure, setHeaderInfo, setFilter, resetFilter}, dispatch);
}

const Bolla = connect(mapStateToProps, mapDispatchToProps)(BollaComponent)


export default Bolla