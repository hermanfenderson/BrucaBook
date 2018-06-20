import TableElencoInventariComponent from '../components/TableElencoInventari'
import {inventarioFA, saveInventario} from '../../../actions/elencoInventari'

import {getEditedInventario, getElencoInventari, getTableElencoInventariHeight, getTableElencoInventariScroll, getListeningItemElencoInventari} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedInventario = inventarioFA.setSelectedItem;
const listenElencoInventari = inventarioFA.listenItem;
const offListenElencoInventari = inventarioFA.offListenItem;
const deleteInventario = inventarioFA.deleteItem;
const toggleTableScroll = inventarioFA.toggleTableScroll;
const resetTable = inventarioFA.resetTable;
const setReadOnlyForm = inventarioFA.setReadOnlyForm;

const mapStateToProps = (state) => {
	return ({data: getElencoInventari(state), 
	tableScroll: getTableElencoInventariScroll(state), 
	height: getTableElencoInventariHeight(state), 
	selectedItem: getEditedInventario(state).selectedItem,
	listeningElencoInventari: getListeningItemElencoInventari(state)
		
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenElencoInventari, offListenElencoInventari, deleteInventario, setSelectedInventario, toggleTableScroll, setReadOnlyForm, resetTable, saveInventario }, dispatch);
}


const TableElencoInventari = connect(mapStateToProps, mapDispatchToProps)(TableElencoInventariComponent)


export default TableElencoInventari;