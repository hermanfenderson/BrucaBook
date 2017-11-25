import ElencoCasseComponent from '../components/ElencoCasse'
import {elencoCasseFA, setPeriodElencoCasse} from '../../../actions/elencoCasse'
import {storeMeasure, setHeaderInfo} from  '../../../actions'
import {getPeriodElencoCasse, getListeningItemElencoCasse} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedCassa = elencoCasseFA.setSelectedItem;
const resetElencoCasse = elencoCasseFA.reset;

const mapStateToProps = (state) => {
	return ({period: getPeriodElencoCasse(state),
	        listeningPeriod: getListeningItemElencoCasse(state)
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetElencoCasse, setSelectedCassa, storeMeasure, setHeaderInfo, setPeriodElencoCasse}, dispatch);
}

const ElencoCasse = connect(mapStateToProps, mapDispatchToProps)(ElencoCasseComponent)


export default ElencoCasse