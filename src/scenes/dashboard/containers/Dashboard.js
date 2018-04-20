import DashboardComponent from '../components/Dashboard'
import {setHeaderInfo, storeMeasure} from  '../../../actions'
import {getReportData as getReportDataAction , resetListening } from '../../../actions/dashboard'
import {getSerieIncassi, getSerieIncassiMesi, getSerieIncassiAnni, getTop5thisYear, getTop5lastYear, getTop5lastMonth, isListeningReportData, getMeasures} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

import {magazzinoFA} from '../../../actions/magazzino'

import {getListeningMagazzino} from '../../../reducers'
//Ascolto qui magazzino... mi servirà in giro...

const listenMagazzino = magazzinoFA.listenItem;


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setHeaderInfo, getReportDataAction, storeMeasure, resetListening, listenMagazzino}, dispatch);
}

const mapStateToProps = (state) => {
	return ({
		serieIncassi: getSerieIncassi(state),
		serieIncassiMesi: getSerieIncassiMesi(state),
		serieIncassiAnni: getSerieIncassiAnni(state),
		top5thisYear: getTop5thisYear(state),
		top5lastYear: getTop5lastYear(state),
		top5lastMonth: getTop5lastMonth(state),
		
	    measures: getMeasures(state),
		listeningReportData: isListeningReportData(state),
		listeningMagazzino: getListeningMagazzino(state)
	})
}

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent)


export default Dashboard