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
    	if (ReactDOM.findDOMNode(this.refs.formBolla)) this.props.storeMeasure('formBollaHeight', ReactDOM.findDOMNode(this.refs.formBolla).clientHeight);
    	this.props.setHeaderInfo('Acquisti');
    	
 }
 
  	
//Rimosso il reset da qui... non mi serve mai resettare visto che non ho casi ambigui...devo solo resettare la riga selezionata
 componentWillMount() {
 if (!this.props.period) this.props.setPeriodElencoBolle(period2moment([this.props.match.params.anno, this.props.match.params.mese]));	
 else if (this.props.period && !isEqual(this.props.period,[this.props.match.params.anno, this.props.match.params.mese]))  this.props.setPeriodElencoBolle(period2moment(this.props.period));
 

}



render()
{
if (this.props.period && !isEqual(this.props.period,[this.props.match.params.anno, this.props.match.params.mese])) 
	{
		
   // const url = this.props.period ? '/acquisti/'+period2month(this.props.period) : '/acquisti/'+period2month([this.props.match.params.anno, this.props.match.params.mese]);	
      const url = '/acquisti/'+period2month(this.props.period);
     return(<Redirect to={url} />)
   }
else  
{

return (
 <div>	
  <Row>
  
      <Col style={{'marginTop': '30px'}} span={4}>
       <Form.Item
            label="Periodo"
          >
       <MonthPicker allowClear={false} value={period2moment([this.props.match.params.anno, this.props.match.params.mese])} onChange={this.props.setPeriodElencoBolle} format={"MM/YYYY"} />
       </Form.Item>
      </Col>
       <Col span={20}>
      <TableElencoBolle listeningPeriod={this.props.listeningPeriod} period={this.props.period} />
   
   	 	 </Col>
    </Row>
  <Row className='bottom-form' style={{height: '200px'}} ref='formBolla'>
       <Col span={4} />
     
      <Col span={20}>
     
     <FormBolla period={this.props.period}/>
     </Col>
          </Row>
   
  </div>
 
 
)
}
}
}

export default ElencoBolle;
