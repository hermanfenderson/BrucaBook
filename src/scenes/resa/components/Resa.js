import TableResa from '../containers/TableResa';
import TableOpenResa from '../containers/TableOpenResa';

import TotaliResa from '../components/TotaliResa';
import MessageQueue from '../../../components/MessageQueue'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';

import { Row, Col, Spin} from 'antd'

var currentIdResa = null; 
var currentFornitore = null;
var riga = null; 


class Resa extends Component {


 
 componentDidMount() {
 	if(ReactDOM.findDOMNode(this.refs.formRigaResa)) 
   		{var node = ReactDOM.findDOMNode(this.refs.formRigaResa);
   		this.props.storeMeasure('formRigaResaHeight', node.clientHeight);
   		}
 }
 	   	
 

updateListeners = () => {
	//Cosa dovrei controllare?
//Devo stare ascoltando una resaId = a quella corrente...sia per testata che per riga e avere il fornitore della resa corrente...
//if (this.props.listeningTestataResa) currentIdResa = this.props.listeningTestataResa.ResaId;
//Se sto ascoltando una vecchia resa... oppure non sto ascoltando nulla...
if (this.props.match.params.id !== currentIdResa)	
	{   //Faccio reset... tranne la prima volta...
		if (currentIdResa) 
			{
			this.props.resetResa(this.props.match.params.id);
			 this.props.unlistenTestataResa([this.props.match.params.anno, this.props.match.params.mese], currentIdResa);
			 let params = [this.props.match.params.anno, this.props.match.params.mese];
    	   			params.push(currentIdResa);
    	   			this.props.offListenRigaResa(params); 
    	   			this.props.resetResa([this.props.match.params.anno, this.props.match.params.mese],currentIdResa);
    	   	//E smetto anche di ascoltare il fornitore...
    	   	if (currentFornitore) 
    	   		{this.props.unlistenBollePerFornitore(currentFornitore);
    	   		
    	   		currentFornitore = null;
    	   		}
			} 
		//if (currentFornitore) {this.props.unlistenBollePerFornitore(currentFornitore); currentFornitore = null}
		this.props.listenTestataResa([this.props.match.params.anno, this.props.match.params.mese], this.props.match.params.id); //In modo da acoltare il valore giusto...
		let params = [this.props.match.params.anno, this.props.match.params.mese];
    	   	params.push(this.props.match.params.id);
    	   	this.props.listenRigaResa(params); 
    	currentIdResa =  this.props.match.params.id;  	
	}
else
	{
	if (this.props.testataResa)
		{
			if (currentFornitore !== this.props.testataResa.fornitore)
				{
				currentFornitore = this.props.testataResa.fornitore;
				//Posso ascoltare... tanto ho smesso di ascoltare prima... al cambio resa...
				this.props.listenBollePerFornitore(currentFornitore, this.props.testataResa.dataScarico);
				}
		//Leggo i dati di testata corretti... (qui so anche il fornitore)
		if (riga !== this.props.testataResa) 
			{
			riga = this.props.testataResa;
			this.props.setHeaderInfo("Rese - Doc. " + riga.riferimento + ' ' 
					          						+ riga.nomeFornitore + ' del ' + moment(riga.dataDocumento).format("L"));
			 }
		}	 
	}		
}
 
componentWillMount() {
this.updateListeners();	
}
    
componentDidUpdate() {
this.updateListeners();	
	
}   

render()
{

  	
  const isOpen = (this.props.testataResa && (this.props.testataResa.stato === 'aperta')) ? true : false;   
  const period = [this.props.match.params.anno, this.props.match.params.mese];
  
 return (
 
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
