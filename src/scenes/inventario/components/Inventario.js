//Sistemati i lifecycle a versione 16.3...

import TableInventario from '../containers/TableInventario';
import FormRigaInventario from '../containers/FormRigaInventario';
import TotaliInventario from '../components/TotaliInventario';
import FilterInventario from '../components/FilterInventario';

import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import BookImg from '../../../components/BookImg'
import MessageQueue from '../../../components/MessageQueue'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';

import { Row, Col,  Modal, Spin, Button} from 'antd'


class Inventario extends Component {

 componentDidMount() {
 	    //Misura della form...
    	if(ReactDOM.findDOMNode(this.refs.formRigaInventario)) this.props.storeMeasure('formRigaInventarioHeight', ReactDOM.findDOMNode(this.refs.formRigaInventario).clientHeight);
       this.props.listenTestataInventario(null, this.props.match.params.id);
 }
 
 
 componentWillUnmount() {
 	this.props.resetInventario(this.props.match.params.id);
	this.props.unlistenTestataInventario(null, this.props.match.params.id);
 }
 
componentDidUpdate = (oldProps) => {

	let dataInventarioNew = this.props.testataInventario ? this.props.testataInventario.dataInventario : null;
	let dataInventarioOld = oldProps.testataInventario ? oldProps.testataInventario.dataInventario : null;
	//Ho ricevuto una data inventario nuova oppure la ho per la prima volta
	if (dataInventarioNew !== dataInventarioOld)
		{
		this.props.setHeaderInfo("Inventario del " + moment(dataInventarioNew).format("L"));
		this.props.searchDataMagazzino(dataInventarioNew);		
		}
		

}

resetEditedCatalogItem = () => {
	this.props.resetEditedCatalogItem('INVENTARIO');
} 

submitEditedCatalogItem = (e) => {
	e.preventDefault();
	this.props.submitEditedCatalogItem(this.props.editedCatalogItem.isValid,  this.props.editedCatalogItem.values, 'INVENTARIO'); //Per sapere cosa fare... dopo
  }
 


generaRighe = () => {
	this.props.generaRighe(this.props.match.params.id)
}

render()
{
   return (
 
  <Spin spinning={!this.props.testataInventario}>
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  <div>
  
    <Modal visible={this.props.showCatalogModal} onOk={this.submitEditedCatalogItem} onCancel={this.resetEditedCatalogItem}>
		<FormCatalogo isModal={true} readOnlyEAN={true} scene='INVENTARIO'/>
    </Modal>  
    <Row style={{'backgroundColor': 'white'}}>
   <Col span={4}>
         <Button onClick={this.generaRighe}> Carica </Button>
        <TotaliInventario staleTotali={this.props.staleTotali} testataInventario={this.props.testataInventario} />
      </Col>
 
       <Col span={20}>
     <FilterInventario formSearchCols={this.props.formSearchCols} filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} />
   
     <TableInventario  width={this.props.geometry.tableWidth} filters={this.props.filters} header={this.props.geometry.header} idInventario={this.props.match.params.id}/>
      
    	   </Col>
      </Row>
    
    <Row type="flex" align="bottom" className='bottom-form' ref='formRigaInventario'  style={{height: '150px'}}>
    <Col span={4}>
     <BookImg eanState={this.props.editedRigaInventario.eanState} ean={this.props.editedRigaInventario.values.ean} imgUrl={this.props.editedRigaInventario.values.imgFirebaseUrl} />

      </Col>
       <Col span={20}>
    
      <FormRigaInventario geometry={this.props.geometry} idInventario={this.props.match.params.id}  testataInventario={this.props.testataInventario} />
      </Col>
        
    </Row>
   
  </div>
  </Spin>
 
 
)
}

}
export default Inventario;
