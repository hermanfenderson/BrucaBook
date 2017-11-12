import React from 'react'
import {Row} from 'antd'


const TotaliBolla = (props) => 
    {
    	const totali = props.testataBolla ? props.testataBolla.totali : null;
    	 if (totali) return(
			<div>
			<Row> Copie: {totali.pezzi} </Row>
			<Row> Gratis:  {totali.gratis} </Row>
			<Row> Totale: {totali.prezzoTotale} </Row>
			</div>
			)
    	 else return null;	
    }		
	
export default TotaliBolla;

