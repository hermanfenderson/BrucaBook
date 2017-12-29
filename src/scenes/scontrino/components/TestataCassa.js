import React from 'react'
import {Spin, Row} from 'antd'
import WrappedForm from '../../../components/WrappedForm';


class TestataCassa extends React.Component 
{
onChange = (field, value) => {this.props.setFilter(field,value)}
	
render()
    {
    const totali = this.props.testataCassa ? this.props.testataCassa.totali : null;
    	 if (totali) return(
		  
			<div>
		
			<Spin spinning={this.props.staleTotaliCassa}>	
			
			<Row> Totale cassa: {totali.prezzoTotale} </Row>
			<Row> Scontrini: {totali.scontrini} </Row>
			<Row> Copie: {totali.pezzi} </Row>
				
			</Spin>
				<WrappedForm  onChange={this.onChange} loading={false} formValues={this.props.filters} errorMessages={{}}>
        			 <WrappedForm.Group formGroupLayout={{gutter:16}}>
    					<WrappedForm.Input placeholder='filtra titolo' field='titolo' formColumnLayout={{span:24}} />
        				</WrappedForm.Group>
    			</WrappedForm>

		
			</div>
			
			)
    	 else return   <Spin spinning={this.props.staleTotaliCassa}>
    	     
    	 </Spin>
    }		
}	
export default TestataCassa;
