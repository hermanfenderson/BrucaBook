import ElencoBolleComponent from '../components/ElencoBolle'
import {bollaFA} from '../../../actions/elencoBolle'

import {resetElencoBolle} from '../../../actions/elencoBolle'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedBolla = bollaFA.setSelectedItem;



function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetElencoBolle, setSelectedBolla}, dispatch);
}

const ElencoBolle = connect(null, mapDispatchToProps)(ElencoBolleComponent)


export default ElencoBolle