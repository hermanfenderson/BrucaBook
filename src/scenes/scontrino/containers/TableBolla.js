import TableBollaComponent from '../components/TableBolla'
import {rigaBollaFA} from '../../../actions/bolla'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getEditedRigaBolla, getRigheBolla, getTableHeight, getTableScroll, getMeasures, getListeningItemBolla} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaBolla = rigaBollaFA.setSelectedItem;
const setTableWindowHeight = rigaBollaFA.setTableWindowHeight;
const listenRigaBolla = rigaBollaFA.listenItem;
const offListenRigaBolla = rigaBollaFA.offListenItem;
const deleteRigaBolla = rigaBollaFA.deleteItem;
const toggleTableScroll = rigaBollaFA.toggleTableScroll;


const mapStateToProps = (state) => {
	return ({data: getRigheBolla(state), tableScroll: getTableScroll(state), 
	height: getTableHeight(state), measures: getMeasures(state), 
	selectedItem: getEditedRigaBolla(state).selectedItem,
	listeningItemBolla: getListeningItemBolla(state)
		
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenRigaBolla, offListenRigaBolla, deleteRigaBolla, setSelectedRigaBolla, toggleTableScroll, setTableWindowHeight }, dispatch);
}


const TableBolla = connect(mapStateToProps, mapDispatchToProps)(TableBollaComponent)


export default TableBolla;