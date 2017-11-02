import TableElencoBolle from '../containers/TableElencoBolle';
import FormBolla from '../containers/FormBolla';
import React, {Component} from 'react'
import { Row} from 'antd'




class ElencoBolle extends Component {
  	
 componentWillUnmount() {
 	this.props.resetElencoBolle();
 }
 
render()
{
  return (
 <div>	
  <Row>
   	 <FormBolla/>
    </Row>
     <Row>
         <TableElencoBolle/>
      </Row>
   
  </div>
 
 
)
}

}
export default ElencoBolle;
