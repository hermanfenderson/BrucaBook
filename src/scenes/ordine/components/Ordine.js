import TableOrdine from '../containers/TableOrdine';
import FormRigaOrdine from '../containers/FormRigaOrdine';
import TotaliOrdine from '../components/TotaliOrdine';
import FilterOrdine from '../components/FilterOrdine';

import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import BookImg from '../../../components/BookImg'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';

import { Row, Col,  Modal, Spin} from 'antd'


class Ordine extends Component {


 //Modificato per eliminare il WillMount
 
 componentDidMount() {
    	if(ReactDOM.findDOMNode(this.refs.formRigaOrdine)) 
   		{var node = ReactDOM.findDOMNode(this.refs.formRigaOrdine);
   		this.props.storeMeasure('formRigaOrdineHeight', node.clientHeight);
   		}
   	if (!this.props.ordiniAperti) this.props.listenTestataOrdine(this.props.match.params.cliente, this.props.match.params.id); //In modo da acoltare il valore giusto...se sto lavorando sulla lista degli ordini aperti... non devo ascoltare nulla qui...	
    else if (this.props.ordiniAperti)  	this.props.setHeaderInfo("Ordini aperti"); 
 	
 }
 
 
 
componentDidUpdate(oldProps) {
	let oldTestataOrdine = oldProps.testataOrdine ? oldProps.testataOrdine : null
    let riga = this.props.testataOrdine ?  this.props.testataOrdine : null
   if (riga !== oldTestataOrdine || this.props.ordiniAperti !== oldProps.ordiniAperti) 
	{
	let cliente =  this.props.clienti[this.props.match.params.cliente];
	if (riga && cliente) 
	    {
		this.props.setHeaderInfo("Ordini -  Cliente " + cliente.nome + ' ' 
				          						+ cliente.cognome + ' del ' + moment(riga.dataOrdine).format("L"));
	    }		    
	else if (this.props.ordiniAperti)  	
		{
	//	this.props.resetOrdine(oldProps.match.params.cliente, oldProps.match.params.id);
		this.props.unlistenTestataOrdine( oldProps.match.params.cliente, oldProps.match.params.id);	
		this.props.setHeaderInfo("Ordini aperti"); 
		}
	
	else this.props.listenTestataOrdine(this.props.match.params.cliente, this.props.match.params.id);
	}	
}

componentWillUnmount() {
	if (!this.props.ordiniAperti) 
	{
//	this.props.resetOrdine(this.props.match.params.cliente, this.props.match.params.id);
	this.props.unlistenTestataOrdine( this.props.match.params.cliente, this.props.match.params.id);
	}
}

resetEditedCatalogItem = () => {
	this.props.resetEditedCatalogItem('Ordine');
} 

submitEditedCatalogItem = (e) => {
	e.preventDefault();
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, 'Ordine', this.props.saveGeneral); //Per sapere cosa fare... dopo
  }
 


render()
{
  const period = [this.props.match.params.anno, this.props.match.params.mese];
 return (
 
  <Spin spinning={!this.props.testataOrdine && !this.props.ordiniAperti}>
  <div>
  
    <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='Ordine'/>
    </Modal>  
    <Row style={{'backgroundColor': 'white'}}>
   <Col span={4}>
         <Row>
    	 {!this.props.ordiniAperti ? (
        <TotaliOrdine staleTotali={this.props.staleTotali} testataOrdine={this.props.testataOrdine} totaliOrdine={	this.props.totaliOrdine}/>
      ) : ( <div> </div>
         )}	</Row>
    	<Row>
    	  <BookImg eanState={this.props.editedRigaOrdine.eanState} ean={this.props.editedRigaOrdine.values.ean} imgUrl={this.props.editedRigaOrdine.values.imgFirebaseUrl}/>
		</Row>
      </Col>
 
       <Col span={20}>
        <Row>
      <FilterOrdine geometry={this.props.geometry} filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} />
      </Row>
   <Row>
     <TableOrdine ordiniAperti={this.props.ordiniAperti}  geometry={this.props.geometry} cliente={this.props.match.params.cliente} idOrdine={this.props.match.params.id} filters={this.props.filters} clienti={this.props.clienti}/>
      </Row>
    	   </Col>
      </Row>
    
      <Row type="flex" align="bottom" className='bottom-form' style={{height: '120px'}} ref='formRigaOrdine'>
   
       <Col span={24}>
    
      <FormRigaOrdine ordiniAperti={this.props.ordiniAperti} geometry={this.props.geometry} cliente={this.props.match.params.cliente} idOrdine={this.props.match.params.id} period={period} testataOrdine={this.props.testataOrdine} />
      </Col>
        
    </Row>
   
  </div>
  </Spin>
 
 
)
}

}
export default Ordine;
