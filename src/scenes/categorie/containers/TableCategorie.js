import TableCategorieComponent from '../components/TableCategorie'
import {categorieFA} from '../../../actions/categorie'

import {getEditedCategoria, getCategorie, getTableCategorieHeight, getTableCategorieScroll, getListeningItemCategorie} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedCategoria = categorieFA.setSelectedItem;
const listenCategorie =  categorieFA.listenItem;
const offListenCategorie = categorieFA.offListenItem;
const deleteCategoria = categorieFA.deleteItem;
const toggleTableScroll = categorieFA.toggleTableScroll;
const resetTable = categorieFA.resetTable;

const mapStateToProps = (state) => {
	return ({data: getCategorie(state), 
	tableScroll: getTableCategorieScroll(state), 
	height: getTableCategorieHeight(state), 
	selectedItem: getEditedCategoria(state).selectedItem,
	listeningCategorie: getListeningItemCategorie(state)
		
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenCategorie, offListenCategorie, deleteCategoria, setSelectedCategoria, toggleTableScroll, resetTable }, dispatch);
}


const TableCategorie = connect(mapStateToProps, mapDispatchToProps)(TableCategorieComponent)


export default TableCategorie;