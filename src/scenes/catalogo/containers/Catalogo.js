import CatalogoComponent from '../components/Catalogo'
import {setHeaderInfo} from '../../../actions'
import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'



function mapDispatchToProps(dispatch) {
  return bindActionCreators({setHeaderInfo }, dispatch);
}


const Catalogo = connect(null, mapDispatchToProps)(CatalogoComponent)

export default Catalogo;