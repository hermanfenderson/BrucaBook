import TableElencoOrdiniComponent from '../components/TableElencoOrdini'
import {ordineFA} from '../../../actions/elencoOrdini'

import {getEditedOrdine, getElencoOrdini, getTableElencoOrdiniHeight, getTableElencoOrdiniScroll} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedOrdine = ordineFA.setSelectedItem;
const listenOrdine = ordineFA.listenItem;
const offListenOrdine = ordineFA.offListenItem;
const deleteOrdine = ordineFA.deleteItem;
const toggleTableScroll = ordineFA.toggleTableScroll;
const resetTable = ordineFA.resetTable;
const setReadOnlyForm = ordineFA.setReadOnlyForm;

const mapStateToProps = (state) => {
	return ({data: getElencoOrdini(state), tableScroll: getTableElencoOrdiniScroll(state), height: getTableElencoOrdiniHeight(state), selectedItem: getEditedOrdine(state).selectedItem})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenOrdine, offListenOrdine, deleteOrdine, setSelectedOrdine, toggleTableScroll, setReadOnlyForm, resetTable }, dispatch);
}


const TableElencoOrdini = connect(mapStateToProps, mapDispatchToProps)(TableElencoOrdiniComponent)


export default TableElencoOrdini;