import OrdineComponent from '../components/Ordine'
import {rigaOrdineFA} from '../../../actions/ordine'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getMessageBufferOrdine, getShowCatalogModalOrdine, getEditedCatalogItem, getTestataOrdine, getListeningTestataOrdine, isStaleTotaliOrdine, getEditedRigaOrdine, getTotaliOrdine, getFiltersOrdine, getGeometry, getAnagraficheLocali} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataOrdine = rigaOrdineFA.listenTestata;
const unlistenTestataOrdine = rigaOrdineFA.unlistenTestata;
const resetOrdine = rigaOrdineFA.reset;
const shiftMessage = rigaOrdineFA.shiftMessage;
const setFilter = rigaOrdineFA.setFilter;
const resetFilter = rigaOrdineFA.resetFilter;


const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModalOrdine(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataOrdine: getTestataOrdine(state),
	         listeningTestataOrdine: getListeningTestataOrdine(state),
	         staleTotali: isStaleTotaliOrdine(state),
	         editedRigaOrdine: getEditedRigaOrdine(state),
	          totaliOrdine: getTotaliOrdine(state),
		   filters: getFiltersOrdine(state),
		   geometry: getGeometry(state,'ORDINE'),
		   clienti: getAnagraficheLocali(state).clienti
		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ shiftMessage, resetOrdine, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataOrdine, unlistenTestataOrdine, storeMeasure, setHeaderInfo, setFilter, resetFilter}, dispatch);
}

const Ordine = connect(mapStateToProps, mapDispatchToProps)(OrdineComponent)


export default Ordine