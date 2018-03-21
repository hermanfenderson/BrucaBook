import DashboardComponent from '../components/Dashboard'
import {setHeaderInfo} from  '../../../actions'
import {getRegistroData as getRegistroDataAction} from '../../../actions/dashboard'
import {getRegistroData, getSerieIncassi, isListeningRegistroData} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'





function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setHeaderInfo, getRegistroDataAction}, dispatch);
}

const mapStateToProps = (state) => {
	return ({
		registroData: getRegistroData(state),
		serieIncassi: getSerieIncassi(state),
		listeningRegistroData: isListeningRegistroData(state)
	})
}

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent)


export default Dashboard