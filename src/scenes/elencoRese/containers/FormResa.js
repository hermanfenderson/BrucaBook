import FormResaComponent from '../components/FormResa'
import {resaFA} from '../../../actions/elencoRese'
import {getEditedResa, getReadOnlyFormResa, getAnagraficheLocali} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const changeEditedResa = resaFA.changeEditedItem;
const submitEditedResa = resaFA.submitEditedItem;
const resetEditedResa = resaFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedResa: getEditedResa(state), 
	readOnlyForm: getReadOnlyFormResa(state), 
	fornitori: getAnagraficheLocali(state).fornitori

	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedResa, submitEditedResa, resetEditedResa }, dispatch);
}


const FormResa = connect(mapStateToProps, mapDispatchToProps)(FormResaComponent)

export default FormResa;