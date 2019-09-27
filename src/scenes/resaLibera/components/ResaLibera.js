import TableResa from '../containers/TableResaLibera';
import FormRigaResa from '../containers/FormRigaResaLibera';
import TotaliResa from '../components/TotaliResaLibera';
import FilterResaLibera from '../components/FilterResaLibera';

import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import BookImg from '../../../components/BookImg'
import MessageQueue from '../../../components/MessageQueue'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';
import {Redirect} from 'react-router-dom';

import {Modal} from 'antd'
import FixBlock from '../../../components/FixBlock'



class ResaLibera extends Component {


 
 componentDidMount() {
	this.props.listenTestataResa([this.props.match.params.anno, this.props.match.params.mese], this.props.match.params.id); //In modo da acoltare il valore giusto...	
 }
 
componentDidUpdate(oldProps) {
	let oldTestataResa = oldProps.testataResa ? oldProps.testataResa : null
    let riga = this.props.testataResa ?  this.props.testataResa : null
   if (riga !== oldTestataResa) 
	{
	if (riga) this.props.setHeaderInfo("Rese - Doc. " + riga.riferimento + ' ' 
				          						+ riga.nomeFornitore + ' del ' + moment(riga.dataDocumento).format("L"));
	}	
}
 
componentWillUnmount() {
	this.props.resetResa(this.props.match.params.id);
			 this.props.unlistenTestataResa([this.props.match.params.anno, this.props.match.params.mese], this.props.match.params.id);
}

resetEditedCatalogItem = () => {
	this.props.resetEditedCatalogItem('RESA_LIBERA');
} 

submitEditedCatalogItem = (e) => {
	e.preventDefault();
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, 'RESA_LIBERA', this.props.saveGeneral); //Per sapere cosa fare... dopo
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
 
  <div>       
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='RESA'/>
    </Modal>  
  
    
	 <FixBlock className='totaliCol' coors={this.props.geometry.totaliCoors}>
    	
    	 <TotaliResa  testataResa={this.props.testataResa} totaliResa={	this.props.totaliResa}/>
    	</FixBlock>
    	<FixBlock className='immagineCol' coors={this.props.geometry.immagineCoors} >
    	  <BookImg eanState={this.props.editedRigaResa.eanState} ean={this.props.editedRigaResa.values.ean} imgUrl={this.props.editedRigaResa.values.imgFirebaseUrl}/>
		</FixBlock>
      
       <FixBlock className='filter-form' coors={this.props.geometry.formSearchCoors} >
      <FilterResaLibera  geometry={this.props.geometry} filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} />
      </FixBlock>
   <FixBlock  spinning={!this.props.testataResa} coors={this.props.geometry.tableCoors} >
     <TableResa  geometry={this.props.geometry} period={period} idResa={this.props.match.params.id} filters={this.props.filters}/>
      </FixBlock>
    
      <FixBlock className='bottom-form2' coors={this.props.geometry.formCoors} >
   
      
      <FormRigaResa  geometry={this.props.geometry} idResa={this.props.match.params.id} period={period} testataResa={this.props.testataResa} />
        
    </FixBlock>
   
  </div>
 
 
)
}

}
export default ResaLibera;
