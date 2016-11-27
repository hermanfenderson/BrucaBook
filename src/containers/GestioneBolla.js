import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import FormRigaBolla from '../containers/FormRigaBolla';
import '../styles/app.css';
const bolla = 1; //Arriva come prop da sopra

class GestioneBolla extends React.Component {

  componentDidMount() {
     this.props.actions.deletedRigaBolla(bolla);
    this.props.actions.addedRigaBolla(bolla);
  }
 
  editRow(id)
         {
           this.props.eanInputRef.focus(); 
         }

 deleteRow = (id) => 
         {
           this.props.actions.deleteRigaBolla(bolla,id);
           this.props.eanInputRef.focus(); //Metto il focus su EAN dopo la cancellazione
         }
  azioniFormatter = (cell, row) => {
  return (
        <div>
        <div className="glyphicon glyphicon-trash" onClick={() => { this.deleteRow(row['key'])}}></div>
				<div className="glyphicon glyphicon-edit" onClick={() => { this.editRow(this.props.righeBollaArray[row]['key'])}} ></div>  
        </div>
        );
 }
 
 render() {
    return (
      <div>
      <FormRigaBolla/>
       <BootstrapTable data={this.props.righeBollaArray} striped hover>
          <TableHeaderColumn isKey dataField='key' hidden>Key</TableHeaderColumn>
          <TableHeaderColumn dataField='titolo' filter={ { type: 'TextFilter', delay: 100 } }>Titolo</TableHeaderColumn>
          <TableHeaderColumn dataField='autore'>Autore</TableHeaderColumn>
       <TableHeaderColumn width='50' dataFormat={ this.azioniFormatter }></TableHeaderColumn>
      </BootstrapTable>
     
           </div>
    );
  }
}



function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    righeBollaArray: state.bolle.righeBollaArray,
    eanInputRef: state.bolle.eanInputRef
    
     };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GestioneBolla);