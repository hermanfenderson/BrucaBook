//Questo componente verrà chiamato indifferentemente da scontrini e bolle... non da questa scena...

import OrdiniModalTableComponent from '../components/OrdiniModalTable'
import {setOrdiniModalVisible} from '../../../actions/ordine'
//import {listenRigaOrdine, offListenRigaOrdine, deleteRigaOrdine, rigaOrdineFA} from '../../../actions/Ordine'

import {getOrdiniModalVisible, getGeometry, getAnagraficheLocali} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'



const mapStateToProps = (state) => {
	return ({
	//data: getRigheOrdine(state),
	ordiniModalVisible: getOrdiniModalVisible(state), 
	geometry: getGeometry(state,'ORDINE'),
    clienti: getAnagraficheLocali(state).clienti
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setOrdiniModalVisible}, dispatch);
}


const OrdiniModalTable = connect(mapStateToProps, mapDispatchToProps)(OrdiniModalTableComponent)


export default OrdiniModalTable;