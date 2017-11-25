import TableMagazzinoComponent from '../components/TableMagazzino'
import {magazzinoFA} from '../../../actions/magazzino'

import {getMagazzino, getTableMagazzinoHeight, getListeningMagazzino} from '../../../reducers'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'

const listenMagazzino = magazzinoFA.listenItem;
const offListenMagazzino = magazzinoFA.offListenItem;


const mapStateToProps = (state) => {
	return ({data: getMagazzino(state),  height: getTableMagazzinoHeight(state), listening: getListeningMagazzino(state)})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ listenMagazzino, offListenMagazzino }, dispatch);
}


const TableMagazzino = connect(mapStateToProps, mapDispatchToProps)(TableMagazzinoComponent)


export default TableMagazzino;