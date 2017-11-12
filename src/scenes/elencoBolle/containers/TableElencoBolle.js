import TableElencoBolleComponent from '../components/TableElencoBolle'
import {bollaFA, setReadOnlyBollaForm} from '../../../actions/elencoBolle'

import {getEditedBolla, getElencoBolle, getTableElencoBolleHeight, getTableElencoBolleScroll} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedBolla = bollaFA.setSelectedItem;
const listenBolla = bollaFA.listenItem;
const offListenBolla = bollaFA.offListenItem;
const deleteBolla = bollaFA.deleteItem;
const toggleTableScroll = bollaFA.toggleTableScroll;
const resetTable = bollaFA.resetTable;
const setReadOnlyForm = setReadOnlyBollaForm;


const mapStateToProps = (state) => {
	return ({data: getElencoBolle(state), tableScroll: getTableElencoBolleScroll(state), height: getTableElencoBolleHeight(state), selectedItem: getEditedBolla(state).selectedItem})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenBolla, offListenBolla, deleteBolla, setSelectedBolla, toggleTableScroll, setReadOnlyForm, resetTable }, dispatch);
}


const TableElencoBolle = connect(mapStateToProps, mapDispatchToProps)(TableElencoBolleComponent)


export default TableElencoBolle;