import FormClienteComponent from '../components/FormCliente'
import {clientiFA} from '../../../actions/clienti'
import {getEditedCliente} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const changeEditedCliente = clientiFA.changeEditedItem;
const submitEditedCliente = clientiFA.submitEditedItem;
const resetEditedCliente = clientiFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedCliente: getEditedCliente(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedCliente, submitEditedCliente, resetEditedCliente }, dispatch);
}


const FormCliente = connect(mapStateToProps, mapDispatchToProps)(FormClienteComponent)

export default FormCliente;