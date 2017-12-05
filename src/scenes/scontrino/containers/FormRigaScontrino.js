import FormRigaScontrinoComponent from '../components/FormRigaScontrino'
import {rigaScontrinoFA} from '../../../actions/scontrino'
import {getEditedRigaScontrino} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

import {store} from '../../../index.js';

const changeEditedRigaScontrino = rigaScontrinoFA.changeEditedItem;
const submitEditedRigaScontrino = rigaScontrinoFA.submitEditedItem;
const resetEditedRigaScontrino = rigaScontrinoFA.resetEditedItem;
const searchCatalogItem = rigaScontrinoFA.searchCatalogItem;
const focusSet = rigaScontrinoFA.focusSet;
//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...
const getEditedRigaScontrinoSideEffects= (state) => {
	let erb = getEditedRigaScontrino(state);
	//Il cambio di stato riguarda un EAN
	if (erb.eanState === 'VALID') {
							erb.eanState = 'PARTIAL'; //Mi metto alla ricerca.....
							store.dispatch(searchCatalogItem(erb.values.ean));
							}
	return(erb);
}


const mapStateToProps = (state) => { 
	return ({editedRigaScontrino: getEditedRigaScontrinoSideEffects(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedRigaScontrino, submitEditedRigaScontrino, resetEditedRigaScontrino, focusSet }, dispatch);
}


const FormRigaScontrino = connect(mapStateToProps, mapDispatchToProps)(FormRigaScontrinoComponent)

export default FormRigaScontrino;