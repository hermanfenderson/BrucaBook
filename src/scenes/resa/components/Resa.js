import TableResa from '../containers/TableResa';
import TableOpenResa from '../containers/TableOpenResa';

import TotaliResa from '../components/TotaliResa';
import MessageQueue from '../../../components/MessageQueue'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';
import {Redirect} from 'react-router-dom';

import { Row, Col, Spin} from 'antd'



class Resa extends Component {


 
 componentDidMount() {
 	if(ReactDOM.findDOMNode(this.refs.formRigaResa)) 
   		{var node = ReactDOM.findDOMNode(this.refs.formRigaResa);
   		this.props.storeMeasure('formRigaResaHeight', node.clientHeight);
   		}
   	this.props.listenTestataResa([this.props.match.params.anno, this.props.match.params.mese], this.props.match.params.id); //In modo da acoltare il valore giusto...
	let params = [this.props.match.params.anno, this.props.match.params.mese];
    params.push(this.props.match.params.id);
    this.props.listenRigaResa(params);	
 }
 	   	
 componentWillUnmount() {
 	let currentIdResa = this.props.match.params.id;
 	this.props.resetResa(currentIdResa);
			 this.props.unlistenTestataResa([this.props.match.params.anno, this.props.match.params.mese], currentIdResa);
			 let params = [this.props.match.params.anno, this.props.match.params.mese];
    	   			params.push(currentIdResa);
    	   			this.props.offListenRigaResa(params); 
    	   			this.props.resetResa([this.props.match.params.anno, this.props.match.params.mese],currentIdResa);
    	   	if (this.props.testataResa && this.props.testataResa.fornitore) this.props.unlistenBollePerFornitore(this.props.testataResa.fornitore);		
 }
 
componentDidUpdate(oldProps) {
	if (this.props.testataResa && (this.props.testataResa !== oldProps.testataResa))
		{
		this.props.listenBollePerFornitore(this.props.testataResa.fornitore, this.props.testataResa.dataScarico);
		let riga = this.props.testataResa;
		this.props.setHeaderInfo("Rese - Doc. " + riga.riferimento + ' ' 
					          						+ riga.nomeFornitore + ' del ' + moment(riga.dataDocumento).format("L"));
				 
		}	 
	 	
}   





render()
{

  	
  const isOpen = (this.props.testataResa && (this.props.testataResa.stato === 'aperta')) ? true : false;   
  const period = [this.props.match.params.anno, this.props.match.params.mese];
  if (this.props.testataResa && this.props.testataResa.stato ==='libera' ) 
{
const url = '/resaLibera/'+this.props.match.params.anno+'/'+this.props.match.params.mese+'/'+this.props.match.params.id;	
 return(<Redirect to={url} />)
}
else return (

 
  <Spin spinning={!this.props.testataResa}>
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  <div>
  
      <Row style={{'backgroundColor': 'white'}}>
   <Col span={4}>
    	 <TotaliResa staleTotali={this.props.staleTotali} testataResa={this.props.testataResa} listeningTestataResa={this.props.listeningTestataResa} setStato={this.props.setStato}/>
      </Col>
 
       <Col span={20}>
    {isOpen ? <TableOpenResa  testataResa={this.props.testataResa} period={period} idResa={this.props.match.params.id}/> :  <TableResa testataResa={this.props.testataResa} period={period} idResa={this.props.match.params.id}/> }
      
    	   </Col>
      </Row>
    
     
   
  </div>
  </Spin>
 
 
)
}

}
export default Resa;
