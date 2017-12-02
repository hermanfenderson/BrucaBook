import React from 'react'
import {Row,Spin} from 'antd'


const TotaliScontrino = (props) => 
    {
    	const totali = props.testataScontrino ? props.testataScontrino.totali : null;
    	 if (totali) return(
		  <Spin spinning={props.staleTotali}>	

			<div>
			<Row> Copie: {totali.pezzi} </Row>
				<Row> Totale: {totali.prezzoTotale} </Row>
			</div>
		</Spin>	
			
			)
    	 else return   <Spin spinning={props.staleTotali} />		
    }		
	
export default TotaliScontrino;

