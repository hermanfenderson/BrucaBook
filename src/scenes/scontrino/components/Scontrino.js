
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
import FixBlock from '../../../components/FixBlock'


import {Modal, Spin, Button} from 'antd'

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
<div>	
  <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='SCONTRINO'/>
    </Modal>  
     <OrdiniModalTable visible={this.props.ordiniModalVisible} data={this.props.ordiniModalVisible}/>

  <FixBlock  style={{'backgroundColor': '#F0F0F0'}} coors={this.props.geometryC.cassaCoors}>
	
    <FixBlock className='header-cassa' coors={this.props.geometryC.headerCassaCoors}>
  
    Cassa {this.props.testataCassa ? this.props.testataCassa.cassa : ''}
    </FixBlock>
    <FixBlock coors={this.props.geometryC.nuovoScontrinoCoors}>
  
    	<Button type="primary" icon="plus" className='nuovo-scontrino-button' onClick={this.submitRigaCassa}> Nuovo scontrino</Button>
   
    </FixBlock>
    <FixBlock coors={this.props.geometryC.testataCoors}>
 
    	<TestataCassa geometry={this.props.geometryC} filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} ref='testataCassa' testataCassa={this.props.testataCassa} staleTotaliCassa={this.props.staleTotaliCassa} totaliCassa={this.props.totaliCassa}/>
   </FixBlock>
 	
 
  <FixBlock  style={{backgroundColor: 'white'}} coors={this.props.geometryC.tableCoors}>
 	    <TableCassa  geometry={this.props.geometryC}  filters={this.props.filters} period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
	</FixBlock>
 </FixBlock>
 
  <FixBlock coors={this.props.geometryS.scontrinoCoors} className='sezione-scontrino' onKeyPress={this.handleKeyPress}>
  <Spin spinning={!this.props.match.params.scontrino}>
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  
    	<FixBlock  coors={this.props.geometryS.infoCoors} className='header-scontrino'>
    	Scontrino
    	</FixBlock>
    	<FixBlock  coors={this.props.geometryS.editScontrinoCoors}>
    	
			<FormTestataScontrino period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino} data={this.props.data}  ref='formTestataScontrino'/>
			
    	</FixBlock>
    	<FixBlock coors={this.props.geometryS.totaliCoors}>
			<TotaliScontrino staleTotali={this.props.staleTotali} testataScontrino={this.props.testataScontrino} totaliScontrino={this.props.totaliScontrino}/>
		</FixBlock>
		<FixBlock coors={this.props.geometryS.restoFormCoors}>
			<FormCalcoloResto staleTotali={this.props.staleTotali} totaliScontrino={this.props.totaliScontrino} testataScontrino={this.props.testataScontrino}/>
		</FixBlock>
		<FixBlock coors={this.props.geometryS.nuovoScontrinoCoors}>
			<Button type="primary" icon="plus" className='nuovo-scontrino-button' onClick={this.submitRigaCassa}> Nuovo scontrino</Button>
     
		</FixBlock>
		<FixBlock className='immagineCol' coors={this.props.geometryS.immagineCoors} >
    	<BookImg eanState={this.props.editedRigaScontrino.eanState} ean={this.props.editedRigaScontrino.values.ean} imgUrl={this.props.editedRigaScontrino.values.imgFirebaseUrl}  />
        </FixBlock>
	
	     <FixBlock coors={this.props.geometryS.tableCoors}>
    
	
		   <Spin spinning={!this.props.testataScontrino}>	
   	
			
					<TableScontrino geometry={this.props.geometryS} period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino}/>
		   </Spin>
	   	</FixBlock>

<FixBlock className='bottom-form2' coors={this.props.geometryS.formCoors} >
   

    		<FormRigaScontrino   geometry={this.props.geometryS} period={period} cassa={this.props.match.params.cassa} scontrino={this.props.match.params.scontrino} testataScontrino={this.props.testataScontrino} />
</FixBlock>
 
   </Spin>  
  </FixBlock>
 </div>
  )
  



}

}
export default withRouter(Scontrino);
