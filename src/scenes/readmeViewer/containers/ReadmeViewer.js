import ReadmeViewerComponent from '../components/ReadmeViewer'
import {loadReadme, setShowModal} from '../../../actions/readmeViewer'
import {setHeaderInfo, setMenuSelectedKeys} from '../../../actions'
import {getReadme, getReadmeHeight, getShowModal} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'



const mapStateToProps = (state) => { 
	return ({readme: getReadme(state), readmeHeight: getReadmeHeight(state), showModal: getShowModal(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadReadme, setHeaderInfo, setShowModal, setMenuSelectedKeys}, dispatch);
}


const ReadmeViewer = connect(mapStateToProps, mapDispatchToProps)(ReadmeViewerComponent)

export default ReadmeViewer;