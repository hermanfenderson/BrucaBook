import TableElencoBolleComponent from '../components/TableElencoBolle'
import {bollaFA, saveBolla} from '../../../actions/elencoBolle'

import {getEditedBolla, getElencoBolle, getTableElencoBolleScroll} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedBolla = bollaFA.setSelectedItem;
const listenBolla = bollaFA.listenItem;
const offListenBolla = bollaFA.offListenItem;
const deleteBolla = bollaFA.deleteItem;
const toggleTableScroll = bollaFA.toggleTableScroll;
const resetTable = bollaFA.resetTable;
const setReadOnlyForm = bollaFA.setReadOnlyForm;

const mapStateToProps = (state) => {
	return ({data: getElencoBolle(state), tableScroll: getTableElencoBolleScroll(state), selectedItem: getEditedBolla(state).selectedItem})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenBolla, offListenBolla, deleteBolla, setSelectedBolla, toggleTableScroll, setReadOnlyForm, resetTable, saveBolla }, dispatch);
}


const TableElencoBolle = connect(mapStateToProps, mapDispatchToProps)(TableElencoBolleComponent)


export default TableElencoBolle;