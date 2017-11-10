import TableMagazzino from '../containers/TableMagazzino';
import React, {Component} from 'react'

import { Row} from 'antd'




class Magazzino extends Component {
componentDidMount() {
    	this.props.setHeaderInfo('Magazzino');
    	
 }
 
  	
render()
{
  return (
 <div>	
      <Row>
         <TableMagazzino />
      </Row>
   
  </div>
 
 
)
}

}
export default Magazzino;
