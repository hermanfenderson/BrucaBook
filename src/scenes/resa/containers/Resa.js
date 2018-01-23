import ResaComponent from '../components/Resa'
import {rigaResaFA} from '../../../actions/resa'

import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getMessageBufferResa,  getEditedCatalogItem, getTestataResa, getListeningTestataResa, isStaleTotali, getEditedRigaResa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataResa = rigaResaFA.listenTestata;
const unlistenTestataResa = rigaResaFA.unlistenTestata;
const resetResa = rigaResaFA.reset;
const shiftMessage = rigaResaFA.shiftMessage;


const mapStateToProps = (state) => {
	return ({
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataResa: getTestataResa(state),
	         listeningTestataResa: getListeningTestataResa(state),
	         staleTotali: isStaleTotali(state),
	         editedRigaResa: getEditedRigaResa(state),
	         messageBuffer: getMessageBufferResa(state)
	         
		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ shiftMessage, resetResa, 
  listenTestataResa, unlistenTestataResa, storeMeasure, setHeaderInfo}, dispatch);
}

const Resa = connect(mapStateToProps, mapDispatchToProps)(ResaComponent)


export default Resa