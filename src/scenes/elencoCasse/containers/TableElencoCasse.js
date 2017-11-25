import TableElencoCasseComponent from '../components/TableElencoCasse'
import {elencoCasseFA} from '../../../actions/elencoCasse'

import {getEditedCassa, getElencoCasse, getTableElencoCasseHeight, getTableElencoCasseScroll} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedCassa = elencoCasseFA.setSelectedItem;
const listenCassa = elencoCasseFA.listenItem;
const offListenCassa = elencoCasseFA.offListenItem;
const deleteCassa = elencoCasseFA.deleteItem;
const toggleTableScroll = elencoCasseFA.toggleTableScroll;
const resetTable = elencoCasseFA.resetTable;
const setReadOnlyForm = elencoCasseFA.setReadOnlyForm;

const mapStateToProps = (state) => {
	return ({data: getElencoCasse(state), tableScroll: getTableElencoCasseScroll(state), height: getTableElencoCasseHeight(state), selectedItem: getEditedCassa(state).selectedItem})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenCassa, offListenCassa, deleteCassa, setSelectedCassa, toggleTableScroll, setReadOnlyForm, resetTable }, dispatch);
}


const TableElencoCasse = connect(mapStateToProps, mapDispatchToProps)(TableElencoCasseComponent)


export default TableElencoCasse;