import FormScontoScontrinoComponent from '../components/FormScontoScontrino'
import {cassaFA} from '../../../actions/cassa'
import {getEditedRigaCassa, getRigheCassa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const changeEditedCassa = cassaFA.changeEditedItem;
const submitEditedCassa = cassaFA.submitEditedItem;
const focusSet = cassaFA.focusSet;
//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...

//Passo tutti i dati per passare la key dello scontrino se già esiste e swappare...
const mapStateToProps = (state) => { 
	return ({editedCassa: getEditedRigaCassa(state), data: getRigheCassa(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedCassa, submitEditedCassa, focusSet }, dispatch);
}


const FormTestataScontrino = connect(mapStateToProps, mapDispatchToProps)(FormScontoScontrinoComponent)

export default FormScontoScontrino;