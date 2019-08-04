import TableElencoBolle from '../containers/TableElencoBolle';
import FormBolla from '../containers/FormBolla';
import React, {Component} from 'react'

import {period2moment, period2month, isEqual} from '../../../helpers/form'
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';

import FixBlock from '../../../components/FixBlock'

import { DatePicker, Form} from 'antd'
const {MonthPicker} = DatePicker;


class ElencoBolle extends Component {
componentDidMount() {
    	if (ReactDOM.findDOMNode(this.refs.formBolla)) this.props.storeMeasure('formBollaHeight', ReactDOM.findDOMNode(this.refs.formBolla).clientHeight);
    	this.props.setHeaderInfo('Acquisti');
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
 
      <FixBlock className='periodPicker' coors={this.props.geometry.periodCoors}>
       <Form.Item
            label="Periodo"
          >
       <MonthPicker allowClear={false} value={period2moment([this.props.match.params.anno, this.props.match.params.mese])} onChange={this.props.setPeriodElencoBolle} format={"MM/YYYY"} />
       </Form.Item>
      </FixBlock>
     <FixBlock coors={this.props.geometry.tableCoors}>
       
       <TableElencoBolle geometry={this.props.geometry} listeningPeriod={this.props.listeningPeriod} period={this.props.period} />
   
   	 	 </FixBlock>
   <FixBlock coors={this.props.geometry.formCoors} className='bottom-form2' >
       
     <FormBolla geometry={this.props.geometry} />
           </FixBlock>
   
  </div>
 
 
)
}
}
}

export default ElencoBolle;
