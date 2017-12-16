import BollaComponent from '../components/Bolla'
import {rigaBollaFA} from '../../../actions/bolla'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getShowCatalogModal, getEditedCatalogItem, getTestataBolla, getListeningTestataBolla, isStaleTotali, getEditedRigaBolla} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataBolla = rigaBollaFA.listenTestata;
const unlistenTestataBolla = rigaBollaFA.unlistenTestata;
const resetBolla = rigaBollaFA.reset;

const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModal(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataBolla: getTestataBolla(state),
	         listeningTestataBolla: getListeningTestataBolla(state),
	         staleTotali: isStaleTotali(state),
	         editedRigaBolla: getEditedRigaBolla(state)
	         
		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetBolla, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataBolla, unlistenTestataBolla, storeMeasure, setHeaderInfo}, dispatch);
}

const Bolla = connect(mapStateToProps, mapDispatchToProps)(BollaComponent)


export default Bolla