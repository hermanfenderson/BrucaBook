import FormRigaBollaComponent from '../components/FormRigaBolla'
import {rigaBollaFA} from '../../../actions/bolla'
import {setOrdiniApertiperEAN, setShowOrdiniApertiModal, saveOrdiniApertiDiff} from '../../../actions/ordiniAperti'
import {getEditedRigaBolla, getEanTreeBolla, getShowOrdiniApertiModal} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

import {store} from '../../../index.js';

const changeEditedRigaBolla = rigaBollaFA.changeEditedItem;
const submitEditedRigaBolla = rigaBollaFA.submitEditedItem;
const resetEditedRigaBolla = rigaBollaFA.resetEditedItem;
const searchCatalogItem = rigaBollaFA.searchCatalogItem;
const focusSet = rigaBollaFA.focusSet;
//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...
const getEditedRigaBollaSideEffects= (state) => {
	let erb = getEditedRigaBolla(state);
	//Il cambio di stato riguarda un EAN
	if (erb.eanState === 'VALID') {
							erb.eanState = 'PARTIAL'; //Mi metto alla ricerca.....
							store.dispatch(searchCatalogItem(erb.values.ean));
							}
	return(erb);
}


const mapStateToProps = (state) => { 
	return ({editedRigaBolla: getEditedRigaBollaSideEffects(state), eanTree: getEanTreeBolla(state), showOrdiniApertiModal: getShowOrdiniApertiModal(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedRigaBolla, submitEditedRigaBolla, resetEditedRigaBolla, focusSet, setOrdiniApertiperEAN, setShowOrdiniApertiModal, saveOrdiniApertiDiff }, dispatch);
}


const FormRigaBolla = connect(mapStateToProps, mapDispatchToProps)(FormRigaBollaComponent)

export default FormRigaBolla;