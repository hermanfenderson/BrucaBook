import ElencoCasseComponent from '../components/ElencoCasse'
import {elencoCasseFA, setPeriodElencoCasse} from '../../../actions/elencoCasse'
import {storeMeasure, setHeaderInfo} from  '../../../actions'
import {getPeriodElencoCasse, getListeningItemElencoCasse, getGeometry} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedCassa = elencoCasseFA.setSelectedItem;
const resetElencoCasse = elencoCasseFA.reset;
const toggleTableScroll = elencoCasseFA.toggleTableScroll;


const mapStateToProps = (state) => {
	return ({period: getPeriodElencoCasse(state),
	        listeningPeriod: getListeningItemElencoCasse(state), 
	        geometry: getGeometry(state, 'ELENCOCASSE')
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleTableScroll, resetElencoCasse, setSelectedCassa, storeMeasure, setHeaderInfo, setPeriodElencoCasse}, dispatch);
}

const ElencoCasse = connect(mapStateToProps, mapDispatchToProps)(ElencoCasseComponent)


export default ElencoCasse