import MagazzinoComponent from '../components/Magazzino'
import {setHeaderInfo} from  '../../../actions'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'




function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setHeaderInfo}, dispatch);
}

const Magazzino = connect(null, mapDispatchToProps)(MagazzinoComponent)


export default Magazzino