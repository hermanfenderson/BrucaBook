
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

import OrdiniModalTable from '../../ordine/containers/OrdiniModalTable'

import React, {Component} from 'react'

import moment from 'moment';
import 'moment/locale/it';
import {withRouter} from 'react-router-dom'
import {period2month} from '../../../helpers/form'
import FixCol from '../../../components/FixCol'


import { Row, Col,  Modal, Spin, Button} from 'antd'

class Scontrino extends Component {


 componentDidMount() {
     this.props.listenTestataCassa([this.props.match.params.anno, this.props.match.params.mese],  this.props.match.params.cassa); //In modo da acoltare il valore giusto...
	if (this.props.match.params.scontrino) 
			{
				this.props.listenTestataScontrino([this.props.match.params.anno, this.props.match.params.mese,this.props.match.params.cassa],  this.props.match.params.scontrino); //In modo da acoltare il valore giusto..
			}
 	
    }

 
 
 

 
componentDidUpdate = (oldProps) => {
	    let scontrino = this.props.testataScontrino;
		let cassa = this.props.testataCassa;
        let oldScontrino = oldProps.testataScontrino;
		let oldCassa = oldProps.testataCassa;
		let oldCassaCassa = oldCassa ? oldCassa.cassa : null;
	
		let oldDataCassa = oldCassa ? oldCassa.dataCassa : null;
		let oldNumero = oldScontrino ? oldScontrino.numero : null;
		
        let oldIdScontrino = (oldProps.match && oldProps.match.params) ? oldProps.match.params.scontrino : null;
        let idScontrino = this.props.match.params.scontrino;
        //Reset e reload scontrino? 
        if (oldIdScontrino !== idScontrino)
	    	{
	    		if (oldIdScontrino)
	    			{
	    			//this.props.setSelectedRigaCassa(null);
					 this.props.resetScontrino(oldIdScontrino);	
					 this.props.unlistenTestataScontrino([this.props.match.params.anno, this.props.match.params.mese,this.props.match.params.cassa],  oldIdScontrino);
	    			}
	    	 if (idScontrino) this.props.listenTestataScontrino([this.props.match.params.anno, this.props.match.params.mese,this.props.match.params.cassa],  this.props.match.params.scontrino); //In modo da acoltare il valore giusto..
				
	    	}
	    var header = "Cassa ";
	    if (cassa) header = header + cassa.cassa + ' del ' + moment(cassa.dataCassa).format("L");
	if (scontrino && scontrino.numero) header = header + ' - scontrino n. ' + scontrino.numero;
	
    if ((cassa && oldCassaCassa !== cassa.cassa) || (cassa && oldDataCassa !== cassa.dataCassa)  || (scontrino && oldNumero !== scontrino.numero))
		this.props.setHeaderInfo(header);
};


componentWillUnmount = () =>{
	
  if (this.props.match.params.scontrino) 
		{this.props.setSelectedRigaCassa(null);
		 this.props.resetScontrino(this.props.match.params.scontrino);	//Serve?
		  this.props.unlistenTestataScontrino([this.props.match.params.anno, this.props.match.params.mese,this.props.match.params.cassa],  this.props.match.params.scontrino);
		}
  	this.props.resetCassa(this.props.match.params.cassa);
	 this.props.unlistenTestataCassa([this.props.match.params.anno, this.props.match.params.mese],  this.props.match.params.cassa);
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

handleKeyPress = (e) =>
{if(!this.props.eanLookupOpen && e.key==='n') this.submitRigaCassa(e) };

render()
{

   const period = [this.props.match.params.anno, this.props.match.params.mese];

return (
  <Row gutter={16}>
  <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='SCONTRINO'/>
    </Modal>  
     <OrdiniModalTable visible={this.props.ordiniModalVisible} data={this.props.ordiniModalVisible}/>

  <Col  style={{'backgroundColor': '#F0F0F0'}} span={6}>
	
    <Row>
    <Col className='header-cassa' span={8}>
  
    Cassa {this.props.testataCassa ? this.props.testataCassa.cassa : ''}
    </Col>
    <Col span={16}>
    	<Button type="primary" icon="plus" className='nuovo-scontrino-button' onClick={this.submitRigaCassa}> Nuovo scontrino</Button>
     </Col>
   
    </Row>
    <Row>
    	<TestataCassa filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} ref='testataCassa' testataCassa={this.props.testataCassa} staleTotaliCassa={this.props.staleTotaliCassa} totaliCassa={this.props.totaliCassa}/>
	
    </Row>
	
	<Row>
	    <TableCassa  filters={this.props.filters} period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
	</Row>

  </Col>
  <Col   span={18} className='sezione-scontrino' onKeyPress={this.handleKeyPress}>
  <Spin spinning={!this.props.match.params.scontrino}>
  <Row style={{height: this.props.geometry.sezioneScontrinoHeight}}>
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  
    	<FixCol  width={this.props.geometry.colonnaTestataScontrinoWidth}>
    	<Row  className='header-scontrino'>
    	Scontrino
    	</Row>
    	<Row>
    	
			
		
		
		
	
			<FormTestataScontrino period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino} data={this.props.data}  ref='formTestataScontrino'/>
			
    	</Row>
    	<Row>
			<TotaliScontrino staleTotali={this.props.staleTotali} testataScontrino={this.props.testataScontrino} totaliScontrino={this.props.totaliScontrino}/>
		</Row>
		<Row>
			<FormCalcoloResto staleTotali={this.props.staleTotali} totaliScontrino={this.props.totaliScontrino} testataScontrino={this.props.testataScontrino}/>
		</Row>
		<Row>
			<Button type="primary" icon="plus" className='nuovo-scontrino-button' onClick={this.submitRigaCassa}> Nuovo scontrino</Button>
     
		</Row>
		<Row>
		<BookImg style={{marginTop: this.props.geometry.sezioneScontrinoHeight - 120 - 250}} eanState={this.props.editedRigaScontrino.eanState} ean={this.props.editedRigaScontrino.values.ean} imgUrl={this.props.editedRigaScontrino.values.imgFirebaseUrl}  />
        </Row>
	
		</FixCol>
	     <FixCol width={this.props.geometry.tableScontrinoWidth}>
    
		<Row >
   		
		   <Spin spinning={!this.props.testataScontrino}>	
   	
			
					<TableScontrino geometry={this.props.geometry} period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
		   </Spin>
	   	</Row>
			   
	   </FixCol>
	   
	</Row>  
	
       <Row type="flex" align="bottom" className='bottom-form'  ref='formRigaScontrino' style={{height: '120px'}}>
    	  <Col span={24}>


    		<FormRigaScontrino   geometry={this.props.geometry} period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino} testataScontrino={this.props.testataScontrino} />
    	  </Col>

     </Row>
   </Spin>  
  </Col>
 
   
  </Row>
  )
  



}

}
export default withRouter(Scontrino);
