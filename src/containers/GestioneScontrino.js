import React from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {storeMeasure} from '../actions';
import * as Actions from '../actions/scontrini';
import {eanFocus, fillWithRow, updateCatalogAndFillForm} from '../actions/rigaScontrino'
import {Grid, Row, Col, Button} from 'react-bootstrap';

import FormRigaScontrino from './FormRigaScontrino';
import TableScontrino from '../components/TableScontrino';
import {newScontrino} from '../actions/casse';


import '../styles/app.css';
var cassa = null //Viene passsato come parametro
var scontrino = null
class GestioneScontrino extends React.Component {
   

	newScontrino = () => {
		var newScontrino = this.props.newScontrinoAction(cassa, scontrino);
		this.props.actions.deletedRigaScontrino(cassa,newScontrino);
    this.props.actions.addedRigaScontrino(cassa,newScontrino);
    this.props.actions.totaliScontrinoChanged(cassa,newScontrino);
		this.props.actions.changedRigaScontrino(cassa,newScontrino);
    
	}
	
    
	componentDidMount() {
  
    cassa = this.props.params.idCassa; //Arriva come prop da sopra
    scontrino = this.props.params.idScontrino; //Arriva anche qui da sopra...
    
     this.props.actions.deletedRigaScontrino(cassa,scontrino);
    this.props.actions.addedRigaScontrino(cassa,scontrino);
    this.props.actions.totaliScontrinoChanged(cassa,scontrino);
		this.props.actions.changedRigaScontrino(cassa,scontrino);	
 
  }
	
	componentWillUnmount() {
		this.props.actions.resetScontrino(cassa, scontrino);
		
	}


 
	
	
  editRow(row)
         { 
					 this.props.actions.setSelectedRigaScontrino(row.key);
					 this.props.fillWithRowAction(row);
           this.props.eanFocusAction(); 
         }

 deleteRow = (row) => 
         {
           this.props.actions.deleteRigaScontrino(cassa, scontrino,row);
          this.props.eanFocusAction(); 
         }
 
	
  azioniFormatter = (cell, row) => {
  return (
        <div>
        <div className="glyphicon glyphicon-trash" onClick={() => { this.deleteRow(row)}}></div>
				<div className="glyphicon glyphicon-edit" onClick={() => { this.editRow(row)}} ></div>  
        </div>
        );
 }
 
 render() {
	 var shouldScroll = false;
	 var tableHeight = '100%'
	 if (this.props.measures['windowHeight']- 1.5 * this.props.measures['headerHeight']-this.props.measures['formScontrinoHeight'] > 0)
		  {
		  shouldScroll = true;		
			tableHeight = this.props.measures['windowHeight']- 1.5 * this.props.measures['headerHeight']-this.props.measures['formScontrinoHeight'];
			}
		
	 
    return (
			<div>
     	<Measure onMeasure={(dimensions) => {
          this.props.storeMeasureAction('formScontrinoHeight',dimensions.height);
          
        }}
      >
      <Grid>
	  <Col sm={2}>
				<img src={this.props.activeImgUrl} height="90%" width="90%"/>
 			</Col>
		  <Col sm={7}>	

      <FormRigaScontrino cassaId = {this.props.params.idCassa} scontrinoId = {this.props.params.idScontrino} selectedRigaScontrinoValues = {this.props.righeScontrinoArray[this.props.righeScontrinoArrayIndex[this.props.selectedRigaScontrino]]}/>


          </Col>
			<Col sm={1}>
				<Row> Copie: {this.props.totali.pezzi} </Row>
				<Row> Totale: {this.props.totali.prezzoTotale} </Row>
		 </Col>
			<Col sm={2}>
				<div>
    <Button onClick={this.newScontrino} bsStyle="primary" bsSize="small" block>Nuovo</Button>
    <Button bsSize="small" block>Chiudi</Button>
    <Button bsSize="small" block>Esci</Button>
  </div>
		 </Col>
		 	
		 </Grid>
   				</Measure>
  				
			<TableBolla 
				shouldScroll={shouldScroll} 
				willScroll={this.props.willScroll} 
				scrollAction={this.props.actions.tableScontrinoWillScroll} 
				data={this.props.righeScontrinoArray} 
				selectedRigaScontrino = {this.props.selectedRigaScontrino}
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
		 righeScontrinoArray: state.scontrini.righeScontrinoArray,
		 righeScontrinoArrayIndex: state.scontrini.righeScontrinoArrayIndex,
  	selectedRigaScontrino: state.scontrini.selectedRigaScontrino,
	        totali: state.scontrini.totali,
		measures: state.measures.measures,
		willScroll: state.scontrini.tableScontrinoWillScroll,
		catalog: state.catalog, //Mi consente di vedere in che condizione è la ricerca...e saperne il risultato
		activeImgUrl: state.form2.rigaScontrino.imgUrl
    
     };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
		storeMeasureAction: bindActionCreators(storeMeasure, dispatch),
		eanFocusAction: bindActionCreators(eanFocus,dispatch),
		fillWithRowAction: bindActionCreators(fillWithRow,dispatch),
		updateCatalogAndFillFormAction: bindActionCreators(updateCatalogAndFillForm,dispatch),
		newScontrinoAction: bindActionCreators(newScontrino,dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GestioneScontrino);
