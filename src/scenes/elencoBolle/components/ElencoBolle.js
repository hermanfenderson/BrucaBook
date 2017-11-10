import TableElencoBolle from '../containers/TableElencoBolle';
import FormBolla from '../containers/FormBolla';
import React, {Component} from 'react'
import ReactDOM from 'react-dom';

import { Row} from 'antd'




class ElencoBolle extends Component {
componentDidMount() {
    	this.props.storeMeasure('formBollaHeight', ReactDOM.findDOMNode(this.refs.formBolla).clientHeight);
    	this.props.setHeaderInfo('Acquisti');
    	
 }
 
  	
//Rimosso il reset da qui... non mi serve mai resettare visto che non ho casi ambigui...devo solo resettare la riga selezionata
 componentWillMount() {
  this.props.setSelectedBolla(null);
}

render()
{
  return (
 <div>	
  <Row>
   	 <FormBolla ref='formBolla'/>
    </Row>
     <Row>
         <TableElencoBolle/>
      </Row>
   
  </div>
 
 
)
}

}
export default ElencoBolle;
