import TableBollaComponent from '../components/TableBolla'
import {rigaBollaFA} from '../../../actions/bolla'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getEditedRigaBolla, getRigheBolla, getTableHeight, getTableScroll} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaBolla = rigaBollaFA.setSelectedItem;
const listenRigaBolla = rigaBollaFA.listenItem;
const offListenRigaBolla = rigaBollaFA.offListenItem;
const deleteRigaBolla = rigaBollaFA.deleteItem;
const toggleTableScroll = rigaBollaFA.toggleTableScroll;


const mapStateToProps = (state) => {
	return ({data: getRigheBolla(state), tableScroll: getTableScroll(state), height: getTableHeight(state), selectedItem: getEditedRigaBolla(state).selectedItem})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenRigaBolla, offListenRigaBolla, deleteRigaBolla, setSelectedRigaBolla, toggleTableScroll }, dispatch);
}


const TableBolla = connect(mapStateToProps, mapDispatchToProps)(TableBollaComponent)


export default TableBolla;