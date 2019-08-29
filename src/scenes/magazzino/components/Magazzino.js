import TableMagazzino from '../containers/TableMagazzino';
import FilterMagazzino from './FilterMagazzino';
import React, {Component} from 'react'


import FixBlock from '../../../components/FixBlock'



class Magazzino extends Component {
componentDidMount() {
    	if (!this.props.noHeader) this.props.setHeaderInfo('Magazzino'); //Per usare magazzino anche per la ricerca libri...
 }
 
  	
render()
{
 const inModal = this.props.noHeader;
 let tableCoors = {...this.props.geometry.tableCoors};
 let formSearchCoors = {...this.props.geometry.formSearchCoors};
 if (inModal)
	{
	tableCoors.width = 700;
	formSearchCoors.width = 700;
	}
console.log(tableCoors);	
 return (
 <div>	
  <FixBlock coors={formSearchCoors}>
      <FilterMagazzino saveMagazzino={this.props.saveMagazzino} formSearchCols={inModal ? this.props.formSearchFixedCols : this.props.formSearchCols} filters={this.props.filters} setFilter={this.props.setFilter} resetFilter={this.props.resetFilter} />
    </FixBlock>
    
     <FixBlock coors={tableCoors}>
         <TableMagazzino width={tableCoors.width} height={tableCoors.height} header={inModal ? this.props.fixedHeader : this.props.header}  noDetails={this.props.noDetails} filters={this.props.filters} selectedCallback={this.props.selectedCallback}/>
    </FixBlock>
  </div>
 
 
)
}

}
export default Magazzino;
