import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {storeMeasure} from '../actions';
import * as Actions from '../actions/catalog';
import {Col} from 'react-bootstrap';

import FormItemCatalog from './FormItemCatalog';
import * as ActionsCatalog from '../actions/catalog';

class GestioneItemCatalog extends React.Component {
  
	
	
  
 
 render() {
	 	
	 
    return (
		 <div className="container">
       <Col sm={3}>
				<img src={this.props.imgUrl}/>
 			</Col>
		  <Col sm={9}>	
      <FormItemCatalog onSubmitAction={this.props.actionsCatalog.updateCatalogItem}/>
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
     actionsCatalog:  bindActionCreators(ActionsCatalog, dispatch)
	
		  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GestioneItemCatalog);