import FormOrdineComponent from '../components/FormOrdine'
import {ordineFA} from '../../../actions/elencoOrdini'
import {getEditedOrdine, getReadOnlyFormOrdine, getAnagrafiche} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const changeEditedOrdine = ordineFA.changeEditedItem;
const submitEditedOrdine = ordineFA.submitEditedItem;
const resetEditedOrdine = ordineFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedOrdine: getEditedOrdine(state), 
	readOnlyForm: getReadOnlyFormOrdine(state), 
	statoOrdine: getAnagrafiche(state).StatoOrdine, 
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedOrdine, submitEditedOrdine, resetEditedOrdine }, dispatch);
}


const FormOrdine = connect(mapStateToProps, mapDispatchToProps)(FormOrdineComponent)

export default FormOrdine;