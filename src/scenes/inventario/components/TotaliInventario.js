import React from 'react'
import {Row} from 'antd'
import Spinner from '../../../components/Spinner'


const TotaliInventario = (props) => 
    {
    	const totali = props.testataInventario ? props.testataInventario.totali : null;
    	 if (totali) return(
		  <Spinner spinning={props.staleTotali}>	

			<div>
			<Row> Titoli {totali.righe > 0 ? totali.righe : '0'} / {totali.magazzino > 0 ? totali.magazzino : '0'} </Row>
			</div>
		</Spinner>	
			
			)
    	 else return   <Spinner spinning={props.staleTotali} />		
    }		
	
export default TotaliInventario;

