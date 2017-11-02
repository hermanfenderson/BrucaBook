import FormSignupComponent from '../components/FormSignup'
import {loginFA} from '../../../actions/signup'
import {getEditedItemSignup, isAuthenticated} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const changeEditedSignup = loginFA.changeEditedItem;
const submitEditedSignup = loginFA.submitEditedItem;
const resetEditedSignup = loginFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedItem: getEditedItemSignup(state), authenticated: isAuthenticated(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedSignup, submitEditedSignup, resetEditedSignup }, dispatch);
}


const FormSignup = connect(mapStateToProps, mapDispatchToProps)(FormSignupComponent)

export default FormSignup;