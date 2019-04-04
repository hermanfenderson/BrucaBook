import TableClientiComponent from '../components/TableClienti'
import {clientiFA} from '../../../actions/clienti'

import {getEditedCliente, getClienti, getTableClientiHeight, getTableClientiScroll, getListeningItemClienti} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedCliente = clientiFA.setSelectedItem;
const listenClienti =  clientiFA.listenItem;
const offListenClienti = clientiFA.offListenItem;
const deleteCliente = clientiFA.deleteItem;
const toggleTableScroll = clientiFA.toggleTableScroll;
const resetTable = clientiFA.resetTable;
const setReadOnlyForm = clientiFA.setReadOnlyForm;

const mapStateToProps = (state) => {
	return ({data: getClienti(state), 
	tableScroll: getTableClientiScroll(state), 
	height: getTableClientiHeight(state), 
	selectedItem: getEditedCliente(state).selectedItem,
	listeningClienti: getListeningItemClienti(state)
		
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenClienti, offListenClienti, deleteCliente, setSelectedCliente, toggleTableScroll, resetTable, setReadOnlyForm }, dispatch);
}


const TableClienti = connect(mapStateToProps, mapDispatchToProps)(TableClientiComponent)


export default TableClienti;