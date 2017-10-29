import FormBollaComponent from '../components/FormBolla'
import {bollaFA, gotoBolla} from '../../../actions/elencoBolle'
import {getEditedBolla, getReadOnlyFormBolla, getGotoBolla} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const changeEditedBolla = bollaFA.changeEditedItem;
const submitEditedBolla = bollaFA.submitEditedItem;
const resetEditedBolla = bollaFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedBolla: getEditedBolla(state), readOnlyForm: getReadOnlyFormBolla(state), willGotoBolla: getGotoBolla(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedBolla, submitEditedBolla, resetEditedBolla, gotoBolla }, dispatch);
}


const FormBolla = connect(mapStateToProps, mapDispatchToProps)(FormBollaComponent)

export default FormBolla;