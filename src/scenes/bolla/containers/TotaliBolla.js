import TotaliBollaComponent from '../components/TotaliBolla'
import {listenTotaliChanged, offListenTotaliChanged} from '../../../actions/bolla'
import {getTotaliBolla} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'



const mapStateToProps = (state) => {
	return ({totali: getTotaliBolla(state)})
} 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenTotaliChanged, offListenTotaliChanged }, dispatch);
}

const TotaliBolla = connect(mapStateToProps, mapDispatchToProps)(TotaliBollaComponent)


export default TotaliBolla