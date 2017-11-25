import TableElencoCasse from '../containers/TableElencoCasse';
import FormCassa from '../containers/FormCassa';
import React, {Component} from 'react'
import {period2moment, period2month, isEqual} from '../../../helpers/form'
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';



import { Row, Col, DatePicker, Form} from 'antd'
const {MonthPicker} = DatePicker;


class ElencoCasse extends Component {
componentDidMount() {
    	if (ReactDOM.findDOMNode(this.refs.formCassa)) this.props.storeMeasure('formCassaHeight', ReactDOM.findDOMNode(this.refs.formCassa).clientHeight);
    	this.props.setHeaderInfo('Vendite');
    	
 }
 
  	
//Rimosso il reset da qui... non mi serve mai resettare visto che non ho casi ambigui...devo solo resettare la riga selezionata
 componentWillMount() {
 	
 if (this.props.period && !isEqual(this.props.period,[this.props.match.params.anno, this.props.match.params.mese]))  this.props.setPeriodElencoCasse(period2moment(this.props.period));
	
 // this.props.setSelectedBolla(null);
}



render()
{
if (this.props.period && !isEqual(this.props.period,[this.props.match.params.anno, this.props.match.params.mese])) 
	{
		
    const url = this.props.period ? '/vendite/'+period2month(this.props.period) : '/vendite/'+period2month([this.props.match.params.anno, this.props.match.params.mese]);	
     return(<Redirect to={url} />)
   }
else  
{
if (!isEqual(this.props.period,[this.props.match.params.anno, this.props.match.params.mese]))  this.props.setPeriodElencoCasse(period2moment([this.props.match.params.anno, this.props.match.params.mese]));
	
return (
 <div>	
  <Row>
      <Col style={{'marginTop': '100px'}} span={4}>
       <Form.Item
            label="Periodo"
          >
       <MonthPicker value={period2moment([this.props.match.params.anno, this.props.match.params.mese])} onChange={this.props.setPeriodElencoCasse} format={"MM/YYYY"} />
       </Form.Item>
      </Col>
       <Col span={20}>
    
   	 <FormCassa ref='formCassa' period={this.props.period}/>
   	 </Col>
    </Row>
     <Row>
         <TableElencoCasse listeningPeriod={this.props.listeningPeriod} period={this.props.period} />
      </Row>
   
  </div>
 
 
)
}
}
}

export default ElencoCasse;
