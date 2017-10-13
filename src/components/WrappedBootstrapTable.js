import React from 'react';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

 
class WrappedBootstrapTable extends React.Component {
render ()
     {
     const selectRow = {
    		mode: 'radio',  // single select
				hideSelectColumn: true,
				bgColor: '#286090',	
				selected: []
  			};
  			
  			
  	
  	const tableHeaderColumns = this.props.header.map((header, index) => 
  				 <TableHeaderColumn key={index} dataField={header.dataField} width={header.width}>{header.label}</TableHeaderColumn> 	
  				);		
        return(
       		 <BootstrapTable height={'100%'} ref='bsTable'  data={this.props.data} striped hover condensed selectRow={ selectRow } >
        		 <TableHeaderColumn isKey dataField='key' hidden>Key</TableHeaderColumn>
        		 {tableHeaderColumns}	
    		</BootstrapTable>
       	
       		);	
     }	

/*ROTTAMAZIONE SOFTWARE!!!
	const tableHeaderColumns = this.props.header.map((header) => 
  				{
  				 <TableHeaderColumn dataField={header.dataField}>{header.label}</TableHeaderColumn> 	
  				}
  				);
  				
  			{tableHeaderColumns}	
  				
class WrappedBootstrapTable extends React.Component {
componentDidMount()
  {
  	  this.node = ReactDOM.findDOMNode(this.refs.bsTable).childNodes[0].childNodes[1];
  }
  
  componentDidUpdate() {
 	if (this.props.willScroll)
		{
		if (this.props.shouldScroll)  this.node.scrollTop = this.node.scrollHeight;
		this.props.scrollAction(false); //Resetto lo scroll...
		}
 }
  
    render ()
     {
			const selectRow = {
    		mode: 'radio',  // single select
				hideSelectColumn: true,
				bgColor: '#286090',	
				selected: []
  			};
			if (this.props.selectedRigaBolla) {selectRow['selected'] = [this.props.selectedRigaBolla]};
    return (
			   <BootstrapTable height={(this.props.shouldScroll) ? this.props.height : '100%'} ref='bsTable'  data={this.props.data} striped hover condensed selectRow={ selectRow } >
          <TableHeaderColumn isKey dataField='key' hidden>Key</TableHeaderColumn>
					 <TableHeaderColumn dataField='ean' filter={ { type: 'TextFilter', delay: 100 } }>EAN</TableHeaderColumn>

          <TableHeaderColumn dataField='titolo' filter={ { type: 'TextFilter', delay: 100 } }>Titolo</TableHeaderColumn>
          <TableHeaderColumn width='60' dataField='prezzoUnitario'>Prezzo</TableHeaderColumn>
					<TableHeaderColumn width='60' dataField='pezzi'>Quantità</TableHeaderColumn>
					<TableHeaderColumn width='60' dataField='gratis'>Gratis</TableHeaderColumn>
					<TableHeaderColumn width='70' dataField='prezzoTotale'>Totale</TableHeaderColumn>
					
					
       <TableHeaderColumn width='50' dataFormat={ this.props.dataFormat }></TableHeaderColumn>
      </BootstrapTable>
       );
   }
 }
 */
} 
 
export default WrappedBootstrapTable;
 


