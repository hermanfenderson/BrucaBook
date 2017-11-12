import ElencoBolleComponent from '../components/ElencoBolle'
import {bollaFA, setPeriodElencoBolle} from '../../../actions/elencoBolle'
import {storeMeasure, setHeaderInfo} from  '../../../actions'
import {getPeriod, getListeningItem} from '../../../reducers'
import {resetElencoBolle} from '../../../actions/elencoBolle'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedBolla = bollaFA.setSelectedItem;


const mapStateToProps = (state) => {
	return ({period: getPeriod(state),
	        listeningPeriod: getListeningItem(state)
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetElencoBolle, setSelectedBolla, storeMeasure, setHeaderInfo, setPeriodElencoBolle}, dispatch);
}

const ElencoBolle = connect(mapStateToProps, mapDispatchToProps)(ElencoBolleComponent)


export default ElencoBolle