import BollaComponent from '../components/Bolla'
import {resetBolla} from '../../../actions/bolle'
import {getShowCatalogModal} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const mapStateToProps = (state) => { 
	return ({showCatalogModal: getShowCatalogModal(state)})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetBolla}, dispatch);
}

const Bolla = connect(mapStateToProps, mapDispatchToProps)(BollaComponent)


export default Bolla