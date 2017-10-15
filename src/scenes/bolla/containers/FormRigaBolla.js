import FormRigaBollaComponent from '../components/FormRigaBolla'
import {changeEditedRigaBolla, submitEditedRigaBolla} from '../../../actions/bolle'
import {searchCatalogItem} from '../../../actions/catalog'
import {getEditedRigaBolla} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
import {isValidEAN} from '../../..//helpers/ean';

import {store} from '../../../index.js';

let ean = '';

//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...
const getEditedRigaBollaSideEffects= (state) => {
	const erb = getEditedRigaBolla(state);
	//Il cambio di stato riguarda un EAN
	if (erb.values.ean !== ean) {
							ean = erb.values.ean;
							//Se E' UN EAN VALIDO LO CERCO...
							if (isValidEAN(ean)) store.dispatch(searchCatalogItem(ean));
							}
	return(erb);
}

const mapStateToProps = (state) => { 
	return ({editedRigaBolla: getEditedRigaBollaSideEffects(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedRigaBolla, submitEditedRigaBolla }, dispatch);
}


const FormRigaBolla = connect(mapStateToProps, mapDispatchToProps)(FormRigaBollaComponent)

export default FormRigaBolla;