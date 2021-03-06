import TableElencoOrdini from '../containers/TableElencoOrdini';
import FormOrdine from '../containers/FormOrdine';
import React, {Component} from 'react'
import ReactDOM from 'react-dom';



import { Row, Col, Spin} from 'antd'


class ElencoOrdini extends Component {
componentDidMount() {
	  	if (ReactDOM.findDOMNode(this.refs.formOrdine)) this.props.storeMeasure('formOrdineHeight', ReactDOM.findDOMNode(this.refs.formOrdine).clientHeight);
    	let cliente =  this.props.clienti[this.props.match.params.cliente];
    	if (cliente !== null) 
    		{
    			this.props.setHeaderInfo('Ordini cliente - '+ cliente.nome + ' ' + cliente.cognome );
    		}	
 }
 



render()
{


return (
<Spin spinning={this.props.clienti[this.props.match.params.cliente]===null} >		
	
 <div>	
  <Row>
  
      <Col style={{'marginTop': '30px'}} span={4}>
        </Col>
       <Col span={20}>
      <TableElencoOrdini geometry={this.props.geometry}/>
   
   	 	 </Col>
    </Row>
  <Row className='bottom-form' style={{height: '150px'}} ref='formOrdine'>
       <Col span={4} />
     
      <Col span={20}>
     
     <FormOrdine geometry={this.props.geometry} />
     </Col>
          </Row>
   
  </div>
</Spin> 
 
)
}
}

export default ElencoOrdini;
