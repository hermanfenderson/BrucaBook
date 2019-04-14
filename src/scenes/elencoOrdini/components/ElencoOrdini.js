import TableElencoOrdini from '../containers/TableElencoOrdini';
import FormOrdine from '../containers/FormOrdine';
import React, {Component} from 'react'
import {isEqual} from '../../../helpers/form'
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';



import { Row, Col} from 'antd'


class ElencoOrdini extends Component {
componentDidMount() {
    	if (ReactDOM.findDOMNode(this.refs.formOrdine)) this.props.storeMeasure('formOrdineHeight', ReactDOM.findDOMNode(this.refs.formOrdine).clientHeight);
    	let cliente =  this.props.clienti[this.props.match.params.cliente];
    	if (cliente !== null) 
    		{
    			this.props.setHeaderInfo('Ordini cliente - '+ this.props.clienti[cliente].nome + ' ' + this.props.clienti[cliente].cognome );
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
