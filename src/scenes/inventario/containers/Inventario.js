import InventarioComponent from '../components/Inventario'
import {rigaInventarioFA} from '../../../actions/inventario'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getMessageBufferInventario, getShowCatalogModalInventario, getEditedCatalogItem, getTestataInventario, getListeningTestataInventario, isStaleTotaliInventario, getEditedRigaInventario} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataInventario = rigaInventarioFA.listenTestata;
const unlistenTestataInventario = rigaInventarioFA.unlistenTestata;
const resetInventario = rigaInventarioFA.reset;
const shiftMessage = rigaInventarioFA.shiftMessage;


const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModalInventario(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataInventario: getTestataInventario(state),
	         listeningTestataInventario: getListeningTestataInventario(state),
	         staleTotali: isStaleTotaliInventario(state),
	         editedRigaInventario: getEditedRigaInventario(state),
	         messageBuffer: getMessageBufferInventario(state)
	         
		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ shiftMessage, resetInventario, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataInventario, unlistenTestataInventario, storeMeasure, setHeaderInfo}, dispatch);
}

const Inventario = connect(mapStateToProps, mapDispatchToProps)(InventarioComponent)


export default Inventario