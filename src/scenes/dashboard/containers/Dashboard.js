import DashboardComponent from '../components/Dashboard'
import {setHeaderInfo, storeMeasure} from  '../../../actions'
import {getRegistroData as getRegistroDataAction} from '../../../actions/dashboard'
import {getSerieIncassi, getSerieIncassiMesi, getSerieIncassiAnni, isListeningRegistroData, getMeasures} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'





function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setHeaderInfo, getRegistroDataAction, storeMeasure}, dispatch);
}

const mapStateToProps = (state) => {
	return ({
		serieIncassi: getSerieIncassi(state),
		serieIncassiMesi: getSerieIncassiMesi(state),
		serieIncassiAnni: getSerieIncassiAnni(state),
	    measures: getMeasures(state),
		listeningRegistroData: isListeningRegistroData(state)
	})
}

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent)


export default Dashboard