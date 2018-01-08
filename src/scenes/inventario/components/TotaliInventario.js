import React from 'react'
import {Row,Spin} from 'antd'


const TotaliInventario = (props) => 
    {
    	const totali = props.testataInventario ? props.testataInventario.totali : null;
    	 if (totali) return(
		  <Spin spinning={props.staleTotali}>	

			<div>
			<Row> Titoli {totali.righe > 0 ? totali.righe : '0'} / {totali.magazzino > 0 ? totali.magazzino : '0'} </Row>
			</div>
		</Spin>	
			
			)
    	 else return   <Spin spinning={props.staleTotali} />		
    }		
	
export default TotaliInventario;

