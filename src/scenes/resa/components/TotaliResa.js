import React from 'react' 
import {Row,Spin, Switch, Form} from 'antd' 
const TotaliResa = (props) => 
{ const totali = props.testataResa ? props.testataResa.totali : null; 
  const testata = props.testataResa;
  return (testata) ?
		 <div>
			<Form layout="inline"> 
				<Form.Item label="Aperta"> 
				<Switch checked={(props.testataResa.stato==='aperta')} onChange={(checked) => {
																						if (checked) props.setStato(props.listeningTestataResa, props.testataResa, "aperta");
																						else props.setStato(props.listeningTestataResa, props.testataResa, "chiusa");
																						}} /> 
				</Form.Item> 
			</Form> 
					<div> 
					<Row> Copie: {totali ? totali.pezzi : 0} </Row> 
					<Row> Gratis: {totali ? totali.gratis : 0} </Row> 
					<Row> Totale: {totali ? totali.prezzoTotale : '0.00'} </Row> 
				</div> 
				</div>
		:
		<Spin spinning={true} />
}			
export default TotaliResa;
