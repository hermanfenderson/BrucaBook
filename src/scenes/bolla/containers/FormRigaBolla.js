import FormRigaBollaComponent from '../components/FormRigaBolla'
import {rigaBollaFA} from '../../../actions/bolla'
import {getEditedRigaBolla} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

import {store} from '../../../index.js';

const changeEditedRigaBolla = rigaBollaFA.changeEditedItem;
const submitEditedRigaBolla = rigaBollaFA.submitEditedItem;
const resetEditedRigaBolla = rigaBollaFA.resetEditedItem;
const searchCatalogItem = rigaBollaFA.searchCatalogItem;
//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...
const getEditedRigaBollaSideEffects= (state) => {
	let erb = getEditedRigaBolla(state);
	//Il cambio di stato riguarda un EAN
	if (erb.eanState == 'VALID') {
							erb.eanState = 'PARTIAL'; //Mi metto alla ricerca.....
							store.dispatch(searchCatalogItem(erb.values.ean));
							}
	return(erb);
}


const mapStateToProps = (state) => { 
	return ({editedRigaBolla: getEditedRigaBollaSideEffects(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedRigaBolla, submitEditedRigaBolla, resetEditedRigaBolla }, dispatch);
}


const FormRigaBolla = connect(mapStateToProps, mapDispatchToProps)(FormRigaBollaComponent)

export default FormRigaBolla;