import React from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

import FormRigaBolla from './FormRigaBolla';
import TableBolla from '../components/TableBolla';
import '../styles/app.css';
const bolla = 1; //Arriva come prop da sopra

class GestioneBolla extends React.Component {

  componentDidMount() {
     this.props.actions.deletedRigaBolla(bolla);
    this.props.actions.addedRigaBolla(bolla);
		this.props.actions.changedRigaBolla(bolla);	
  }
	
	
 
  editRow(row)
         { 
					 console.log(row);
					 this.props.actions.setSelectedRigaBolla(row);
           this.props.eanInputRef.focus(); 
         }

 deleteRow = (id) => 
         {
           this.props.actions.deleteRigaBolla(bolla,id);
           this.props.eanInputRef.focus(); //Metto il focus su EAN dopo la cancellazione
         }
 
  setTableRef = (tableRef) => {
    this.tableRef = tableRef;
  }
	
  azioniFormatter = (cell, row) => {
  return (
        <div>
        <div className="glyphicon glyphicon-trash" onClick={() => { this.deleteRow(row['key'])}}></div>
				<div className="glyphicon glyphicon-edit" onClick={() => { this.editRow(row)}} ></div>  
        </div>
        );
 }
 
 render() {
	 var shouldScroll = false;
	 var tableHeight = '100%'
	 if (this.props.measures['windowHeight']- 1.5 * this.props.measures['headerHeight']-this.props.measures['formBollaHeight'] > 0)
		  {
		  shouldScroll = true;		
			tableHeight = this.props.measures['windowHeight']- 1.5 * this.props.measures['headerHeight']-this.props.measures['formBollaHeight'];
			}
		
	 
    return (
      <div>
			<Measure onMeasure={(dimensions) => {
          this.props.actions.storeMeasure('formBollaHeight',dimensions.height);
          
        }}
      >
      <FormRigaBolla />
				</Measure>
			<TableBolla shouldScroll={shouldScroll} data={this.props.righeBollaArray} height={tableHeight} dataFormat={ this.azioniFormatter } setTableRef={this.setTableRef} />
			
       
     
           </div>
    );
  }
}

//react-bs-container-body


function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    righeBollaArray: state.bolle.righeBollaArray,
    eanInputRef: state.bolle.eanInputRef,
		selectedRigaBolla: state.bolle.selectedRigaBolla,
		measures: state.measures.measures
    
     };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GestioneBolla);