import InventarioComponent from '../components/Inventario'
import {rigaInventarioFA, generaRighe} from '../../../actions/inventario'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {setHeaderInfo} from '../../../actions'

import {getFilters, getMessageBufferInventario, getShowCatalogModalInventario, getEditedCatalogItem, getTestataInventario, getListeningTestataInventario, isStaleTotaliInventario, getEditedRigaInventario, getDataMagazzino, getGeometry, getMeasures} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataInventario = rigaInventarioFA.listenTestata;
const unlistenTestataInventario = rigaInventarioFA.unlistenTestata;
const resetInventario = rigaInventarioFA.reset;
const shiftMessage = rigaInventarioFA.shiftMessage;
const searchDataMagazzino = rigaInventarioFA.searchDataMagazzino;
const setFilter = rigaInventarioFA.setFilter;
const resetFilter = rigaInventarioFA.resetFilter;



const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModalInventario(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataInventario: getTestataInventario(state),
	         listeningTestataInventario: getListeningTestataInventario(state),
	         staleTotali: isStaleTotaliInventario(state),
	         editedRigaInventario: getEditedRigaInventario(state),
	         messageBuffer: getMessageBufferInventario(state),
	         dataMagazzino: getDataMagazzino(state, 'INVENTARIO'),
	         geometry: getGeometry(state,'INVENTARIO'),
	         measures: getMeasures(state),
	         formSearchCols: getGeometry(state,'INVENTARIO').formSearchCols,
	         filters: getFilters(state,'INVENTARIO')
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ generaRighe, shiftMessage, resetInventario, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataInventario, unlistenTestataInventario, setHeaderInfo, searchDataMagazzino, setFilter, resetFilter}, dispatch);
}

const Inventario = connect(mapStateToProps, mapDispatchToProps)(InventarioComponent)


export default Inventario