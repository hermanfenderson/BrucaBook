import DettagliArticoloComponent from '../components/DettagliArticolo'
import {setHeaderInfo} from  '../../../actions'
import {listenEAN, offListenEAN} from '../../../actions/dettagliArticolo';
import {getDettagliEAN, getListeningEAN} from  '../../../reducers'


import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'





function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setHeaderInfo, listenEAN, offListenEAN }, dispatch);
}

const mapStateToProps = (state) => {
	return ({
	         dettagliEAN: getDettagliEAN(state),
	         listeningEAN: getListeningEAN(state)
		
	})
}

const DettagliArticolo = connect(mapStateToProps, mapDispatchToProps)(DettagliArticoloComponent)


export default DettagliArticolo