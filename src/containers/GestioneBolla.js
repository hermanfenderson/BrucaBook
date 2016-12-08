import React from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import {eanFocus, fillWithRow} from '../actions/rigaBolla'
import {Row, Col} from 'react-bootstrap';

import FormRigaBolla from './FormRigaBolla2';
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
					 this.props.actions.setSelectedRigaBolla(row);
					 this.props.fillWithRowAction(row);
           this.props.eanFocusAction(); 
         }

 deleteRow = (id) => 
         {
           this.props.actions.deleteRigaBolla(bolla,id);
          this.props.eanFocusAction(); 
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
			<div className="container">
       <Col sm={2}>
				<img src="https://img.ibs.it/images/9788807032073_0_0_180_0.jpg"/>
 			</Col>
		  <Col sm={9}>	
      <FormRigaBolla/>
			</Col>
			<Col sm={1}>
				<Row> Copie: 23 </Row>
				<Row> Gratis: 12 </Row>
				<Row> Totale: 323,70 </Row>
		 </Col>
     </div>
				</Measure>
			<TableBolla shouldScroll={shouldScroll} willScroll={this.props.willScroll} scrollAction={this.props.actions.tableBollaWillScroll} data={this.props.righeBollaArray} height={tableHeight} dataFormat={ this.azioniFormatter } />
			</div>
      
     );
  }
}

//react-bs-container-body


function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
		 righeBollaArray: state.bolle.righeBollaArray,
  	selectedRigaBolla: state.bolle.selectedRigaBolla,
		measures: state.measures.measures,
		willScroll: state.bolle.tableBollaWillScroll
    
     };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
		eanFocusAction: bindActionCreators(eanFocus,dispatch),
		fillWithRowAction: bindActionCreators(fillWithRow,dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GestioneBolla);