import TableBolla from '../containers/TableBolla';
import FormRigaBolla from '../containers/FormRigaBolla';
import TotaliBolla from '../containers/TotaliBolla';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';

import React, {Component} from 'react'
import ReactDOM from 'react-dom';

import { Row, Col,  Modal} from 'antd'


var currentIdBolla = null;

class Bolla extends Component {

 componentDidMount() {
    	this.props.storeMeasure('formRigaBollaHeight', ReactDOM.findDOMNode(this.refs.formRigaBolla).clientHeight);
    	
 }
 
 componentWillMount() {

 if (this.props.match.params.id !== currentIdBolla)	
	{   //Faccio reset... tranne la prima volta...
		if (currentIdBolla) this.props.resetBolla(this.props.match.params.id);
		currentIdBolla = this.props.match.params.id; //E prendo il valore giusto...
	}
 }

resetEditedCatalogItem = () => {
	this.props.resetEditedCatalogItem('BOLLA');
} 

submitEditedCatalogItem = (e) => {
	e.preventDefault();
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, 'BOLLA'); //Per sapere cosa fare... dopo
  }
 
render()
{
  return (
 	
  <div>
  
  
    <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='BOLLA'/>
    </Modal>  
    <Row style={{'backgroundColor': 'white'}}>
      <Col span={4}>
      </Col>
      <Col span={16}>
    	 <FormRigaBolla idBolla={this.props.match.params.id} ref='formRigaBolla'/>
      </Col>
      <Col span={4}>
    	 <TotaliBolla idBolla={this.props.match.params.id}/>
      </Col>
    </Row>
    
     <Row>
      
         <TableBolla idBolla={this.props.match.params.id}/>
      
    </Row>
   
  </div>
 
 
)
}

}
export default Bolla;
