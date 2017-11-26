
import TableScontrino from '../containers/TableScontrino';
import FormRigaScontrino from '../containers/FormRigaScontrino';
import TotaliScontrino from '../components/TotaliScontrino';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';


import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';

import { Row, Col,  Modal, Spin} from 'antd'


class Scontrino extends Component {

 componentDidMount() {
    	this.props.storeMeasure('formRigaScontrinoHeight', ReactDOM.findDOMNode(this.refs.formRigaScontrino).clientHeight);
    
    	
 }
 
 componentWillMount() {
 var currentIdScontrino = null; 
 if (this.props.listeningTestataScontrino) currentIdScontrino = this.props.listeningTestataScontrino.scontrinoId;
 if (this.props.match.params.scontrino !== currentIdScontrino)	
	{   //Faccio reset... tranne la prima volta...
		if (currentIdScontrino) 
			{this.props.resetScontrino(this.props.match.params.scontrino);
			 this.props.unlistenTestataScontrino([this.props.match.params.anno, this.props.match.params.mese,this.props.match.params.cassa],  currentIdScontrino);
			} 
		this.props.listenTestataScontrino([this.props.match.params.anno, this.props.match.params.mese,this.props.match.params.cassa],  this.props.match.params.scontrino); //In modo da acoltare il valore giusto...
	}
		
 }
 
componentDidUpdate() {
		const riga = this.props.testataScontrino;
	//Da mettere a posto
	if (riga) this.props.setHeaderInfo("Cassa - Doc. " + riga.riferimento + ' ' 
				          						+ riga.fornitore + ' del ' + moment(riga.dataDocumento).format("L"));
}

resetEditedCatalogItem = () => {
	this.props.resetEditedCatalogItem('SCONTRINO');
} 

submitEditedCatalogItem = (e) => {
	e.preventDefault();
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, 'SCONTRINO'); //Per sapere cosa fare... dopo
  }
 

render()
{
  const period = [this.props.match.params.anno, this.props.match.params.mese];
return (
<Spin spinning={!this.props.testataScontrino}>	
 	
  <Row>
  <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='SCONTRINO'/>
    </Modal>  
  <Col span={5}>
	<Row>Totali cassa + Pulldown
	</Row>
	<Row>Immagine
	</Row>
  </Col>
  <Col span={14}>
    <Row style={{'backgroundColor': 'white'}}>
    <FormRigaScontrino period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino} testataScontrino={this.props.testataScontrino} ref='formRigaScontrino'/>
    </Row>
    <Row>
    <TableScontrino  period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
    </Row>
  </Col>
  <Col span={5}>
	<Row> 
		<TotaliScontrino staleTotali={this.props.staleTotali} testataScontrino={this.props.testataScontrino}/>
	</Row>
	<Row>
		Selezioni testata
	</Row>
  </Col>
   
  </Row>
  </Spin>
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
