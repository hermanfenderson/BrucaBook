import FormRigaOrdineComponent from '../components/FormRigaOrdine'
import {rigaOrdineFA} from '../../../actions/ordine'
import {getEditedRigaOrdine, getAnagrafiche} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

import {store} from '../../../index.js';

const changeEditedRigaOrdine = rigaOrdineFA.changeEditedItem;
const submitEditedRigaOrdine = rigaOrdineFA.submitEditedItem;
const resetEditedRigaOrdine = rigaOrdineFA.resetEditedItem;
const searchCatalogItem = rigaOrdineFA.searchCatalogItem;
const focusSet = rigaOrdineFA.focusSet;
//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...
const getEditedRigaOrdineSideEffects= (state) => {
	let erb = getEditedRigaOrdine(state);
	//Il cambio di stato riguarda un EAN
	if (erb.eanState === 'VALID') {
							erb.eanState = 'PARTIAL'; //Mi metto alla ricerca.....
							//store.dispatch(searchCatalogItem(erb.values.ean));
							}
	return(erb);
}


const mapStateToProps = (state) => { 
	return ({editedRigaOrdine: getEditedRigaOrdineSideEffects(state), statoRigaOrdine: getAnagrafiche(state).StatiRigheOrdine})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedRigaOrdine, submitEditedRigaOrdine, resetEditedRigaOrdine, focusSet }, dispatch);
}


const FormRigaOrdine = connect(mapStateToProps, mapDispatchToProps)(FormRigaOrdineComponent)

export default FormRigaOrdine;