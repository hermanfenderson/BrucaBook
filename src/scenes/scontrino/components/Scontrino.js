
import TableScontrino from '../containers/TableScontrino';
import TableCassa from '../containers/TableCassa';

import FormRigaScontrino from '../containers/FormRigaScontrino';
import FormTestataScontrino from '../containers/FormTestataScontrino';

import TotaliScontrino from '../components/TotaliScontrino';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import TestataCassa from '../components/TestataCassa';
import BookImg from '../../../components/BookImg'
import MessageQueue from '../../../components/MessageQueue'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';

import moment from 'moment';
import 'moment/locale/it';


import { Row, Col,  Modal, Spin, Button} from 'antd'

var currentIdCassa = null;
var currentIdScontrino = null; 
 
 //<TableCassa  period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>

class Scontrino extends Component {


				  
 componentDidMount() {
    if (ReactDOM.findDOMNode(this.refs.formRigaScontrino)) this.props.storeMeasure('formRigaScontrinoHeight', ReactDOM.findDOMNode(this.refs.formRigaScontrino).clientHeight);
    	
    if (ReactDOM.findDOMNode(this.refs.testataCassa)) 	this.props.storeMeasure('testataCassaHeight', ReactDOM.findDOMNode(this.refs.testataCassa).clientHeight);
    if (ReactDOM.findDOMNode(this.refs.formTestataScontrino)) 	this.props.storeMeasure('testataScontrinoHeight', ReactDOM.findDOMNode(this.refs.testataCassa).clientHeight);
    
    	
 }
 
 componentWillMount() {
 if (this.props.shouldRedirectCassa)	this.props.setRedirect(false);	   	
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
			if (this.props.match.params.scontrino) this.props.resetTableScontrino(currentIdScontrino);
			else this.props.resetScontrino(currentIdScontrino);
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


componentWillUnmount() {
	
  if (!this.props.shouldRedirectCassa && !this.props.match.params.scontrino) 
		{this.props.setSelectedRigaCassa(null);
		currentIdScontrino = null; }
    
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
if (this.props.shouldRedirectCassa && this.props.selectedScontrino && this.props.selectedScontrino.key && (this.props.selectedScontrino.key !== this.props.match.params.scontrino)) 
	{
	
    const url = '/scontrino/' + this.props.match.params.anno + '/' + this.props.match.params.mese + '/' + this.props.match.params.cassa + '/' + this.props.selectedScontrino.key
	return (<Redirect to={url} />);
	}
else if (!this.props.selectedScontrino && this.props.shouldRedirectCassa)	
	{
	const url = '/scontrino/' + this.props.match.params.anno + '/' + this.props.match.params.mese + '/' + this.props.match.params.cassa; 
	return (<Redirect to={url} />);	
	}
else return (
 	
  <Row gutter={16}>
  <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='SCONTRINO'/>
    </Modal>  
  <Col style={{'backgroundColor': '#F0F0F0'}} span={7}>
	
    <Row>
    	<TestataCassa ref='testataCassa' testataCassa={this.props.testataCassa} staleTotaliCassa={this.props.staleTotaliCassa}/>
	
    </Row>
	
	<Row>
	<TableCassa  period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
	</Row>

  </Col>
  <Col span={17}>
  <Row>
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  
    	<Col span={5}>
			<TotaliScontrino staleTotali={this.props.staleTotali} testataScontrino={this.props.testataScontrino}/>
		</Col>
		<Col span={19}>
	    <Row>
	    	<Col span={3}>
				<Button type="primary" shape="circle" icon="plus" size={'small'} onClick={this.submitRigaCassa}/>
		
			</Col>
			<Col span={21}>
	
				<FormTestataScontrino period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}  ref='formTestataScontrino'/>
			</Col>
		</Row>
		<Row>
   		
		   <Spin spinning={!this.props.testataScontrino}>	
   	
			
					<TableScontrino  period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
		   </Spin>
	   	</Row>
			   
	   </Col>
	   
	</Row>  
	
       <Row style={{'backgroundColor': 'White'}}>
    		<Col span={5}>

				<BookImg eanState={this.props.editedRigaScontrino.eanState} ean={this.props.editedRigaScontrino.values.ean} />

	
		  </Col>
		  <Col span={19}>


    		<FormRigaScontrino period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino} testataScontrino={this.props.testataScontrino} ref='formRigaScontrino'/>
    	  </Col>

     </Row>
     
  </Col>
 
   
  </Row>
  
  )
  



}

}
export default Scontrino;
