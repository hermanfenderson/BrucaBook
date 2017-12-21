import FormUserMgmtComponent from '../components/FormUserMgmt'
import {loginFA, setMode, resetState, verifyCode} from '../../../actions/userMgmt'
import {signOutUser, setHeaderInfo} from '../../../actions'
import {getEditedItemUserMgmt, isAuthenticated} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const changeEditedSignup = loginFA.changeEditedItem;
const submitEditedSignup = loginFA.submitEditedItem;
const resetEditedSignup = loginFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedItem: getEditedItemUserMgmt(state), authenticated: isAuthenticated(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ verifyCode, resetState,setHeaderInfo, signOutUser, changeEditedSignup, submitEditedSignup, resetEditedSignup, setMode }, dispatch);
}


const FormUserMgmt = connect(mapStateToProps, mapDispatchToProps)(FormUserMgmtComponent)

export default FormUserMgmt;