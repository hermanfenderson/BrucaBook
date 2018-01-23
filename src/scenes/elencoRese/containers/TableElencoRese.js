import TableElencoReseComponent from '../components/TableElencoRese'
import {resaFA} from '../../../actions/elencoRese'

import {getEditedResa, getElencoRese, getTableElencoReseHeight, getTableElencoReseScroll} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedResa = resaFA.setSelectedItem;
const listenResa = resaFA.listenItem;
const offListenResa = resaFA.offListenItem;
const deleteResa = resaFA.deleteItem;
const toggleTableScroll = resaFA.toggleTableScroll;
const resetTable = resaFA.resetTable;
const setReadOnlyForm = resaFA.setReadOnlyForm;

const mapStateToProps = (state) => {
	return ({data: getElencoRese(state), tableScroll: getTableElencoReseScroll(state), height: getTableElencoReseHeight(state), selectedItem: getEditedResa(state).selectedItem})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenResa, offListenResa, deleteResa, setSelectedResa, toggleTableScroll, setReadOnlyForm, resetTable }, dispatch);
}


const TableElencoRese = connect(mapStateToProps, mapDispatchToProps)(TableElencoReseComponent)


export default TableElencoRese;