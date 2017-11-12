import TableElencoBolle from '../containers/TableElencoBolle';
import FormBolla from '../containers/FormBolla';
import React, {Component} from 'react'
import {moment2period} from '../../../helpers/form'
import ReactDOM from 'react-dom';

import { Row, Col, DatePicker, Form} from 'antd'
const {MonthPicker} = DatePicker;



class ElencoBolle extends Component {
componentDidMount() {
    	this.props.storeMeasure('formBollaHeight', ReactDOM.findDOMNode(this.refs.formBolla).clientHeight);
    	this.props.setHeaderInfo('Acquisti');
    	
 }
 
  	
//Rimosso il reset da qui... non mi serve mai resettare visto che non ho casi ambigui...devo solo resettare la riga selezionata
 componentWillMount() {
  this.props.setSelectedBolla(null);
}

render()
{
  return (
 <div>	
  <Row>
      <Col style={{'marginTop': '100px'}} span={4}>
       <Form.Item
            label="Periodo"
          >
       <MonthPicker value={this.props.period} onChange={this.props.setPeriodElencoBolle} format={"MM/YYYY"} />
       </Form.Item>
      </Col>
       <Col span={20}>
    
   	 <FormBolla ref='formBolla'/>
   	 </Col>
    </Row>
     <Row>
         <TableElencoBolle listeningPeriod={this.props.listeningPeriod} period={moment2period(this.props.period)} />
      </Row>
   
  </div>
 
 
)
}

}
export default ElencoBolle;
