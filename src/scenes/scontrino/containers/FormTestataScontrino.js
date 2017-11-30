import FormTestataScontrinoComponent from '../components/FormTestataScontrino'
import {cassaFA} from '../../../actions/cassa'
import {getEditedRigaCassa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

import {store} from '../../../index.js';

const changeEditedCassa = cassaFA.changeEditedItem;
const submitEditedCassa = cassaFA.submitEditedItem;
const focusSet = cassaFA.focusSet;
//Passa lo stato modificato come previsto ma intercetta un cambiamento di ean e scatena azioni...


const mapStateToProps = (state) => { 
	return ({editedCassa: getEditedRigaCassa(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedCassa, submitEditedCassa, focusSet }, dispatch);
}


const FormTestataScontrino = connect(mapStateToProps, mapDispatchToProps)(FormTestataScontrinoComponent)

export default FormTestataScontrino;