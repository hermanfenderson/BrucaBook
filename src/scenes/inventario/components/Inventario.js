import TableInventario from '../containers/TableInventario';
import FormRigaInventario from '../containers/FormRigaInventario';
import TotaliInventario from '../components/TotaliInventario';
import FormCatalogo from '../../catalogo/containers/FormCatalogo';
import BookImg from '../../../components/BookImg'
import MessageQueue from '../../../components/MessageQueue'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';

import { Row, Col,  Modal, Spin, Button} from 'antd'

var currentIdInventario = null; 
var riga = null; 

class Inventario extends Component {

 componentDidMount() {
    	if(ReactDOM.findDOMNode(this.refs.formRigaInventario)) this.props.storeMeasure('formRigaInventarioHeight', ReactDOM.findDOMNode(this.refs.formRigaInventario).clientHeight);
    
    	
 }
 
 componentWillMount() {
 
 if (this.props.listeningTestataInventario) currentIdInventario = this.props.listeningTestataInventario.inventarioId;
 if (this.props.match.params.id !== currentIdInventario)	
	{   //Faccio reset... tranne la prima volta...
		if (currentIdInventario) 
			{this.props.resetInventario(this.props.match.params.id);
			//Ragiono solo per anno...
			 this.props.unlistenTestataInventario(null, currentIdInventario);
			} 
		this.props.listenTestataInventario(null, this.props.match.params.id); //In modo da acoltare il valore giusto...
	}
 //Per ora rimonto ogni volta...

 if (!this.props.listeningRegistroEAN) 
	{
		this.props.unlistenRegistroEAN(); //A scanso di equivoci...
	 
		this.props.listenRegistroEAN(this.props.match.params.id);
	}
		
 }
 
componentDidUpdate() {
	if (riga !== this.props.testataInventario) 
		{riga = this.props.testataInventario;
		 if (riga) this.props.setHeaderInfo("Inventario del " + moment(riga.dataDocumento).format("L"));
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
     <TableInventario  idInventario={this.props.match.params.id}/>
      
    	   </Col>
      </Row>
    
    <Row type="flex" align="bottom" className='bottom-form' ref='formRigaInventario'  style={{height: '250px'}}>
    <Col span={4}>
     <BookImg eanState={this.props.editedRigaInventario.eanState} ean={this.props.editedRigaInventario.values.ean} />

      </Col>
       <Col span={20}>
    
      <FormRigaInventario idInventario={this.props.match.params.id}  testataInventario={this.props.testataInventario} />
      </Col>
        
    </Row>
   
  </div>
  </Spin>
 
 
)
}

}
export default Inventario;
