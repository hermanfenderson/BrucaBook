import MagazzinoComponent from '../components/Magazzino'
import {setHeaderInfo} from  '../../../actions'
import {magazzinoFA, saveMagazzino} from '../../../actions/magazzino'
import {getFiltersMagazzino, getGeometry} from  '../../../reducers'


import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setFilter = magazzinoFA.setFilter;
const resetFilter = magazzinoFA.resetFilter;




function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setHeaderInfo, setFilter, resetFilter, saveMagazzino}, dispatch);
}

const mapStateToProps = (state) => {
	return ({
	         filters: getFiltersMagazzino(state),
	         formSearchCols: getGeometry(state,'MAGAZZINO').formSearchCols,
	         formSearchFixedCols: getGeometry(state,'MAGAZZINO').formSearchFixedCols,
		     header: getGeometry(state,'MAGAZZINO').header,
		     fixedHeader: getGeometry(state,'MAGAZZINO').fixedHeader,
		     width: getGeometry(state,'MAGAZZINO').tableWidth
		     
	})
}

const Magazzino = connect(mapStateToProps, mapDispatchToProps)(MagazzinoComponent)


export default Magazzino