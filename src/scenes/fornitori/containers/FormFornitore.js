import FormFornitoreComponent from '../components/FormFornitore'
import {fornitoriFA} from '../../../actions/fornitori'
import {getEditedFornitore} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const changeEditedFornitore = fornitoriFA.changeEditedItem;
const submitEditedFornitore = fornitoriFA.submitEditedItem;
const resetEditedFornitore = fornitoriFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedFornitore: getEditedFornitore(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedFornitore, submitEditedFornitore, resetEditedFornitore }, dispatch);
}


const FormFornitore = connect(mapStateToProps, mapDispatchToProps)(FormFornitoreComponent)

export default FormFornitore;