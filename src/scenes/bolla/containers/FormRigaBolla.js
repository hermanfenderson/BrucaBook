import FormRigaBollaComponent from '../components/FormRigaBolla'
import {changeEditedRigaBolla, submitEditedRigaBolla} from '../../../actions/bolle'
import {getEditedRigaBolla} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'



const mapStateToProps = (state) => { 
	return ({editedRigaBolla: getEditedRigaBolla(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedRigaBolla, submitEditedRigaBolla }, dispatch);
}


const FormRigaBolla = connect(mapStateToProps, mapDispatchToProps)(FormRigaBollaComponent)


export default FormRigaBolla;