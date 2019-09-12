import HelpComponent from '../components/Help'
import {forzaAggiornaMagazzino, pulisciCatalogo} from '../../../actions'

import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'


const mapStateToProps = (state) => {
	return ({
	
		
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ forzaAggiornaMagazzino, pulisciCatalogo}, dispatch);
}

const Help = connect(mapStateToProps, mapDispatchToProps)(HelpComponent)


export default Help