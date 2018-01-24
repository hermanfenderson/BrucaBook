import TableResa from '../containers/TableResa';
import FormRigaResa from '../containers/FormRigaResa';
import TotaliResa from '../components/TotaliResa';
import BookImg from '../../../components/BookImg'
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
   if (this.props.testataResa.fornitore !== currentFornitore)
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
     <TableResa  period={period} idResa={this.props.match.params.id}/>
      
    	   </Col>
      </Row>
    
      <Row type="flex" align="bottom" className='bottom-form' style={{height: '250px'}} ref='formRigaResa'>
   
     <Col span={4}>
     <BookImg eanState={this.props.editedRigaResa.eanState} ean={this.props.editedRigaResa.values.ean} />

      </Col>
       <Col span={20}>
    
      <FormRigaResa idResa={this.props.match.params.id} period={period} testataResa={this.props.testataResa} />
      </Col>
        
    </Row>
   
  </div>
  </Spin>
 
 
)
}

}
export default Resa;
