import FormCatalogoComponent from '../components/FormCatalogo'
import {catalogoFA, submitEditedCatalogItem, resetEditedCatalogItem }  from '../../../actions/catalogo' 
import {getEditedCatalogItem, getSaveGeneral} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

import {store} from '../../../index.js';

const changeEditedCatalogItem = catalogoFA.changeEditedItem;
const searchCatalogItem = catalogoFA.searchCatalogItem;


//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...
const getEditedCatalogItemSideEffects= (state) => {
	const erb = getEditedCatalogItem(state);

	//Il cambio di stato riguarda un EAN
	if (erb.eanState==='VALID') {
							erb.eanState = 'PARTIAL'; //Mi metto alla ricerca....
							store.dispatch(searchCatalogItem(erb.values.ean));
							}
	return(erb);
}


const mapStateToProps = (state) => { 
	return ({editedCatalogItem: getEditedCatalogItemSideEffects(state), saveGeneral: getSaveGeneral(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedCatalogItem, submitEditedCatalogItem, resetEditedCatalogItem }, dispatch);
}


const FormCatalogo = connect(mapStateToProps, mapDispatchToProps)(FormCatalogoComponent)

export default FormCatalogo;