import TableElencoRese from '../containers/TableElencoRese';
import FormResa from '../containers/FormResa';
import React, {Component} from 'react'
import {period2moment, period2month, isEqual} from '../../../helpers/form'
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';



import { Row, Col, DatePicker, Form} from 'antd'
const {MonthPicker} = DatePicker;


class ElencoRese extends Component {
componentDidMount() {
    	if (ReactDOM.findDOMNode(this.refs.formResa)) this.props.storeMeasure('formResaHeight', ReactDOM.findDOMNode(this.refs.formResa).clientHeight);
    	this.props.setHeaderInfo('Rese');
    	
 }
 
  	
//Rimosso il reset da qui... non mi serve mai resettare visto che non ho casi ambigui...devo solo resettare la riga selezionata
 componentWillMount() {
 if (!this.props.period) this.props.setPeriodElencoRese(period2moment([this.props.match.params.anno, this.props.match.params.mese]));	
 else if (this.props.period && !isEqual(this.props.period,[this.props.match.params.anno, this.props.match.params.mese]))  this.props.setPeriodElencoRese(period2moment(this.props.period));
 

}



render()
{
if (this.props.period && !isEqual(this.props.period,[this.props.match.params.anno, this.props.match.params.mese])) 
	{
		
   // const url = this.props.period ? '/acquisti/'+period2month(this.props.period) : '/acquisti/'+period2month([this.props.match.params.anno, this.props.match.params.mese]);	
      const url = '/rese/'+period2month(this.props.period);
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
       <MonthPicker allowClear={false} value={period2moment([this.props.match.params.anno, this.props.match.params.mese])} onChange={this.props.setPeriodElencoRese} format={"MM/YYYY"} />
       </Form.Item>
      </Col>
       <Col span={20}>
      <TableElencoRese listeningPeriod={this.props.listeningPeriod} period={this.props.period} />
   
   	 	 </Col>
    </Row>
  <Row className='bottom-form' style={{height: '200px'}} ref='formResa'>
       <Col span={4} />
     
      <Col span={20}>
     
     <FormResa period={this.props.period}/>
     </Col>
          </Row>
   
  </div>
 
 
)
}
}
}

export default ElencoRese;
