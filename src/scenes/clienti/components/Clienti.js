import TableClienti from '../containers/TableClienti';
import FormCliente from '../containers/FormCliente';
import FilterCliente from '../components/FilterCliente';

import React, {Component} from 'react'
import ReactDOM from 'react-dom';


import { Row, Col} from 'antd'


class Clienti extends Component {
componentDidMount() {
    	if (ReactDOM.findDOMNode(this.refs.formCliente)) this.props.storeMeasure('formClienteHeight', ReactDOM.findDOMNode(this.refs.formCliente).clientHeight);
    	this.props.setHeaderInfo('Anagrafica - Clienti');
    	
 }
 
  	
//Rimosso il reset da qui... non mi serve mai resettare visto che non ho casi ambigui...devo solo resettare la riga selezionata
 



render()
{


return (
 <div>	
  <Row>
  
      <Col style={{'marginTop': '30px'}} span={4}>
      </Col>
      <Col span={20}>
          <Row>
      <FilterCliente geometry={this.props.geometry} filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} />
      </Row>
     <Row>
     
      <TableClienti geometry={this.props.geometry} filters={this.props.filters}/>
      </Row>
   	 	 </Col>
    </Row>
    <Row type="flex" align="bottom" className='bottom-form' ref='formCliente' style={{height: '150px'}}>
    <Col span={4} />
     
      <Col span={20}>
     
     <FormCliente  geometry={this.props.geometry} />
     </Col>
          </Row>
   
  </div>
 
 
)

}
}

export default Clienti;
