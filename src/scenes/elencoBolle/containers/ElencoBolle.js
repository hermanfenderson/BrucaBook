import ElencoBolleComponent from '../components/ElencoBolle'
import {resetElencoBolle} from '../../../actions/elencoBolle'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'




function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetElencoBolle}, dispatch);
}

const ElencoBolle = connect(null, mapDispatchToProps)(ElencoBolleComponent)


export default ElencoBolle