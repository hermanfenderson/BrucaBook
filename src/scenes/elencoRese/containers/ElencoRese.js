import ElencoReseComponent from '../components/ElencoRese'
import {resaFA, setPeriodElencoRese} from '../../../actions/elencoRese'
import {storeMeasure, setHeaderInfo} from  '../../../actions'
import {getPeriodElencoRese, getListeningItemElencoRese, getGeometry} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedResa = resaFA.setSelectedItem;
const resetElencoRese = resaFA.reset;

const mapStateToProps = (state) => {
	return ({period: getPeriodElencoRese(state),
	        listeningPeriod: getListeningItemElencoRese(state),
	        geometry: getGeometry(state, 'ELENCORESE')
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetElencoRese, setSelectedResa, storeMeasure, setHeaderInfo, setPeriodElencoRese}, dispatch);
}

const ElencoRese = connect(mapStateToProps, mapDispatchToProps)(ElencoReseComponent)


export default ElencoRese