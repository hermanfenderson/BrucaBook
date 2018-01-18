import FornitoriComponent from '../components/Fornitori'
import {fornitoriFA} from '../../../actions/fornitori'
import {storeMeasure, setHeaderInfo} from  '../../../actions'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const setSelectedFornitore = fornitoriFA.setSelectedItem;
const resetFornitori = fornitoriFA.reset;

const mapStateToProps = (state) => {
	return ({
	        })
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetFornitori, setSelectedFornitore, storeMeasure, setHeaderInfo}, dispatch);
}

const Fornitori = connect(mapStateToProps, mapDispatchToProps)(FornitoriComponent)


export default Fornitori;