import TableElencoCasse from '../containers/TableElencoCasse';
import FormCassa from '../containers/FormCassa';
import React, {Component} from 'react'
import {period2moment, period2month, isEqual} from '../../../helpers/form'
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';
import FixBlock from '../../../components/FixBlock'



import {DatePicker, Form} from 'antd'
const {MonthPicker} = DatePicker;


class ElencoCasse extends Component {
componentDidMount() {
    	//if (ReactDOM.findDOMNode(this.refs.formCassa)) this.props.storeMeasure('formCassaHeight', ReactDOM.findDOMNode(this.refs.formCassa).clientHeight);
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
 
      <FixBlock className='periodPicker' coors={this.props.geometry.periodCoors}>
       <Form.Item
            label="Periodo"
          >
       <MonthPicker allowClear={false} value={period2moment([this.props.match.params.anno, this.props.match.params.mese])} onChange={this.props.setPeriodElencoCasse} format={"MM/YYYY"} />
       </Form.Item>
      </FixBlock>
     <FixBlock coors={this.props.geometry.tableCoors}>
       
       <TableElencoCasse geometry={this.props.geometry} listeningPeriod={this.props.listeningPeriod} period={this.props.period} />
   
   	 	 </FixBlock>
   <FixBlock coors={this.props.geometry.formCoors} className='bottom-form2' >
       
     <FormCassa geometry={this.props.geometry} />
           </FixBlock>
   
  </div>
 
 
 
 

 
)
}
}
}

export default ElencoCasse;
