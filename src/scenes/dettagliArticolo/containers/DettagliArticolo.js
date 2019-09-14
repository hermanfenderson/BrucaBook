import DettagliArticoloComponent from '../components/DettagliArticolo'
import {setHeaderInfo} from  '../../../actions'
import {listenEAN, offListenEAN, setPeriod} from '../../../actions/dettagliArticolo';
import {getDettagliEAN, getHeaderEAN, getListeningEAN, getPeriodDetails, getMeasures} from  '../../../reducers'
import {getDetailsInMatrix} from '../../../helpers/form'

import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'





function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setHeaderInfo, listenEAN, offListenEAN, setPeriod }, dispatch);
}

const mapStateToProps = (state) => {
	return ({
	         dettagliEAN: getDettagliEAN(state),
	         headerEAN: getHeaderEAN(state),
	         listeningEAN: getListeningEAN(state),
	         matrixEAN: getDetailsInMatrix(getDettagliEAN(state)),
			 period: getPeriodDetails(state), 
			 measures: getMeasures(state),
	})
}

const DettagliArticolo = connect(mapStateToProps, mapDispatchToProps)(DettagliArticoloComponent)


export default DettagliArticolo