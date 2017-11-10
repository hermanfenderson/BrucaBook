import ElencoBolleComponent from '../components/ElencoBolle'
import {bollaFA} from '../../../actions/elencoBolle'
import {storeMeasure, setHeaderInfo} from  '../../../actions'
import {resetElencoBolle} from '../../../actions/elencoBolle'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedBolla = bollaFA.setSelectedItem;



function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetElencoBolle, setSelectedBolla, storeMeasure, setHeaderInfo}, dispatch);
}

const ElencoBolle = connect(null, mapDispatchToProps)(ElencoBolleComponent)


export default ElencoBolle