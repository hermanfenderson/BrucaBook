//import TableDettagliArticolo from '../components/TableDettagliArticolo';
import React, {Component} from 'react'

import { Row} from 'antd'



var listening = null;
class DettagliArticolo extends Component {
componentDidMount() {
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
      </Row>
      <Row>
      
       {/*  <TableMagazzino filters={this.props.filters */}
      </Row>
   
  </div>
 
 
)
}

}
export default DettagliArticolo;
