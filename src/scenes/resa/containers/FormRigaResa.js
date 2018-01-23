//Questa probabilmente muore...
import FormRigaResaComponent from '../components/FormRigaResa'
import {rigaResaFA} from '../../../actions/resa'
import {getEditedRigaResa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

import {store} from '../../../index.js';

const changeEditedRigaResa = rigaResaFA.changeEditedItem;
const submitEditedRigaResa = rigaResaFA.submitEditedItem;
const resetEditedRigaResa = rigaResaFA.resetEditedItem;
const searchCatalogItem = rigaResaFA.searchCatalogItem;
const focusSet = rigaResaFA.focusSet;
//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...
const getEditedRigaResaSideEffects= (state) => {
	let erb = getEditedRigaResa(state);
	//Il cambio di stato riguarda un EAN
	if (erb.eanState === 'VALID') {
							erb.eanState = 'PARTIAL'; //Mi metto alla ricerca.....
							store.dispatch(searchCatalogItem(erb.values.ean));
							}
	return(erb);
}


const mapStateToProps = (state) => { 
	return ({editedRigaResa: getEditedRigaResaSideEffects(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedRigaResa, submitEditedRigaResa, resetEditedRigaResa, focusSet }, dispatch);
}


const FormRigaResa = connect(mapStateToProps, mapDispatchToProps)(FormRigaResaComponent)

export default FormRigaResa;