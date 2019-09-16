import TableResaLiberaComponent from '../components/TableResaLibera'
import {rigaResaFA} from '../../../actions/resaLibera'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getEditedRigaResaLibera, getRigheResaLibera, getTableScrollResaLibera,  getListeningItemResaLibera} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaResa = rigaResaFA.setSelectedItem;
const listenRigaResa = rigaResaFA.listenItem;
const offListenRigaResa = rigaResaFA.offListenItem;
const deleteRigaResa = rigaResaFA.deleteItem;
const toggleTableScroll = rigaResaFA.toggleTableScroll;
const resetTableResa = rigaResaFA.resetTable;


const mapStateToProps = (state) => {
	return ({data: getRigheResaLibera(state), tableScroll: getTableScrollResaLibera(state), 
	selectedItem: getEditedRigaResaLibera(state).selectedItem,
	listeningItemResa: getListeningItemResaLibera(state)
		
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenRigaResa, offListenRigaResa, resetTableResa, deleteRigaResa, setSelectedRigaResa, toggleTableScroll }, dispatch);
}


const TableResaLibera = connect(mapStateToProps, mapDispatchToProps)(TableResaLiberaComponent)


export default TableResaLibera;