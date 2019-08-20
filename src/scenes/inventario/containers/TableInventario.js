import TableInventarioComponent from '../components/TableInventario'
import {rigaInventarioFA} from '../../../actions/inventario'

import {getEditedRigaInventario, getRigheInventario, getTableScrollInventario, getTableScrollByKey, getListeningItemInventario} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaInventario = rigaInventarioFA.setSelectedItem;
const setTableWindowHeight = rigaInventarioFA.setTableWindowHeight;
const listenRigaInventario = rigaInventarioFA.listenItem;
const offListenRigaInventario = rigaInventarioFA.offListenItem;
const deleteRigaInventario = rigaInventarioFA.deleteItem;
const toggleTableScroll = rigaInventarioFA.toggleTableScroll;
const resetTableInventario = rigaInventarioFA.resetTable;
const togglePin = rigaInventarioFA.togglePin;
const setTableScrollByKey = rigaInventarioFA.setTableScrollByKey;


const mapStateToProps = (state) => {
	return ({data: getRigheInventario(state), tableScroll: getTableScrollInventario(state), 
	selectedItem: getEditedRigaInventario(state).selectedItem,
	listeningItemInventario: getListeningItemInventario(state),
	tableScrollByKey: getTableScrollByKey(state,'INVENTARIO'),
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ togglePin, listenRigaInventario, offListenRigaInventario, resetTableInventario, deleteRigaInventario, setSelectedRigaInventario, toggleTableScroll, setTableWindowHeight, setTableScrollByKey }, dispatch);
}


const TableInventario = connect(mapStateToProps, mapDispatchToProps)(TableInventarioComponent)


export default TableInventario;