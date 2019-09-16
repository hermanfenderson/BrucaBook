import ResaLiberaComponent from '../components/ResaLibera'
import {rigaResaFA} from '../../../actions/resaLibera'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {setHeaderInfo} from '../../../actions'

import {getMessageBufferResaLibera, getShowCatalogModalResaLibera, getEditedCatalogItem, getTestataResaLibera, getTotaliResaLibera, getFiltersResaLibera, getGeometry, getListeningTestataResaLibera, isStaleTotaliResaLibera, getEditedRigaResaLibera} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataResa = rigaResaFA.listenTestata;
const unlistenTestataResa = rigaResaFA.unlistenTestata;
const resetResa = rigaResaFA.reset;
const shiftMessage = rigaResaFA.shiftMessage;
const setFilter = rigaResaFA.setFilter;
const resetFilter = rigaResaFA.resetFilter;



const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModalResaLibera(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataResa: getTestataResaLibera(state),
	         listeningTestataBolla: getListeningTestataResaLibera(state),
	         staleTotali: isStaleTotaliResaLibera(state),
	         editedRigaResa: getEditedRigaResaLibera(state),
	         messageBuffer: getMessageBufferResaLibera(state),
	           geometry: getGeometry(state,'RESA_LIBERA'),
		     filters: getFiltersResaLibera(state),
		        totaliResa: getTotaliResaLibera(state),
		
		            
		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ shiftMessage, resetResa, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataResa, unlistenTestataResa, setHeaderInfo, setFilter, resetFilter}, dispatch);
}

const ResaLibera= connect(mapStateToProps, mapDispatchToProps)(ResaLiberaComponent)


export default ResaLibera