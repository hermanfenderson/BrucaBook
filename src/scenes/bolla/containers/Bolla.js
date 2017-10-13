import BollaComponent from '../components/Bolla'
import {resetBolla} from '../../../actions/bolle'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetBolla }, dispatch);
}

const Bolla = connect(null, mapDispatchToProps)(BollaComponent)


export default Bolla