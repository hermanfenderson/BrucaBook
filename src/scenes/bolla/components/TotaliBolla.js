import React from 'react'
import {Row,Spin} from 'antd'


const TotaliBolla = (props) => 
    {
    	const totali = props.testataBolla ? props.testataBolla.totali : null;
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
	
export default TotaliBolla;

