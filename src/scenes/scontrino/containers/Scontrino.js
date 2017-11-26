import ScontrinoComponent from '../components/Scontrino'
import {rigaScontrinoFA} from '../../../actions/scontrino'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getShowCatalogModalScontrino, getEditedCatalogItem, getTestataScontrino, getListeningTestataScontrino, isStaleTotaliScontrino} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
const listenTestataScontrino = rigaScontrinoFA.listenTestata;
const unlistenTestataScontrino = rigaScontrinoFA.unlistenTestata;
const resetScontrino = rigaScontrinoFA.reset;

const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModalScontrino(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataScontrino: getTestataScontrino(state),
	         listeningTestataScontrino: getListeningTestataScontrino(state),
	         staleTotali: isStaleTotaliScontrino(state)
	         
		
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetScontrino, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataScontrino, unlistenTestataScontrino, storeMeasure, setHeaderInfo}, dispatch);
}

const Scontrino = connect(mapStateToProps, mapDispatchToProps)(ScontrinoComponent)


export default Scontrino