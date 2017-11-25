/*
import TableBolla from '../containers/TableBolla';
import FormRigaBolla from '../containers/FormRigaBolla';
import TotaliBolla from '../components/TotaliBolla';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';
*/

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';

import { Row, Col,  Modal, Spin} from 'antd'
import FormRigaScontrino from '../components/FormRigaScontrino';


class Scontrino extends Component {
/*
 componentDidMount() {
    	this.props.storeMeasure('formRigaBollaHeight', ReactDOM.findDOMNode(this.refs.formRigaBolla).clientHeight);
    
    	
 }
 
 componentWillMount() {
 var currentIdBolla = null; 
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
		const riga = this.props.testataBolla;
	if (riga) this.props.setHeaderInfo("Acquisti - Doc. " + riga.riferimento + ' ' 
				          						+ riga.fornitore + ' del ' + moment(riga.dataDocumento).format("L"));
}

resetEditedCatalogItem = () => {
	this.props.resetEditedCatalogItem('BOLLA');
} 

submitEditedCatalogItem = (e) => {
	e.preventDefault();
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, 'BOLLA'); //Per sapere cosa fare... dopo
  }
 
*/

render()
{
  const period = [this.props.match.params.anno, this.props.match.params.mese];
return (
  <Row>
  <Col span={6}>
	<Row>Totali cassa + Pulldown
	</Row>
	<Row>Immagine
	</Row>
  </Col>
  <Col span={12}>
    <Row style={{'backgroundColor': 'white'}}>
    <FormRigaScontrino period={this.props.period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
    </Row>
    <Row>
    Table Scontrino
    </Row>
  </Col>
  <Col span={6}>
	<Row> 
		Totali scontrino
	</Row>
	<Row>
		Selezioni testata
	</Row>
  </Col>
   
  </Row>
  )
  
/*  
 return (
  <Spin spinning={!this.props.testataBolla}>	
  <div>
  
    <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='BOLLA'/>
    </Modal>  
    <Row style={{'backgroundColor': 'white'}}>
      <Col span={4}>
      </Col>
      <Col span={16}>
    	 <FormRigaBolla idBolla={this.props.match.params.id} period={period} testataBolla={this.props.testataBolla} ref='formRigaBolla'/>
      </Col>
      <Col span={4}>
    	 <TotaliBolla staleTotali={this.props.staleTotali} testataBolla={this.props.testataBolla}/>
      </Col>
    </Row>
    
     <Row>
      
         <TableBolla  period={period} idBolla={this.props.match.params.id}/>
      
    </Row>
   
  </div>
  </Spin>
 
 
)*/


}

}
export default Scontrino;
