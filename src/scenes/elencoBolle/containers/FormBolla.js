import FormBollaComponent from '../components/FormBolla'
import {bollaFA} from '../../../actions/elencoBolle'
import {getEditedBolla, getReadOnlyFormBolla, getAnagrafiche, getAnagraficheLocali} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const changeEditedBolla = bollaFA.changeEditedItem;
const submitEditedBolla = bollaFA.submitEditedItem;
const resetEditedBolla = bollaFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedBolla: getEditedBolla(state), 
	readOnlyForm: getReadOnlyFormBolla(state), 
	tipiBolla: getAnagrafiche(state).tipiBolla, 
	fornitori: (getAnagraficheLocali(state)) ? getAnagraficheLocali(state).fornitori : null
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedBolla, submitEditedBolla, resetEditedBolla }, dispatch);
}


const FormBolla = connect(mapStateToProps, mapDispatchToProps)(FormBollaComponent)

export default FormBolla;