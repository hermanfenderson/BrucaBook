import TableBolla from '../containers/TableBolla';
import FormRigaBolla from '../containers/FormRigaBolla';
import TotaliBolla from '../components/TotaliBolla';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import BookImg from '../../../components/BookImg'
import MessageQueue from '../../../components/MessageQueue'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';

import { Row, Col,  Modal, Spin} from 'antd'

var currentIdBolla = null; 
var riga = null; 

class Bolla extends Component {


 
 componentDidMount() {
   	if(ReactDOM.findDOMNode(this.refs.formRigaBolla)) 
   		{var node = ReactDOM.findDOMNode(this.refs.formRigaBolla);
   		this.props.storeMeasure('formRigaBollaHeight', node.clientHeight);
   		}
 }
 
 componentWillMount() {
 if (this.props.listeningTestataBolla) currentIdBolla = this.props.listeningTestataBolla.bollaId;
 if (this.props.match.params.id !== currentIdBolla)	
	{   //Faccio reset... tranne la prima volta...
		if (currentIdBolla) 
			{this.props.resetBolla(this.props.match.params.id);
			 this.props.unlistenTestataBolla([this.props.match.params.anno, this.props.match.params.mese], currentIdBolla);
			} 
		this.props.listenTestataBolla([this.props.match.params.anno, this.props.match.params.mese], this.props.match.params.id); //In modo da acoltare il valore giusto...
	}
		
 }
 
componentDidUpdate() {
   if (riga !== this.props.testataBolla) 
	{riga = this.props.testataBolla;
	if (riga) this.props.setHeaderInfo("Acquisti - Doc. " + riga.riferimento + ' ' 
				          						+ riga.nomeFornitore + ' del ' + moment(riga.dataDocumento).format("L"));

	}	
}

resetEditedCatalogItem = () => {
	this.props.resetEditedCatalogItem('BOLLA');
} 

submitEditedCatalogItem = (e) => {
	e.preventDefault();
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, 'BOLLA'); //Per sapere cosa fare... dopo
  }
 


render()
{
  const period = [this.props.match.params.anno, this.props.match.params.mese];
 return (
 
  <Spin spinning={!this.props.testataBolla}>
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  <div>
  
    <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='BOLLA'/>
    </Modal>  
    <Row style={{'backgroundColor': 'white'}}>
   <Col span={4}>
    	 <TotaliBolla staleTotali={this.props.staleTotali} testataBolla={this.props.testataBolla}/>
      </Col>
 
       <Col span={20}>
     <TableBolla  period={period} idBolla={this.props.match.params.id}/>
      
    	   </Col>
      </Row>
    
      <Row type="flex" align="bottom" className='bottom-form' style={{height: '250px'}} ref='formRigaBolla'>
   
     <Col span={4}>
     <BookImg eanState={this.props.editedRigaBolla.eanState} ean={this.props.editedRigaBolla.values.ean} imgUrl={this.props.editedRigaBolla.values.imgFirebaseUrl}/>

      </Col>
       <Col span={20}>
    
      <FormRigaBolla idBolla={this.props.match.params.id} period={period} testataBolla={this.props.testataBolla} />
      </Col>
        
    </Row>
   
  </div>
  </Spin>
 
 
)
}

}
export default Bolla;
