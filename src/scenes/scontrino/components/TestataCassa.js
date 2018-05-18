import React from 'react'
import {Spin, Row} from 'antd'
import WrappedForm from '../../../components/WrappedForm';


class TestataCassa extends React.Component 
{
onChange = (field, value) => {this.props.setFilter(field,value)}
	
render()
    {
    const totali = (this.props.testataCassa && !this.props.staleTotaliCassa) ? this.props.testataCassa.totali : this.props.totaliCassa;
    	 if (totali) return(
		  
			<div>
		
			
			<Row> Totale cassa: {totali.prezzoTotale} </Row>
			<Row> Scontrini: {totali.scontrini} </Row>
			<Row> Copie: {totali.pezzi} </Row>
				
				<WrappedForm  onChange={this.onChange} loading={false} formValues={this.props.filters} errorMessages={{}}>
        			 <WrappedForm.Group formGroupLayout={{gutter:0}}>
    					<WrappedForm.Input placeholder='filtra titolo' field='titolo' formColumnLayout={{span:20}} itemStyle={{marginRight: 10}}/>
        				   <WrappedForm.Button buttonItemLayout={{style:{paddingTop: '0px'}}} icon="close-circle-o" type={'button'} formColumnLayout={{span:3}} onClick={this.props.resetFilter}></WrappedForm.Button>
        				</WrappedForm.Group>
    			</WrappedForm>

		
			</div>
			
			)
    	 else return   <Spin spinning={true}>
    	     
    	 </Spin>
    }		
}	
export default TestataCassa;
