import React from 'react'
import {Row,Spin} from 'antd'


const TotaliOrdine = (props) => 
    {
    	const totali = (props.testataOrdine && !props.staleTotali) ? props.testataOrdine.totali : props.totaliOrdine; //Uso la copia calcolata in locale finchè non arriva quella calcolata al centro...
    	 if (totali) return(
	
			<div>
		<Row> Copie: {totali.pezzi} </Row>
			<Row> Totale: {totali.prezzoTotale} </Row>
			</div>
			
			)
    	 else return   <Spin spinning={true} />		
    }		
	
export default TotaliOrdine;

