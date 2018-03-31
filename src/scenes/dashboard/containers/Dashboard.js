import DashboardComponent from '../components/Dashboard'
import {setHeaderInfo, storeMeasure} from  '../../../actions'
import {getRegistroData as getRegistroDataAction} from '../../../actions/dashboard'
import {getSerieIncassi, getSerieIncassiMesi, getSerieIncassiAnni, getTop5thisYear, getTop5lastYear, getTop5lastMonth, isListeningRegistroData, getMeasures} from '../../../reducers'
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
		top5thisYear: getTop5thisYear(state),
		top5lastYear: getTop5lastYear(state),
		top5lastMonth: getTop5lastMonth(state),
		
	    measures: getMeasures(state),
		listeningRegistroData: isListeningRegistroData(state)
	})
}

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent)


export default Dashboard