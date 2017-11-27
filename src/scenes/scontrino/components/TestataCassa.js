import React from 'react'
import {Button, Spin, Row} from 'antd'


const TestataCassa = (props) => 
    {
    const totali = props.testataCassa ? props.testataCassa.totali : null;
    	 if (totali) return(
		  <Spin spinning={props.staleTotaliCassa}>	

			<div>
				<Button type="primary" shape="circle" icon="plus" size={'small'} onClick={props.submitRigaCassa}/>
			<Row> Copie: {totali.pezzi} </Row>
				<Row> Totale: {totali.prezzoTotale} </Row>
			</div>
		</Spin>	
			
			)
    	 else return   <Spin spinning={props.staleTotaliCassa} />	
    }		
	
export default TestataCassa;
