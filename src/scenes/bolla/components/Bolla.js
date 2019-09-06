import TableBolla from '../containers/TableBolla';
import FormRigaBolla from '../containers/FormRigaBolla';
import TotaliBolla from '../components/TotaliBolla';
import FilterBolla from '../components/FilterBolla';

import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import BookImg from '../../../components/BookImg'
import MessageQueue from '../../../components/MessageQueue'
import OrdiniModalTable from '../../ordine/containers/OrdiniModalTable'


import React, {Component} from 'react'
import moment from 'moment';
import 'moment/locale/it';

import { Modal} from 'antd'
import FixBlock from '../../../components/FixBlock'

class Bolla extends Component {


 //Modificato per eliminare il WillMount
 
 componentDidMount() {
     	this.props.listenTestataBolla([this.props.match.params.anno, this.props.match.params.mese], this.props.match.params.id); //In modo da acoltare il valore giusto...	
 }
 
 
 
componentDidUpdate(oldProps) {
	let oldTestataBolla = oldProps.testataBolla ? oldProps.testataBolla : null
    let riga = this.props.testataBolla ?  this.props.testataBolla : null
   if (riga !== oldTestataBolla) 
	{
	if (riga) this.props.setHeaderInfo("Acquisti - Doc. " + riga.riferimento + ' ' 
				          						+ riga.nomeFornitore + ' del ' + moment(riga.dataDocumento).format("L"));
	}	
}

componentWillUnmount() {
	this.props.resetBolla(this.props.match.params.id);
	this.props.unlistenTestataBolla([this.props.match.params.anno, this.props.match.params.mese], this.props.match.params.id);
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
  <div>
 
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='BOLLA'/>
    </Modal>  
    <OrdiniModalTable visible={this.props.ordiniModalVisible} data={this.props.ordiniModalVisible}/>

    
	 <FixBlock className='totaliCol' coors={this.props.geometry.totaliCoors}>
    	
    	 <TotaliBolla staleTotali={this.props.staleTotali} testataBolla={this.props.testataBolla} totaliBolla={	this.props.totaliBolla}/>
    	</FixBlock>
    	<FixBlock className='immagineCol' coors={this.props.geometry.immagineCoors} >
    	  <BookImg eanState={this.props.editedRigaBolla.eanState} ean={this.props.editedRigaBolla.values.ean} imgUrl={this.props.editedRigaBolla.values.imgFirebaseUrl}/>
		</FixBlock>
      
       <FixBlock className='filter-form' coors={this.props.geometry.formSearchCoors} >
      <FilterBolla  geometry={this.props.geometry} filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} />
      </FixBlock>
   <FixBlock  spinning={!this.props.testataBolla} coors={this.props.geometry.tableCoors} >
     <TableBolla  geometry={this.props.geometry} period={period} idBolla={this.props.match.params.id} filters={this.props.filters}/>
      </FixBlock>
    
      <FixBlock className='bottom-form2' coors={this.props.geometry.formCoors} >
   
      
      <FormRigaBolla  geometry={this.props.geometry} idBolla={this.props.match.params.id} period={period} testataBolla={this.props.testataBolla} />
        
    </FixBlock>
   
  </div>
 
 
)
}

}
export default Bolla;
