import React from 'react'
import {Row,Spin} from 'antd'


const TotaliResaLibera = (props) => 
    {
    	const totali = props.testataResa ? props.testataResa.totali : null;
    	 if (totali) return(
		  <Spin spinning={props.staleTotali}>	

			<div>
			<Row> Copie: {totali.pezzi} </Row>
			<Row> Gratis:  {totali.gratis} </Row>
			<Row> Totale: {totali.prezzoTotale} </Row>
			</div>
		</Spin>	
			
			)
    	 else return   <Spin spinning={props.staleTotali} />		
    }		
	
export default TotaliResaLibera;

