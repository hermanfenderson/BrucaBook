import TableOrdiniApertiComponent from '../components/TableOrdiniAperti'

import {getEanArray, getAnagraficheLocali, getAnagrafiche, getGeometry} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const mapStateToProps = (state) => {
	return ({data: getEanArray(state), 
	statoRigaOrdine: getAnagrafiche(state).StatiRigheOrdine,
    clienti: getAnagraficheLocali(state).clienti, 
    geometry: getGeometry(state,'ORDINIAPERTI'),
		 }
	
	)
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ }, dispatch);
}


const TableOrdiniAperti = connect(mapStateToProps, mapDispatchToProps)(TableOrdiniApertiComponent)


export default TableOrdiniAperti;