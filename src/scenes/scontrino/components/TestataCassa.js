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
			
			<Row> Totale cassa: {totali.prezzoTotale} </Row>
			<Row> Scontrini: {totali.scontrini} </Row>
			<Row> Copie: {totali.pezzi} </Row>
				
			</Spin>	
		
			</div>
			
			)
    	 else return   <Spin spinning={this.props.staleTotaliCassa}>
    	     
    	 </Spin>
    }		
}	
export default TestataCassa;
