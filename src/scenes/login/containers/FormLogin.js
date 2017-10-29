import FormLoginComponent from '../components/FormLogin'
import {loginFA} from '../../../actions/login'
import {getEditedItemLogin} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const changeEditedLogin = loginFA.changeEditedItem;
const submitEditedLogin = loginFA.submitEditedItem;
const resetEditedLogin = loginFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedItem: getEditedItemLogin(state), authenticated: state.status.authenticated})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedLogin, submitEditedLogin, resetEditedLogin }, dispatch);
}


const FormLogin = connect(mapStateToProps, mapDispatchToProps)(FormLoginComponent)

export default FormLogin;