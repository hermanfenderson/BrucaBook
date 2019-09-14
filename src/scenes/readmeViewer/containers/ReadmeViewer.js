import ReadmeViewerComponent from '../components/ReadmeViewer'
import {loadReadme} from '../../../actions/readmeViewer'
import {setHeaderInfo} from '../../../actions'
import {getReadme, getMeasures} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'



const mapStateToProps = (state) => { 
	return ({readme: getReadme(state),  measures: getMeasures(state),})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadReadme, setHeaderInfo}, dispatch);
}


const ReadmeViewer = connect(mapStateToProps, mapDispatchToProps)(ReadmeViewerComponent)

export default ReadmeViewer;