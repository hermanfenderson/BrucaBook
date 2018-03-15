
import TableScontrino from '../containers/TableScontrino';
import TableCassa from '../containers/TableCassa';

import FormRigaScontrino from '../containers/FormRigaScontrino';
import FormTestataScontrino from '../containers/FormTestataScontrino';
import FormCalcoloResto from '../components/FormCalcoloResto';

import TotaliScontrino from '../components/TotaliScontrino';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import TestataCassa from '../components/TestataCassa';
import BookImg from '../../../components/BookImg'
import MessageQueue from '../../../components/MessageQueue'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';

import moment from 'moment';
import 'moment/locale/it';
import {withRouter} from 'react-router-dom'
import {period2month} from '../../../helpers/form'


import { Row, Col,  Modal, Spin, Button} from 'antd'

var currentIdCassa = null;
var currentIdScontrino = null; 
var scontrino = null;
var cassa = null;
 
 //<TableCassa  period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>

class Scontrino extends Component {


				  
 componentDidMount() {
    if (ReactDOM.findDOMNode(this.refs.formRigaScontrino)) this.props.storeMeasure('formRigaScontrinoHeight', ReactDOM.findDOMNode(this.refs.formRigaScontrino).clientHeight);
    	
    if (ReactDOM.findDOMNode(this.refs.testataCassa)) 	this.props.storeMeasure('testataCassaHeight', ReactDOM.findDOMNode(this.refs.testataCassa).clientHeight);
    if (ReactDOM.findDOMNode(this.refs.formTestataScontrino)) 	this.props.storeMeasure('testataScontrinoHeight', ReactDOM.findDOMNode(this.refs.testataCassa).clientHeight);
    
    	
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
			if (this.props.match.params.scontrino) this.props.resetTableScontrino(currentIdScontrino);
			else this.props.resetScontrino(currentIdScontrino);
			 this.props.unlistenTestataScontrino([this.props.match.params.anno, this.props.match.params.mese,this.props.match.params.cassa],  currentIdScontrino);
			} 
		if (this.props.match.params.scontrino) 
			{this.props.listenTestataScontrino([this.props.match.params.anno, this.props.match.params.mese,this.props.match.params.cassa],  this.props.match.params.scontrino); //In modo da acoltare il valore giusto..
			}
	}
	
 }
 

 
componentDidUpdate() {
		scontrino = this.props.testataScontrino;
		cassa = this.props.testataCassa;

	//Da mettere a posto
	    var header = "Cassa ";
	    if (cassa) header = header + cassa.cassa + ' del ' + moment(cassa.dataCassa).format("L");
	if (scontrino) header = header + ' - scontrino n. ' + scontrino.numero;
	
	this.props.setHeaderInfo(header);
}


componentWillUnmount() {
	
  if (!this.props.match.params.scontrino) 
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
    let key = this.props.submitRigaCassa(true, null, [this.props.match.params.anno, this.props.match.params.mese, this.props.match.params.cassa],{});
    this.props.history.push('/scontrino/'+ period2month([this.props.match.params.anno, this.props.match.params.mese]) + '/' +this.props.match.params.cassa + '/'+key  );
}  

 

render()
{

	
  const period = [this.props.match.params.anno, this.props.match.params.mese];

return (
 	
  <Row gutter={16}>
  <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='SCONTRINO'/>
    </Modal>  
  <Col  style={{height: this.props.measures['headerHeight'] ? this.props.measures['viewPortHeight']-this.props.measures['headerHeight']-48 : '100px', 'backgroundColor': '#F0F0F0'}} span={6}>
	
    <Row>
    <Col className='header-cassa' span={6}>
  
    Cassa {this.props.testataCassa ? this.props.testataCassa.cassa : ''}
    </Col>
    <Col span={18}>
    	<Button type="primary" icon="plus" size={'small'} className='nuovo-scontrino-button' onClick={this.submitRigaCassa}> Nuovo scontrino</Button>
     </Col>
   
    </Row>
    <Row>
    	<TestataCassa filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} ref='testataCassa' testataCassa={this.props.testataCassa} staleTotaliCassa={this.props.staleTotaliCassa}/>
	
    </Row>
	
	<Row>
	    <TableCassa  filters={this.props.filters} period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
	</Row>

  </Col>
  <Col style={{height: this.props.measures['headerHeight'] ? this.props.measures['viewPortHeight']-this.props.measures['headerHeight']-48 : '100px'}} span={18} className='sezione-scontrino'>
  <Spin spinning={!this.props.match.params.scontrino}>
  <Row>
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  
    	<Col span={6}>
    	<Row  className='header-scontrino'>
    	Scontrino
    	</Row>
    	<Row>
    	
			
		
		
		
	
			<FormTestataScontrino period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino} data={this.props.data}  ref='formTestataScontrino'/>
			
    	</Row>
    	<Row>
			<TotaliScontrino staleTotali={this.props.staleTotali} testataScontrino={this.props.testataScontrino}/>
		</Row>
		<Row>
			<FormCalcoloResto testataScontrino={this.props.testataScontrino}/>
		</Row>
		
		</Col>
		<Col span={18}>
	    <Row>
	    	
		</Row>
		<Row>
   		
		   <Spin spinning={!this.props.testataScontrino}>	
   	
			
					<TableScontrino  period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
		   </Spin>
	   	</Row>
			   
	   </Col>
	   
	</Row>  
	
       <Row type="flex" align="bottom" className='bottom-form'  ref='formRigaScontrino' style={{height: '250px'}}>
    		<Col span={5}>

				<BookImg eanState={this.props.editedRigaScontrino.eanState} ean={this.props.editedRigaScontrino.values.ean} imgUrl={this.props.editedRigaScontrino.values.imgFirebaseUrl}  />

	
		  </Col>
		  <Col span={19}>


    		<FormRigaScontrino period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino} testataScontrino={this.props.testataScontrino} />
    	  </Col>

     </Row>
   </Spin>  
  </Col>
 
   
  </Row>
  
  )
  



}

}
export default withRouter(Scontrino);
