import TableTotaliDettagli from '../../dettagliArticolo/components/TableTotaliDettagli';
import React, {Component} from 'react'

import { Row, Modal, Button} from 'antd'




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
         <TableTotaliDettagli matrix={this.props.matrixEAN} anno={this.props.period.anno} mese={this.props.period.mese} setPeriod={this.props.setPeriodResa}/>
      </Row>
   
  </div>
 </Modal>
 
)
}

}
export default ModalDettagli;
