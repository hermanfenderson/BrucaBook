import ModalDettagliComponent from '../components/ModalDettagli'
import {setPeriodResa, setActiveModal} from '../../../actions/resa'

import {getActiveModal, getPeriodResa} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const mapStateToProps = (state) => {
	return ({
	         activeModal: getActiveModal(state),
	         period: getPeriodResa(state),
	        
	})
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setPeriodResa, setActiveModal}, dispatch);
}

const ModalDettagli = connect(mapStateToProps, mapDispatchToProps)(ModalDettagliComponent)


export default ModalDettagli