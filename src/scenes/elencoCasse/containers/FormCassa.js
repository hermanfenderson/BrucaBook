import FormCassaComponent from '../components/FormCassa'
import {elencoCasseFA} from '../../../actions/elencoCasse'
import {getEditedCassa, getReadOnlyFormCassa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const changeEditedCassa = elencoCasseFA.changeEditedItem;
const submitEditedCassa = elencoCasseFA.submitEditedItem;
const resetEditedCassa = elencoCasseFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedCassa: getEditedCassa(state), readOnlyForm: getReadOnlyFormCassa(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedCassa, submitEditedCassa, resetEditedCassa }, dispatch);
}


const FormCassa = connect(mapStateToProps, mapDispatchToProps)(FormCassaComponent)

export default FormCassa;