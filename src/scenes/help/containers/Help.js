import HelpComponent from '../components/Help'
import {forzaAggiornaMagazzino} from '../../../actions'

import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const mapStateToProps = (state) => {
	return ({
	
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ forzaAggiornaMagazzino}, dispatch);
}

const Help = connect(mapStateToProps, mapDispatchToProps)(HelpComponent)


export default Help