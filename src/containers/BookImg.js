import BookImgComponent from '../components/BookImg'
//import {listenRigaBolla, offListenRigaBolla, deleteRigaBolla, rigaBollaFA} from '../../../actions/bolla'

import {getPath2Url, getEAN2Path} from '../reducers'
import {getPathFromEAN, getUrlFromPath} from '../actions'

import { connect} from 'react-redux'
import { bindActionCreators} from 'redux'



const mapStateToProps = (state) => {
	return ({
	path2url: getPath2Url(state), 
	ean2path: getEAN2Path(state),
		
	})
}
 

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getPathFromEAN, getUrlFromPath }, dispatch);
}


const BookImg = connect(mapStateToProps, mapDispatchToProps)(BookImgComponent)


export default BookImg;