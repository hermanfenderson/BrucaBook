import CategorieComponent from '../components/Categorie'
import {categorieFA} from '../../../actions/categorie'
import {storeMeasure, setHeaderInfo} from  '../../../actions'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedCategoria = categorieFA.setSelectedItem;
const resetCategorie = categorieFA.reset;

const mapStateToProps = (state) => {
	return ({
	        })
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetCategorie, setSelectedCategoria, storeMeasure, setHeaderInfo}, dispatch);
}

const Categorie = connect(mapStateToProps, mapDispatchToProps)(CategorieComponent)


export default Categorie;