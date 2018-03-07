import TableTotaliDettagli from '../../dettagliArticolo/components/TableTotaliDettagli';
import React, {Component} from 'react'
import BookImg from '../../../components/BookImg';

import { Row, Button, Col, Modal} from 'antd'
//import ReactModal from 'react-modal';




class ModalDettagli extends Component {

handleCancel = () =>
{
  this.props.setActiveModal(false);	
}
/*
 <Modal  destroyOnClose={true} onCancel={this.handleCancel} width={'90%'} footer={[
            <Button key="back" onClick={this.handleCancel}>Chiudi</Button>,
            ]} visible={this.props.activeModal}> 	
            */
//<ReactModal  ariaHideApp={false} onRequestClose={this.handleCancel}  isOpen={this.props.activeModal}> 	
            
render()
{
  return (
 <Modal  destroyOnClose={true} onCancel={this.handleCancel} width={'90%'} footer={[
            <Button key="back" onClick={this.handleCancel}>Chiudi</Button>,
            ]} visible={this.props.activeModal}> 	
    	
 <div>	
    
      <Row>
         {this.props.headerEAN ? this.props.headerEAN.titolo + ' - ' + this.props.headerEAN.autore + ' - in magazzino: ' +  this.props.headerEAN.pezzi : null}
      </Row>
      <Row>
         <Col span={4}>
           <BookImg ean={this.props.headerEAN ? this.props.headerEAN.ean: null} eanState={this.props.headerEAN ? 'COMPLETE' : 'BLANK'} imgUrl={this.props.headerEAN ? this.props.headerEAN.imgFirebaseUrl: null}/>
    
      </Col>
      <Col span={20}>
         <TableTotaliDettagli matrix={this.props.matrixEAN} anno={this.props.period.anno} mese={this.props.period.mese} setPeriod={this.props.setPeriodResa}/>
     </Col>
   
      </Row>
      
  </div>
 </Modal>
 
)
}

}
export default ModalDettagli;
