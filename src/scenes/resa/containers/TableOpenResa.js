import TableOpenResaComponent from '../components/TableOpenResa'
import {rigaResaFA, setActiveModal, setModalDetails, setPeriodResa, showModalDetails} from '../../../actions/resa'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getEditedRigaResa, getRigheResaIndexed, getTableResaScroll,  getListeningItemResa, getTabellaEAN, getTabelleRigheEAN, getDettagliEANResa, getMatrixEAN, getHeaderEANResa, getStock} from '../../../reducers'
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
	selectedItem: getEditedRigaResa(state).selectedItem,
	listeningItemResa: getListeningItemResa(state),
	tabellaEAN: getTabellaEAN(state),
	tabelleRigheEAN: getTabelleRigheEAN(state), 
	dettagliEAN: getDettagliEANResa(state),
	matrixEAN: getMatrixEAN(state),
	headerEAN: getHeaderEANResa(state),
	stock: getStock(state, 'RESA'),
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ submitEditedItem, changeEditedItem, listenRigaResa, offListenRigaResa, resetTableResa, deleteRigaResa, setSelectedRigaResa, toggleTableScroll, setTableWindowHeight, setActiveModal, setModalDetails, setPeriodResa, showModalDetails }, dispatch);
}


const TableOpenResa = connect(mapStateToProps, mapDispatchToProps)(TableOpenResaComponent)


export default TableOpenResa;