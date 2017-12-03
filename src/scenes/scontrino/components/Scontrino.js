
import TableScontrino from '../containers/TableScontrino';
import TableCassa from '../containers/TableCassa';

import FormRigaScontrino from '../containers/FormRigaScontrino';
import FormTestataScontrino from '../containers/FormTestataScontrino';

import TotaliScontrino from '../components/TotaliScontrino';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import TestataCassa from '../components/TestataCassa';

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';

import moment from 'moment';
import 'moment/locale/it';


import { Row, Col,  Modal, Spin} from 'antd'

var currentIdCassa = null;
var currentIdScontrino = null; 
  

class Scontrino extends Component {

 componentDidMount() {
    if (ReactDOM.findDOMNode(this.refs.formRigaScontrino))	this.props.storeMeasure('formRigaScontrinoHeight', ReactDOM.findDOMNode(this.refs.formRigaScontrino).clientHeight);
    
    	
 }
 
 componentWillMount() {
 //Sento sia lo scontrino che la cassa...
 if (this.props.listeningTestataCassa) currentIdCassa = this.props.listeningTestataCassa.itemId;
 if (this.props.match.params.cassa !== currentIdCassa)	
	{ 
		if (currentIdCassa) 
			{
			this.props.resetCassa(currentIdCassa);
			 this.props.unlistenTestataCassa([this.props.match.params.anno, this.props.match.params.mese],  currentIdCassa);
			} 
		if (this.props.match.params.cassa) this.props.listenTestataCassa([this.props.match.params.anno, this.props.match.params.mese],  this.props.match.params.cassa); //In modo da acoltare il valore giusto...
	}
	
 if (this.props.listeningTestataScontrino) currentIdScontrino = this.props.listeningTestataScontrino.itemId;
 if (this.props.match.params.scontrino !== currentIdScontrino)	
	{ 
		if (currentIdScontrino) 
			{
			this.props.resetScontrino(currentIdScontrino);
			 this.props.unlistenTestataScontrino([this.props.match.params.anno, this.props.match.params.mese,this.props.match.params.cassa],  currentIdScontrino);
			} 
		if (this.props.match.params.scontrino) this.props.listenTestataScontrino([this.props.match.params.anno, this.props.match.params.mese,this.props.match.params.cassa],  this.props.match.params.scontrino); //In modo da acoltare il valore giusto...
	}
		
 }
 
componentDidUpdate() {
		const scontrino = this.props.testataScontrino;
		const cassa = this.props.testataCassa;
	//Da mettere a posto
	    var header = "Cassa ";
	    if (cassa) header = header + cassa.cassa + ' del ' + moment(cassa.dataCassa).format("L");
	if (scontrino) header = header + ' - scontrino n. ' + scontrino.numero;
	
	this.props.setHeaderInfo(header);
}

resetEditedCatalogItem = () => {
	this.props.resetEditedCatalogItem('SCONTRINO');
} 

submitEditedCatalogItem = (e) => {
	e.preventDefault();
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, 'SCONTRINO'); //Per sapere cosa fare... dopo
  }
 
submitRigaCassa = (e) => {
	e.preventDefault();
	this.props.submitRigaCassa(true, null, [this.props.match.params.anno, this.props.match.params.mese, this.props.match.params.cassa],{});
}  
 

render()
{
  const period = [this.props.match.params.anno, this.props.match.params.mese];
if (this.props.selectedScontrino && this.props.selectedScontrino.key && (this.props.selectedScontrino.key !== this.props.match.params.scontrino)) 
	{
    const url = '/scontrino/' + this.props.match.params.anno + '/' + this.props.match.params.mese + '/' + this.props.match.params.cassa + '/' + this.props.selectedScontrino.key
	return (<Redirect to={url} />);
	}
else return (
 	
  <Row gutter={16}>
  <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='SCONTRINO'/>
    </Modal>  
  <Col span={7}>
	<Row>
	<TestataCassa submitRigaCassa={this.submitRigaCassa}  testataCassa={this.props.testataCassa} staleTotaliCassa={this.props.staleTotaliCassa}/>
	</Row>
	<Row>Immagine
	</Row>
	<Row>
	 <TableCassa  period={period} cassa={this.props.match.params.cassa} />
	</Row>
  </Col>
 
  <Col span={14}>
   <Spin spinning={!this.props.testataScontrino}>	

    <Row style={{'backgroundColor': 'white'}}>
    <FormRigaScontrino period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino} testataScontrino={this.props.testataScontrino} ref='formRigaScontrino'/>
     </Row>
    <Row>
    <TableScontrino  period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
    </Row>
    </Spin>
  </Col>
  <Col span={3}>
	<Row> 
		<TotaliScontrino staleTotali={this.props.staleTotali} testataScontrino={this.props.testataScontrino}/>
	</Row>
	<Row>
		<FormTestataScontrino period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}  ref='formTestataScontrino'/>
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
