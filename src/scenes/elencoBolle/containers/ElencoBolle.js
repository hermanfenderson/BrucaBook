import ElencoBolleComponent from '../components/ElencoBolle'
import {bollaFA, setPeriodElencoBolle} from '../../../actions/elencoBolle'
import {setHeaderInfo} from  '../../../actions'
import {getPeriod, getListeningItem, getGeometry} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedBolla = bollaFA.setSelectedItem;
const resetElencoBolle = bollaFA.reset;

const mapStateToProps = (state) => {
	return ({period: getPeriod(state),
	        listeningPeriod: getListeningItem(state),
	        geometry: getGeometry(state, 'ELENCOBOLLE')
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetElencoBolle, setSelectedBolla, setHeaderInfo, setPeriodElencoBolle}, dispatch);
}

const ElencoBolle = connect(mapStateToProps, mapDispatchToProps)(ElencoBolleComponent)


export default ElencoBolle