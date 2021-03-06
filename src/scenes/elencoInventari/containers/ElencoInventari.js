import ElencoInventariComponent from '../components/ElencoInventari'
import {inventarioFA} from '../../../actions/elencoInventari'
import {storeMeasure, setHeaderInfo} from  '../../../actions'
import {getGeometry} from '../../../reducers'

import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedInventario = inventarioFA.setSelectedItem;
const resetElencoInventari = inventarioFA.reset;

const mapStateToProps = (state) => {
	return ({
		geometry: getGeometry(state, 'ELENCOINVENTARI')
	        })
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetElencoInventari, setSelectedInventario, storeMeasure, setHeaderInfo}, dispatch);
}

const ElencoInventari = connect(mapStateToProps, mapDispatchToProps)(ElencoInventariComponent)


export default ElencoInventari