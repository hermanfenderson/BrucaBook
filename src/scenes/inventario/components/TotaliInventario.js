import React from 'react'
import {Row,Spin} from 'antd'


const TotaliInventario = (props) => 
    {
    	const totali = props.testataInventario ? props.testataInventario.totali : null;
    	 if (totali) return(
		  <Spin spinning={props.staleTotali}>	

			<div>
			<Row> Copie: {totali.pezzi} </Row>
			</div>
		</Spin>	
			
			)
    	 else return   <Spin spinning={props.staleTotali} />		
    }		
	
export default TotaliInventario;

