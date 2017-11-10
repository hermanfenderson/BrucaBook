import BollaComponent from '../components/Bolla'
import {resetBolla, listenTestataBolla, unlistenTestataBolla} from '../../../actions/bolla'
import {submitEditedCatalogItem, resetEditedCatalogItem} from '../../../actions/catalogo'
import {storeMeasure, setHeaderInfo} from '../../../actions'

import {getShowCatalogModal, getEditedCatalogItem, getTestataBolla} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const mapStateToProps = (state) => {
	return ({showCatalogModal: getShowCatalogModal(state), 
	         editedCatalogItem: getEditedCatalogItem(state),
	         testataBolla: getTestataBolla(state)})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetBolla, submitEditedCatalogItem, resetEditedCatalogItem, 
  listenTestataBolla, unlistenTestataBolla, storeMeasure, setHeaderInfo}, dispatch);
}

const Bolla = connect(mapStateToProps, mapDispatchToProps)(BollaComponent)


export default Bolla