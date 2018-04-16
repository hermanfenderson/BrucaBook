import React from 'react'
import {Row,Spin} from 'antd'


const TotaliScontrino = (props) => 
    { 
    	const totali = (props.testataScontrino && !props.staleTotali) ? props.testataScontrino.totali : props.totaliScontrino; //Uso la copia calcolata in locale finchè non arriva quella calcolata al centro...
    	 if (totali) return(
	
			<div>
			<Row> Copie: {totali.pezzi} </Row>
				<Row> Totale: {totali.prezzoTotale} </Row>
			</div>
			
			)
    	 else return   <Spin spinning={true} />		
    }		
	
export default TotaliScontrino;

