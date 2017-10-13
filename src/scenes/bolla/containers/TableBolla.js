import TableBollaComponent from '../components/TableBolla'
import {listenRigaBolla, offListenRigaBolla} from '../../../actions/bolle'
import {getTotaliBolla, getRigheBolla} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'



const mapStateToProps = (state) => {
	return ({data: getRigheBolla(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenRigaBolla, offListenRigaBolla }, dispatch);
}


const TableBolla = connect(mapStateToProps, mapDispatchToProps)(TableBollaComponent)


export default TableBolla;