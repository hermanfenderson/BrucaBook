import TableCassaComponent from '../components/TableCassa'
import {cassaFA, setRedirect} from '../../../actions/cassa'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getEditedRigaCassa, getRigheCassa, getRigheCassaIndex, getTableHeightCassa, getTableScrollCassa, getListeningItemCassa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaCassa = cassaFA.setSelectedItem;
const setTableWindowHeight = cassaFA.setTableWindowHeight;
const listenRigaCassa = cassaFA.listenItem;
const offListenRigaCassa = cassaFA.offListenItem;
const deleteRigaCassa = cassaFA.deleteItem;
const toggleTableScroll = cassaFA.toggleTableScroll;


const mapStateToProps = (state) => {
	return ({data: getRigheCassa(state), tableScroll: getTableScrollCassa(state), 
	height: getTableHeightCassa(state), 
	selectedItem: getEditedRigaCassa(state).selectedItem,
	listeningItemCassa: getListeningItemCassa(state),
	index: getRigheCassaIndex(state)
		
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenRigaCassa, offListenRigaCassa, deleteRigaCassa, setSelectedRigaCassa, toggleTableScroll, setTableWindowHeight, setRedirect }, dispatch);
}


const TableCassa = connect(mapStateToProps, mapDispatchToProps)(TableCassaComponent)


export default TableCassa;