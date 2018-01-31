import React from 'react' 
import {Row,Spin, Switch, Form} from 'antd' 
const TotaliResa = (props) => 
{ const totali = props.testataResa ? props.testataResa.totali : null; 
	if (totali) return( 
		
		<div>
			<Form layout="inline"> 
				<Form.Item label="Aperta"> 
				<Switch checked={true} onChange={() => {}} /> 
				</Form.Item> 
			</Form> 
			<Spin spinning={props.staleTotali}> 
				<div> 
					<Row> Copie: {totali.pezzi} </Row> 
					<Row> Gratis: {totali.gratis} </Row> 
					<Row> Totale: {totali.prezzoTotale} </Row> 
				</div> 
			</Spin> 
			</div>
			) 
else return <Spin spinning={props.staleTotali} /> } 
export default TotaliResa;
