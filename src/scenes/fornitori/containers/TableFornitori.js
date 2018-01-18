import TableFornitoriComponent from '../components/TableFornitori'
import {fornitoriFA} from '../../../actions/fornitori'

import {getEditedFornitore, getFornitori, getTableFornitoriHeight, getTableFornitoriScroll, getListeningItemFornitori} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedFornitore = fornitoriFA.setSelectedItem;
const listenFornitori =  fornitoriFA.listenItem;
const offListenFornitori = fornitoriFA.offListenItem;
const deleteFornitore = fornitoriFA.deleteItem;
const toggleTableScroll = fornitoriFA.toggleTableScroll;
const resetTable = fornitoriFA.resetTable;

const mapStateToProps = (state) => {
	return ({data: getFornitori(state), 
	tableScroll: getTableFornitoriScroll(state), 
	height: getTableFornitoriHeight(state), 
	selectedItem: getEditedFornitore(state).selectedItem,
	listeningFornitori: getListeningItemFornitori(state)
		
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenFornitori, offListenFornitori, deleteFornitore, setSelectedFornitore, toggleTableScroll, resetTable }, dispatch);
}


const TableFornitori = connect(mapStateToProps, mapDispatchToProps)(TableFornitoriComponent)


export default TableFornitori;