import InventarioComponent from '../components/Inventario'
import {rigaInventarioFA, generaRighe, listenRegistroEAN, unlistenRegistroEAN} from '../../../actions/inventario'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getMessageBufferInventario, getShowCatalogModalInventario, getEditedCatalogItem, getTestataInventario, getListeningTestataInventario, isStaleTotaliInventario, getEditedRigaInventario, isListeningRegistroEAN} from '../../../reducers'
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
	         messageBuffer: getMessageBufferInventario(state),
	         listeningRegistroEAN: isListeningRegistroEAN(state)
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ generaRighe, shiftMessage, resetInventario, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataInventario, unlistenTestataInventario, storeMeasure, setHeaderInfo, listenRegistroEAN, unlistenRegistroEAN}, dispatch);
}

const Inventario = connect(mapStateToProps, mapDispatchToProps)(InventarioComponent)


export default Inventario