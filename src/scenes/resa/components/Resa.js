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
 
 componentWillMount() {
 if (this.props.listeningTestataResa) currentIdResa = this.props.listeningTestataResa.ResaId;
 if (this.props.match.params.id !== currentIdResa)	
	{   //Faccio reset... tranne la prima volta...
		if (currentIdResa) 
			{this.props.resetResa(this.props.match.params.id);
			 this.props.unlistenTestataResa([this.props.match.params.anno, this.props.match.params.mese], currentIdResa);
			} 
		if (currentFornitore) {this.props.unlistenBollePerFornitore(currentFornitore); currentFornitore = null}
		this.props.listenTestataResa([this.props.match.params.anno, this.props.match.params.mese], this.props.match.params.id); //In modo da acoltare il valore giusto...
	}
		
 }
 
componentDidUpdate() {
   if (this.props.testataResa && (this.props.testataResa.fornitore !== currentFornitore))
		{
			currentFornitore = this.props.testataResa.fornitore;
			this.props.listenBollePerFornitore(currentFornitore);
		}
	
   if (riga !== this.props.testataResa) 
	{riga = this.props.testataResa;
		if (riga) {this.props.setHeaderInfo("Rese - Doc. " + riga.riferimento + ' ' 
				          						+ riga.nomeFornitore + ' del ' + moment(riga.dataDocumento).format("L"));
			  
		     
			  }
	}	
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
    	 <TotaliResa staleTotali={this.props.staleTotali} testataResa={this.props.testataResa}/>
      </Col>
 
       <Col span={20}>
    {isOpen ? <TableOpenResa  period={period} idResa={this.props.match.params.id}/> :  <TableResa  period={period} idResa={this.props.match.params.id}/> }
      
    	   </Col>
      </Row>
    
     
   
  </div>
  </Spin>
 
 
)
}

}
export default Resa;
