import TableResa from '../containers/TableResaLibera';
import FormRigaResa from '../containers/FormRigaResaLibera';
import TotaliResa from '../components/TotaliResaLibera';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import BookImg from '../../../components/BookImg'
import MessageQueue from '../../../components/MessageQueue'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';
import {Redirect} from 'react-router-dom';

import { Row, Col,  Modal, Spin} from 'antd'

var currentIdResa = null; 
var riga = null; 

class ResaLibera extends Component {


 
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
		this.props.listenTestataResa([this.props.match.params.anno, this.props.match.params.mese], this.props.match.params.id); //In modo da acoltare il valore giusto...
	}
		
 }
 
componentDidUpdate() {
   if (riga !== this.props.testataResa) 
	{riga = this.props.testataResa;
	if (riga) this.props.setHeaderInfo("Rese - Doc. " + riga.riferimento + ' ' 
				          						+ riga.nomeFornitore + ' del ' + moment(riga.dataDocumento).format("L"));

	}	
}

resetEditedCatalogItem = () => {
	this.props.resetEditedCatalogItem('RESA_LIBERA');
} 

submitEditedCatalogItem = (e) => {
	e.preventDefault();
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, 'RESA_LIBERA'); //Per sapere cosa fare... dopo
  }
 


render()
{
  const period = [this.props.match.params.anno, this.props.match.params.mese];
//Per evitare casini!!! Se l'utente forza il nome lo rimbalzo sulla resa giusta
if (this.props.testataResa && this.props.testataResa.stato !=='libera' ) 
{
const url = '/resa/'+this.props.match.params.anno+'/'+this.props.match.params.mese+'/'+this.props.match.params.id;	
 return(<Redirect to={url} />)
}
else return (
 
  <Spin spinning={!this.props.testataResa}>
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  <div>
  
    <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='Resa'/>
    </Modal>  
    <Row style={{'backgroundColor': 'white'}}>
   <Col span={4}>
    	 <TotaliResa staleTotali={this.props.staleTotali} testataResa={this.props.testataResa}/>
      </Col>
 
       <Col span={20}>
     <TableResa  period={period} idResa={this.props.match.params.id}/>
      
    	   </Col>
      </Row>
    
      <Row type="flex" align="bottom" className='bottom-form' style={{height: '250px'}} ref='formRigaResaLibera'>
   
     <Col span={4}>
     <BookImg eanState={this.props.editedRigaResa.eanState} ean={this.props.editedRigaResa.values.ean} imgUrl={this.props.editedRigaResa.values.imgFirebaseUrl}/>

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
export default ResaLibera;
