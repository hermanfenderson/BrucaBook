import TableResaComponent from '../components/TableResa'
import {rigaResaFA} from '../../../actions/resa'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getEditedRigaResa, getRigheResa, getTableResaHeight, getTableResaScroll,  getListeningItemResa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaResa = rigaResaFA.setSelectedItem;
const setTableWindowHeight = rigaResaFA.setTableWindowHeight;
const listenRigaResa = rigaResaFA.listenItem;
const offListenRigaResa = rigaResaFA.offListenItem;
const deleteRigaResa = rigaResaFA.deleteItem;
const toggleTableScroll = rigaResaFA.toggleTableScroll;
const resetTableResa = rigaResaFA.resetTable;


const mapStateToProps = (state) => {
	return ({data: getRigheResa(state), tableScroll: getTableResaScroll(state), 
	height: getTableResaHeight(state), 
	selectedItem: getEditedRigaResa(state).selectedItem,
	listeningItemResa: getListeningItemResa(state)
		
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenRigaResa, offListenRigaResa, resetTableResa, deleteRigaResa, setSelectedRigaResa, toggleTableScroll, setTableWindowHeight }, dispatch);
}


const TableResa = connect(mapStateToProps, mapDispatchToProps)(TableResaComponent)


export default TableResa;