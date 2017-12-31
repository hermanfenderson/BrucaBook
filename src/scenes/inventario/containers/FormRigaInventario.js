import FormRigaInventarioComponent from '../components/FormRigaInventario'
import {rigaInventarioFA} from '../../../actions/inventario'
import {getEditedRigaInventario} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

import {store} from '../../../index.js';

const changeEditedRigaInventario = rigaInventarioFA.changeEditedItem;
const submitEditedRigaInventario = rigaInventarioFA.submitEditedItem;
const resetEditedRigaInventario = rigaInventarioFA.resetEditedItem;
const searchCatalogItem = rigaInventarioFA.searchCatalogItem;
const setSelectedItem =  rigaInventarioFA.setSelectedItem;
const focusSet = rigaInventarioFA.focusSet;
//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...
const getEditedRigaInventarioSideEffects= (state) => {
	let erb = getEditedRigaInventario(state);
	//Il cambio di stato riguarda un EAN
	if (erb.eanState === 'VALID') {
		                    //Qui posso capire se la riga c'è già...
		                    if (state.inventario.itemsArrayIndex[erb.values.ean]>=0)
		                		{
		                		erb.eanState = 'COMPLETE'; //Mi metto alla ricerca.....
								erb.loading = false;
		                		store.dispatch(setSelectedItem(state.inventario.itemsArray[state.inventario.itemsArrayIndex[erb.values.ean]]))
		                    	}
		                    else
		                    	{
								erb.eanState = 'PARTIAL'; //Mi metto alla ricerca.....
								store.dispatch(searchCatalogItem(erb.values.ean));
		                    	}
							}
	return(erb);
}


const mapStateToProps = (state) => { 
	return ({editedRigaInventario: getEditedRigaInventarioSideEffects(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedRigaInventario, submitEditedRigaInventario, resetEditedRigaInventario, focusSet }, dispatch);
}


const FormRigaInventario = connect(mapStateToProps, mapDispatchToProps)(FormRigaInventarioComponent)

export default FormRigaInventario;