import TableMagazzino from '../containers/TableMagazzino';
import FilterMagazzino from './FilterMagazzino';
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
      <FilterMagazzino filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} />
      </Row>
      <Row>
      
         <TableMagazzino filters={this.props.filters}/>
      </Row>
   
  </div>
 
 
)
}

}
export default Magazzino;
