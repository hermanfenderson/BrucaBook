import TableOpenResaComponent from '../components/TableOpenResa'
import {rigaResaFA, setActiveModal} from '../../../actions/resa'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getEditedRigaResa, getRigheResaIndexed, getTableResaHeight, getTableResaScroll,  getListeningItemResa, getTabellaEAN, getTabelleRigheEAN, getDettagliEANResa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaResa = rigaResaFA.setSelectedItem;
const setTableWindowHeight = rigaResaFA.setTableWindowHeight;
const listenRigaResa = rigaResaFA.listenItem;
const offListenRigaResa = rigaResaFA.offListenItem;
const deleteRigaResa = rigaResaFA.deleteItem;
const toggleTableScroll = rigaResaFA.toggleTableScroll;
const resetTableResa = rigaResaFA.resetTable;
const changeEditedItem = rigaResaFA.changeEditedItem;
const submitEditedItem = rigaResaFA.submitEditedItem;


const mapStateToProps = (state) => {
	return ({righeResa: getRigheResaIndexed(state), tableScroll: getTableResaScroll(state), 
	height: getTableResaHeight(state), 
	selectedItem: getEditedRigaResa(state).selectedItem,
	listeningItemResa: getListeningItemResa(state),
	tabellaEAN: getTabellaEAN(state),
	tabelleRigheEAN: getTabelleRigheEAN(state), 
	dettagliEAN: getDettagliEANResa(state)
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ submitEditedItem, changeEditedItem, listenRigaResa, offListenRigaResa, resetTableResa, deleteRigaResa, setSelectedRigaResa, toggleTableScroll, setTableWindowHeight, setActiveModal }, dispatch);
}


const TableOpenResa = connect(mapStateToProps, mapDispatchToProps)(TableOpenResaComponent)


export default TableOpenResa;