import FormCategoriaComponent from '../components/FormCategoria'
import {categorieFA} from '../../../actions/categorie'
import {getEditedCategoria} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const changeEditedCategoria = categorieFA.changeEditedItem;
const submitEditedCategoria = categorieFA.submitEditedItem;
const resetEditedCategoria = categorieFA.resetEditedItem;


const mapStateToProps = (state) => { 
	return ({editedCategoria: getEditedCategoria(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeEditedCategoria, submitEditedCategoria, resetEditedCategoria }, dispatch);
}


const FormCategoria = connect(mapStateToProps, mapDispatchToProps)(FormCategoriaComponent)

export default FormCategoria;