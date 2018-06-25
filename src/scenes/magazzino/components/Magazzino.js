import TableMagazzino from '../containers/TableMagazzino';
import FilterMagazzino from './FilterMagazzino';
import React, {Component} from 'react'

import { Row} from 'antd'




class Magazzino extends Component {
componentDidMount() {
    	if (!this.props.noHeader) this.props.setHeaderInfo('Magazzino'); //Per usare magazzino anche per la ricerca libri...
 }
 
  	
render()
{
 const inModal = this.props.noHeader;
 return (
 <div>	
      <Row>
      <FilterMagazzino formSearchCols={inModal ? this.props.formSearchFixedCols : this.props.formSearchCols} filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} />
      </Row>
      <Row>
      
         <TableMagazzino width={this.props.width} header={inModal ? this.props.fixedHeader : this.props.header}  noDetails={this.props.noDetails} filters={this.props.filters} selectedCallback={this.props.selectedCallback}/>
      </Row>
   
  </div>
 
 
)
}

}
export default Magazzino;
