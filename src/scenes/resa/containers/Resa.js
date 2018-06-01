import ResaComponent from '../components/Resa'
import {rigaResaFA, listenBollePerFornitore, unlistenBollePerFornitore} from '../../../actions/resa'
import {setStato} from '../../../actions/elencoRese'

import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getMessageBufferResa,  getEditedCatalogItem, getTestataResa, getListeningTestataResa, isStaleTotaliResa, getEditedRigaResa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataResa = rigaResaFA.listenTestata;
const unlistenTestataResa = rigaResaFA.unlistenTestata;
const listenRigaResa = rigaResaFA.listenItem;
const offListenRigaResa = rigaResaFA.offListenItem;
const searchDataMagazzino = rigaResaFA.searchDataMagazzino;
const resetResa = rigaResaFA.reset;
const shiftMessage = rigaResaFA.shiftMessage;
const resetTableResa = rigaResaFA.resetTable;

const mapStateToProps = (state) => {
	return ({
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataResa: getTestataResa(state),
	         listeningTestataResa: getListeningTestataResa(state),
	         staleTotali: isStaleTotaliResa(state),
	         editedRigaResa: getEditedRigaResa(state),
	         messageBuffer: getMessageBufferResa(state)
	         
		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ shiftMessage, resetResa, listenBollePerFornitore, unlistenBollePerFornitore,
  listenTestataResa, unlistenTestataResa, storeMeasure, setHeaderInfo, setStato, listenRigaResa, offListenRigaResa, resetTableResa, searchDataMagazzino}, dispatch);
}

const Resa = connect(mapStateToProps, mapDispatchToProps)(ResaComponent)


export default Resa