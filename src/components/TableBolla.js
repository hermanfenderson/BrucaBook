//TUTTA DA SCRIVERE!!!!
import React from 'react';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


class TableBolla extends React.Component {
componentDidMount()
  {
  	  this.node = ReactDOM.findDOMNode(this.refs.bsTable).childNodes[0].childNodes[1];
  }
  
  componentDidUpdate() {
	if (this.props.shouldScroll) this.node.scrollTop = this.node.scrollHeight;
	}
  
    render ()
     {
     return (
        <BootstrapTable height={(this.props.shouldScroll) ? this.props.height : '100%'} ref='bsTable'  data={this.props.data} striped hover>
          <TableHeaderColumn isKey dataField='key' hidden>Key</TableHeaderColumn>
          <TableHeaderColumn dataField='titolo' filter={ { type: 'TextFilter', delay: 100 } }>Titolo</TableHeaderColumn>
          <TableHeaderColumn dataField='autore'>Autore</TableHeaderColumn>
       <TableHeaderColumn width='50' dataFormat={ this.props.dataFormat }></TableHeaderColumn>
      </BootstrapTable>
       );
     }
 }
 
 export default TableBolla;


