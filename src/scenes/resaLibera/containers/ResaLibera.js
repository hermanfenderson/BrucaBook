import ResaLiberaComponent from '../components/ResaLibera'
import {rigaResaFA} from '../../../actions/resaLibera'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getMessageBufferResaLibera, getShowCatalogModalResaLibera, getEditedCatalogItem, getTestataResaLibera, getListeningTestataResaLibera, isStaleTotaliResaLibera, getEditedRigaResaLibera} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataResa = rigaResaFA.listenTestata;
const unlistenTestataResa = rigaResaFA.unlistenTestata;
const resetResa = rigaResaFA.reset;
const shiftMessage = rigaResaFA.shiftMessage;


const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModalResaLibera(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataResa: getTestataResaLibera(state),
	         listeningTestataBolla: getListeningTestataResaLibera(state),
	         staleTotali: isStaleTotaliResaLibera(state),
	         editedRigaResa: getEditedRigaResaLibera(state),
	         messageBuffer: getMessageBufferResaLibera(state)
	         
		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ shiftMessage, resetResa, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataResa, unlistenTestataResa, storeMeasure, setHeaderInfo}, dispatch);
}

const ResaLibera= connect(mapStateToProps, mapDispatchToProps)(ResaLiberaComponent)


export default ResaLibera