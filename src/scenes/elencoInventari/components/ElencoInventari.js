import TableElencoInventari from '../containers/TableElencoInventari';
import FormInventario from '../containers/FormInventario';
import React, {Component} from 'react'
import ReactDOM from 'react-dom';


import { Row, Col} from 'antd'


class ElencoInventari extends Component {
componentDidMount() {
    	if (ReactDOM.findDOMNode(this.refs.formInventario)) this.props.storeMeasure('formInventarioHeight', ReactDOM.findDOMNode(this.refs.formInventario).clientHeight);
    	this.props.setHeaderInfo('Inventario');
    	
 }
 
  	
//Rimosso il reset da qui... non mi serve mai resettare visto che non ho casi ambigui...devo solo resettare la riga selezionata
 



render()
{

////Era...       <Col style={{'marginTop': '100px'}} span={4}>
	
return (
 <div>	
  <Row>
  
      <Col style={{'marginTop': '30px'}} span={4}>
      </Col>
      <Col span={20}>
      <TableElencoInventari/>
   
   	 	 </Col>
    </Row>
    <Row type="flex" align="bottom" className='bottom-form' ref='formInventario' style={{height: '100px'}}>
    <Col span={4} />
     
      <Col span={20}>
     
     <FormInventario  />
     </Col>
          </Row>
   
  </div>
 
 
)

}
}

export default ElencoInventari;
