import TableScontrinoComponent from '../components/TableScontrino'
import {rigaScontrinoFA} from '../../../actions/scontrino'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getEditedRigaScontrino, getRigheScontrino, getTableHeightScontrino, getTableScrollScontrino, getMeasuresScontrino, getListeningItemScontrino} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedRigaScontrino = rigaScontrinoFA.setSelectedItem;
const setTableWindowHeight = rigaScontrinoFA.setTableWindowHeight;
const listenRigaScontrino = rigaScontrinoFA.listenItem;
const offListenRigaScontrino = rigaScontrinoFA.offListenItem;
const deleteRigaScontrino = rigaScontrinoFA.deleteItem;
const toggleTableScroll = rigaScontrinoFA.toggleTableScroll;


const mapStateToProps = (state) => {
	return ({data: getRigheScontrino(state), tableScroll: getTableScrollScontrino(state), 
	height: getTableHeightScontrino(state), measures: getMeasuresScontrino(state), 
	selectedItem: getEditedRigaScontrino(state).selectedItem,
	listeningItemScontrino: getListeningItemScontrino(state)
		
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenRigaScontrino, offListenRigaScontrino, deleteRigaScontrino, setSelectedRigaScontrino, toggleTableScroll, setTableWindowHeight }, dispatch);
}


const TableScontrino = connect(mapStateToProps, mapDispatchToProps)(TableScontrinoComponent)


export default TableScontrino;