import ResaComponent from '../components/Resa'
import {rigaResaFA, listenBollePerFornitore, unlistenBollePerFornitore} from '../../../actions/resa'
import {setStato} from '../../../actions/elencoRese'

import {setHeaderInfo} from '../../../actions'
import {getGeometry, getMagazzinoItem, getRigaBolla} from '../../../reducers'


import {getMessageBufferResa,  getEditedCatalogItem, getFilters, getTestataResa, getListeningTestataResa, isStaleTotaliResa, getEditedRigaResa, } from '../../../reducers'
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
const datiStoricoMagazzino = rigaResaFA.datiStoricoMagazzino;
const setFilter = rigaResaFA.setFilter;


const mapStateToProps = (state) => {
	return ({
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataResa: getTestataResa(state),
	         listeningTestataResa: getListeningTestataResa(state),
	         staleTotali: isStaleTotaliResa(state),
	         editedRigaResa: getEditedRigaResa(state),
	         messageBuffer: getMessageBufferResa(state),
	          geometry: getGeometry(state, 'RESA'),
	           filters: getFilters(state, 'RESA'),
	         
	          //Funzione che dato un EAn ritorna il suo valore...
	          getMagazzinoItem: getMagazzinoItem(state),
	          getRigaBolla: getRigaBolla(state),
	          
	          
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ shiftMessage, setFilter, resetResa, listenBollePerFornitore,  unlistenBollePerFornitore,
  listenTestataResa, unlistenTestataResa,  setHeaderInfo, setStato, listenRigaResa, offListenRigaResa, resetTableResa, searchDataMagazzino, datiStoricoMagazzino}, dispatch);
}

const Resa = connect(mapStateToProps, mapDispatchToProps)(ResaComponent)


export default Resa