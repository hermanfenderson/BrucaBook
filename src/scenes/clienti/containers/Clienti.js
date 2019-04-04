import ClientiComponent from '../components/Clienti'
import {clientiFA} from '../../../actions/clienti'
import {storeMeasure, setHeaderInfo} from  '../../../actions'
import  {getGeometry, getFiltersClienti} from '../../../reducers'

import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedCliente = clientiFA.setSelectedItem;
const setFilter = clientiFA.setFilter;
const resetFilter = clientiFA.resetFilter;

const resetClienti = clientiFA.reset;

const mapStateToProps = (state) => {
	return ({  geometry: getGeometry(state,'CLIENTI'),
	           filters: getFiltersClienti(state),
		  
	        })
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetClienti, setSelectedCliente, storeMeasure, setHeaderInfo, setFilter, resetFilter}, dispatch);
}

const Clienti = connect(mapStateToProps, mapDispatchToProps)(ClientiComponent)


export default Clienti;