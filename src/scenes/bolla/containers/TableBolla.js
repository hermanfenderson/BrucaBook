import TableBollaComponent from '../components/TableBolla'
import {rigaBollaFA} from '../../../actions/bolla'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getEditedRigaBolla, getTableHeight, getTableScroll,  getListeningItemBolla, getTableScrollByKey, getItems} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaBolla = rigaBollaFA.setSelectedItem;
const setTableWindowHeight = rigaBollaFA.setTableWindowHeight;
const listenRigaBolla = rigaBollaFA.listenItem;
const offListenRigaBolla = rigaBollaFA.offListenItem;
const deleteRigaBolla = rigaBollaFA.deleteItem;
const toggleTableScroll = rigaBollaFA.toggleTableScroll;
const resetTableBolla = rigaBollaFA.resetTable;
const setTableScrollByKey = rigaBollaFA.setTableScrollByKey;


const mapStateToProps = (state) => {
	return ({
	//data: getRigheBolla(state),
	data: getItems(state,'BOLLA'),
	height: getTableHeight(state), 
	selectedItem: getEditedRigaBolla(state).selectedItem,
	listeningItemBolla: getListeningItemBolla(state),
	tableScroll: getTableScroll(state),
	tableScrollByKey: getTableScrollByKey(state,'BOLLA')	
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenRigaBolla, offListenRigaBolla, resetTableBolla, deleteRigaBolla, setSelectedRigaBolla,  setTableWindowHeight, setTableScrollByKey, toggleTableScroll}, dispatch);
}


const TableBolla = connect(mapStateToProps, mapDispatchToProps)(TableBollaComponent)


export default TableBolla;