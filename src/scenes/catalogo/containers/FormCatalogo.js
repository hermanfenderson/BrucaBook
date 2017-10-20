import FormCatalogoComponent from '../components/FormCatalogo'
import {changeEditedCatalogItem, submitEditedCatalogItem, searchCatalogItem} from '../../../actions/catalog'
import {getEditedCatalogItem} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
import {isValidEAN} from '../../..//helpers/ean';

import {store} from '../../../index.js';

//Memorizzo il penultimo ean...
let ean = '';

//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...
const getEditedCatalogItemSideEffects= (state) => {
	const erb = getEditedCatalogItem(state);

	//Il cambio di stato riguarda un EAN
	if (erb.values.ean !== ean) {
							ean = erb.values.ean;
							if (!erb.ignoreEAN && isValidEAN(ean)) store.dispatch(searchCatalogItem(ean));
							}
	return(erb);
}


const mapStateToProps = (state) => { 
	return ({editedCatalogItem: getEditedCatalogItemSideEffects(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedCatalogItem, submitEditedCatalogItem }, dispatch);
}


const FormCatalogo = connect(mapStateToProps, mapDispatchToProps)(FormCatalogoComponent)

export default FormCatalogo;