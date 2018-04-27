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
    	this.props.setHeaderInfo('Cassa');
    	if (!this.props.period) this.props.setPeriodElencoCasse(period2moment([this.props.match.params.anno, this.props.match.params.mese]));	
		 else if (this.props.period && !isEqual(this.props.period,[this.props.match.params.anno, this.props.match.params.mese]))  this.props.setPeriodElencoCasse(period2moment(this.props.period));
		this.props.toggleTableScroll(true); //Vado a fine tabella

 }
 
  	




render()
{
if (this.props.period && !isEqual(this.props.period,[this.props.match.params.anno, this.props.match.params.mese])) 
	{
		
   // const url = this.props.period ? '/vendite/'+period2month(this.props.period) : '/vendite/'+period2month([this.props.match.params.anno, this.props.match.params.mese]);	
      const url = '/vendite/'+period2month(this.props.period);
      
     return(<Redirect to={url} />)
   }
else  
{
//	
return (
 <div>	
  <Row>
      <Col style={{'marginTop': '30px'}} span={4}>
       <Form.Item
            label="Periodo"
          >
       <MonthPicker allowClear={false} value={period2moment([this.props.match.params.anno, this.props.match.params.mese])} onChange={this.props.setPeriodElencoCasse} format={"MM/YYYY"} />
       </Form.Item>
      </Col>
       <Col span={20}>
    
   <TableElencoCasse listeningPeriod={this.props.listeningPeriod} period={this.props.period} />
  	 </Col>
    </Row>
    <Row type="flex" align="bottom" className='bottom-form'  ref='formCassa' style={{height: '100px'}} >
   
     <Col span={4} />
         <Col span={20}>
    
   	 <FormCassa period={this.props.period}/>
   	 </Col>
 
             </Row>
   
  </div>
 
 
)
}
}
}

export default ElencoCasse;
