import TableElencoBolle from '../containers/TableElencoBolle';
import FormBolla from '../containers/FormBolla';
import React, {Component} from 'react'
import {period2moment, period2month, isEqual} from '../../../helpers/form'
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';



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
if (!isEqual(this.props.period,[this.props.match.params.anno, this.props.match.params.mese])) 
	{
		
    const url = '/acquisti/'+period2month(this.props.period);	
  return(<Redirect to={url} />)
   }
else  return (
 <div>	
  <Row>
      <Col style={{'marginTop': '100px'}} span={4}>
       <Form.Item
            label="Periodo"
          >
       <MonthPicker value={period2moment([this.props.match.params.anno, this.props.match.params.mese])} onChange={this.props.setPeriodElencoBolle} format={"MM/YYYY"} />
       </Form.Item>
      </Col>
       <Col span={20}>
    
   	 <FormBolla ref='formBolla' period={this.props.period}/>
   	 </Col>
    </Row>
     <Row>
         <TableElencoBolle listeningPeriod={this.props.listeningPeriod} period={this.props.period} />
      </Row>
   
  </div>
 
 
)
}

}
export default ElencoBolle;
