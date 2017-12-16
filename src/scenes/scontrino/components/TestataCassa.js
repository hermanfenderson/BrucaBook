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
    	     <Button type="primary" shape="circle" icon="plus" size={'small'} onClick={this.props.submitRigaCassa}/>
		
    	 </Spin>
    }		
}	
export default TestataCassa;
