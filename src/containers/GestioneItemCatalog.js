import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {storeMeasure} from '../actions';
import * as Actions from '../actions/catalog';
import {Col} from 'react-bootstrap';

import FormItemCatalog from './FormItemCatalog';

class GestioneItemCatalog extends React.Component {
  
	
	
  
 
 render() {
	 	
	 
    return (
		 <div className="container">
       <Col sm={3}>
				<img src="https://img.ibs.it/images/9788807032073_0_0_180_0.jpg"/>
 			</Col>
		  <Col sm={9}>	
      <FormItemCatalog/>
			</Col>
			
     </div>
     );
  }
}

//react-bs-container-body


function mapStateToProps(state) {
  return {
       
     };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
		  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GestioneItemCatalog);