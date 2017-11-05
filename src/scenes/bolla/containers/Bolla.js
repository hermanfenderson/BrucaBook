import BollaComponent from '../components/Bolla'
import {resetBolla} from '../../../actions/bolla'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'

import {getShowCatalogModal, getEditedCatalogItem} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModal(state), editedCatalogItem: getEditedCatalogItem(state)})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetBolla, submitEditedCatalogItem, resetEditedCatalogItem}, dispatch);
}

const Bolla = connect(mapStateToProps, mapDispatchToProps)(BollaComponent)


export default Bolla