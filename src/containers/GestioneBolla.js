import React from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {storeMeasure} from '../actions';
import * as Actions from '../actions/bolle';
import {eanFocus, fillWithRow} from '../actions/rigaBolla'
import {Row, Col} from 'react-bootstrap';

import FormRigaBolla from './FormRigaBolla';
import TableBolla from '../components/TableBolla';
import '../styles/app.css';
var bolla = null //Viene passsato come parametro

class GestioneBolla extends React.Component {
	componentDidMount() {
    bolla = this.props.params.id; //Arriva come prop da sopra

     this.props.actions.deletedRigaBolla(bolla);
    this.props.actions.addedRigaBolla(bolla);
    this.props.actions.totaliChanged(bolla);
		this.props.actions.changedRigaBolla(bolla);	
  }
	
	componentWillUnmount() {
		this.props.actions.resetBolla();
		
	}


 
	
	
  editRow(row)
         { 
					 this.props.actions.setSelectedRigaBolla(row.key);
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
          this.props.storeMeasureAction('formBollaHeight',dimensions.height);
          
        }}
      >
			<div className="container">
       <Col sm={2}>
				<img src={this.props.activeImgUrl} height="90%" width="90%"/>
 			</Col>
		  <Col sm={9}>	
      <FormRigaBolla selectedRigaBolla = {this.props.selectedRigaBolla}/>
			</Col>
			<Col sm={1}>
				<Row> Copie: {this.props.totali.pezzi} </Row>
				<Row> Gratis:  {this.props.totali.gratis} </Row>
				<Row> Totale: {this.props.totali.prezzoTotale} </Row>
		 </Col>
     </div>
				</Measure>
			<TableBolla 
				shouldScroll={shouldScroll} 
				willScroll={this.props.willScroll} 
				scrollAction={this.props.actions.tableBollaWillScroll} 
				data={this.props.righeBollaArray} 
				selectedRigaBolla = {this.props.selectedRigaBolla}
				height={tableHeight} 
				dataFormat={ this.azioniFormatter } />
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
	        totali: state.bolle.totali,
		measures: state.measures.measures,
		willScroll: state.bolle.tableBollaWillScroll,
		catalog: state.catalog, //Mi consente di vedere in che condizione è la ricerca...e saperne il risultato
		activeImgUrl: state.form2.rigaBolla.imgUrl
    
     };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
		storeMeasureAction: bindActionCreators(storeMeasure, dispatch),
		eanFocusAction: bindActionCreators(eanFocus,dispatch),
		fillWithRowAction: bindActionCreators(fillWithRow,dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GestioneBolla);
