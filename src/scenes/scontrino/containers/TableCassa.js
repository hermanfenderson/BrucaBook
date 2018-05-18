import TableCassaComponent from '../components/TableCassa'
import {cassaFA} from '../../../actions/cassa'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getEditedRigaCassa, getRigheCassa, getRigheCassaIndex, getTableHeightCassa, getTableScrollCassa, getTableScrollByKey, getListeningItemCassa, getListenersItemCassa, getGeometry} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaCassa = cassaFA.setSelectedItem;
const setTableWindowHeight = cassaFA.setTableWindowHeight;
const listenRigaCassa = cassaFA.listenItem;
const offListenRigaCassa = cassaFA.offListenItem;
const deleteRigaCassa = cassaFA.deleteItem;
const toggleTableScroll = cassaFA.toggleTableScroll;
const setTableScrollByKey = cassaFA.setTableScrollByKey;


const mapStateToProps = (state) => {
	return ({data: getRigheCassa(state), tableScroll: getTableScrollCassa(state), 
	height: getTableHeightCassa(state), 
	selectedItem: getEditedRigaCassa(state).selectedItem,
	listeningItemCassa: getListeningItemCassa(state),
	index: getRigheCassaIndex(state),
	tableScrollByKey: getTableScrollByKey(state,'CASSA'),
	listenersItemCassa: getListenersItemCassa(state),
	geometry: getGeometry(state, 'CASSA'),
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({listenRigaCassa, offListenRigaCassa, deleteRigaCassa, setSelectedRigaCassa, toggleTableScroll, setTableWindowHeight, setTableScrollByKey }, dispatch);
}


const TableCassa = connect(mapStateToProps, mapDispatchToProps)(TableCassaComponent)


export default TableCassa;