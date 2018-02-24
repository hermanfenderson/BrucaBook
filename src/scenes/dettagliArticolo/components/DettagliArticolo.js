import TableTotaliDettagli from '../components/TableTotaliDettagli';
import React, {Component} from 'react'

import { Row} from 'antd'



var listening = null;

class DettagliArticolo extends Component {
componentWillMount() {
	    if (listening !== this.props.match.params.ean)
	    {
    	this.props.setHeaderInfo('Dettagli ' + this.props.match.params.ean);
	    if (listening) this.props.offListenEAN(listening);
	    this.props.listenEAN(this.props.match.params.ean);	
	    }
 }
 
  	
render()
{
  return (
 <div>	
      <Row>
         {this.props.headerEAN ? this.props.headerEAN.titolo + ' - ' + this.props.headerEAN.autore + ' - in magazzino: ' +  this.props.headerEAN.pezzi : null}
      </Row>
      <Row>
         <TableTotaliDettagli matrix={this.props.matrixEAN} anno={this.props.period.anno} mese={this.props.period.mese} setPeriod={this.props.setPeriod}/>
      </Row>
   
  </div>
 
 
)
}

}
export default DettagliArticolo;
