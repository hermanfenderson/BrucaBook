import TableOrdiniApertiComponent from '../components/TableOrdiniAperti'

import {getEanArray, getAnagraficheLocali, getAnagrafiche, getGeometry, getOrdiniApertiErrors, getOrdiniApertiQty } from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'
import { changeDeltaPezzi} from '../../../actions/ordiniAperti'

const mapStateToProps = (state) => {
	return ({data: getEanArray(state), 
	statoRigaOrdine: getAnagrafiche(state).StatiRigheOrdine,
    clienti: getAnagraficheLocali(state).clienti, 
    geometry: getGeometry(state,'ORDINIAPERTI'),
    errors: getOrdiniApertiErrors(state),
    qty: getOrdiniApertiQty(state),
    
		 }
	
	)
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({changeDeltaPezzi }, dispatch);
}


const TableOrdiniAperti = connect(mapStateToProps, mapDispatchToProps)(TableOrdiniApertiComponent)


export default TableOrdiniAperti;