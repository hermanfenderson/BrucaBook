import TableBollaComponent from '../components/TableBolla'
import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, setSelectedRigaBolla} from '../../../actions/bolla'
import {getTotaliBolla, getRigheBolla} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'



const mapStateToProps = (state) => {
	return ({data: getRigheBolla(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenRigaBolla, offListenRigaBolla, deleteRigaBolla, setSelectedRigaBolla }, dispatch);
}


const TableBolla = connect(mapStateToProps, mapDispatchToProps)(TableBollaComponent)


export default TableBolla;