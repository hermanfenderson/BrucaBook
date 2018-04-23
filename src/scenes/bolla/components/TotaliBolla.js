import React from 'react'
import {Row,Spin} from 'antd'


const TotaliBolla = (props) => 
    {
    	const totali = (props.testataBolla && !props.staleTotali) ? props.testataBolla.totali : props.totaliBolla; //Uso la copia calcolata in locale finchè non arriva quella calcolata al centro...
    	 if (totali) return(
	
			<div>
		<Row> Copie: {totali.pezzi} </Row>
			<Row> Gratis:  {totali.gratis} </Row>
			<Row> Totale: {totali.prezzoTotale} </Row>
			</div>
			
			)
    	 else return   <Spin spinning={true} />		
    }		
	
export default TotaliBolla;

