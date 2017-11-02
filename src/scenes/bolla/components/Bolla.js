import TableBolla from '../containers/TableBolla';
import FormRigaBolla from '../containers/FormRigaBolla';
import TotaliBolla from '../containers/TotaliBolla';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import React, {Component} from 'react'
import { Row, Col,  Modal} from 'antd'




class Bolla extends Component {

 
 componentWillUnmount() {
 	this.props.resetBolla(this.props.match.params.id);
 }
 
render()
{
  return (
 	
  <div>
  
  
    <Modal visible={this.props.showCatalogModal}>
		<FormCatalogo readOnlyEAN={true} scene='BOLLA'/>
    </Modal>  
    <Row>
      <Col span={4}>
      </Col>
      <Col span={16}>
    	 <FormRigaBolla idBolla={this.props.match.params.id}/>
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
