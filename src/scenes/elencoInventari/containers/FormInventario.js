import FormInventarioComponent from '../components/FormInventario'
import {inventarioFA} from '../../../actions/elencoInventari'
import {getEditedInventario, getReadOnlyFormInventario} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const changeEditedInventario = inventarioFA.changeEditedItem;
const submitEditedInventario = inventarioFA.submitEditedItem;
const resetEditedInventario = inventarioFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedInventario: getEditedInventario(state), readOnlyForm: getReadOnlyFormInventario(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedInventario, submitEditedInventario, resetEditedInventario }, dispatch);
}


const FormInventario = connect(mapStateToProps, mapDispatchToProps)(FormInventarioComponent)

export default FormInventario;