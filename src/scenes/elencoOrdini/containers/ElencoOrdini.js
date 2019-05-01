import ElencoOrdiniComponent from '../components/ElencoOrdini'
import {ordineFA} from '../../../actions/elencoOrdini'
import {storeMeasure, setHeaderInfo} from  '../../../actions'
import {getAnagraficheLocali, getListeningItem, getGeometry} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedOrdine = ordineFA.setSelectedItem;
const resetElencoOrdini = ordineFA.reset;

const mapStateToProps = (state) => {
	return ({clienti: getAnagraficheLocali(state).clienti,
	        geometry: getGeometry(state, 'ELENCOORDINI')
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetElencoOrdini, setSelectedOrdine, storeMeasure, setHeaderInfo}, dispatch);
}

const ElencoOrdini = connect(mapStateToProps, mapDispatchToProps)(ElencoOrdiniComponent)


export default ElencoOrdini