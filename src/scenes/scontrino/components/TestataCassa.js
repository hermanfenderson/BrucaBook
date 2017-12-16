import React from 'react'
import {Button, Spin, Row} from 'antd'


class TestataCassa extends React.Component 
{
render()
    {
    const totali = this.props.testataCassa ? this.props.testataCassa.totali : null;
    	 if (totali) return(
		  
			<div>
		
			<Spin spinning={this.props.staleTotaliCassa}>	

			<Row> Copie: {totali.pezzi} </Row>
				<Row> Totale: {totali.prezzoTotale} </Row>
			</Spin>	
		
			</div>
			
			)
    	 else return   <Spin spinning={this.props.staleTotaliCassa}>
    	     
    	 </Spin>
    }		
}	
export default TestataCassa;
