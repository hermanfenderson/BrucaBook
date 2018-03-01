import TableTotaliDettagli from '../../dettagliArticolo/components/TableTotaliDettagli';
import React, {Component} from 'react'
import BookImg from '../../../containers/BookImg';

import { Row, Modal, Button, Col} from 'antd'




class ModalDettagli extends Component {

handleCancel = () =>
{
  this.props.setActiveModal(false);	
}

render()
{
  return (
 <Modal  onCancel={this.handleCancel} width={'90%'} footer={[
            <Button key="back" onClick={this.handleCancel}>Chiudi</Button>,
            ]} visible={this.props.activeModal}> 	
 <div>	
      <Row>
         {this.props.headerEAN ? this.props.headerEAN.titolo + ' - ' + this.props.headerEAN.autore + ' - in magazzino: ' +  this.props.headerEAN.pezzi : null}
      </Row>
      <Row>
         <Col span={4}>
      <BookImg ean={this.props.headerEAN.ean} eanState='COMPLETE' />
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
