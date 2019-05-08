import TableOrdineComponent from '../components/TableOrdine'
import {rigaOrdineFA} from '../../../actions/ordine'
//import {listenRigaOrdine, offListenRigaOrdine, deleteRigaOrdine, rigaOrdineFA} from '../../../actions/Ordine'

import {getEditedRigaOrdine, getTableHeightOrdine, getTableScrollOrdine,  getListeningItemOrdine, getListenersItemOrdine, getTableScrollByKey, getItems, getAnagrafiche} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaOrdine = rigaOrdineFA.setSelectedItem;
const setTableWindowHeight = rigaOrdineFA.setTableWindowHeight;
const listenRigaOrdine = rigaOrdineFA.listenItem;
const offListenRigaOrdine = rigaOrdineFA.offListenItem;
const deleteRigaOrdine = rigaOrdineFA.deleteItem;
const toggleTableScroll = rigaOrdineFA.toggleTableScroll;
const resetTableOrdine = rigaOrdineFA.resetTable;
const setTableScrollByKey = rigaOrdineFA.setTableScrollByKey;


const mapStateToProps = (state) => {
	return ({
	//data: getRigheOrdine(state),
	data: getItems(state,'ORDINE'),
	height: getTableHeightOrdine(state), 
	selectedItem: getEditedRigaOrdine(state).selectedItem,
	listeningItemOrdine: getListeningItemOrdine(state),
	listenersItemOrdine: getListenersItemOrdine(state),
	tableScroll: getTableScrollOrdine(state),
	tableScrollByKey: getTableScrollByKey(state,'ORDINE'), 
	statoRigaOrdine: getAnagrafiche(state).StatiRigheOrdine
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenRigaOrdine, offListenRigaOrdine, resetTableOrdine, deleteRigaOrdine, setSelectedRigaOrdine,  setTableWindowHeight, setTableScrollByKey, toggleTableScroll}, dispatch);
}


const TableOrdine = connect(mapStateToProps, mapDispatchToProps)(TableOrdineComponent)


export default TableOrdine;