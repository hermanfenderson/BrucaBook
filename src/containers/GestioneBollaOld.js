import React from 'react';
import Measure from 'react-measure';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {storeMeasure} from '../actions';
import * as Actions from '../actions/bolle';
import {eanFocus, fillWithRow, updateCatalogAndFillForm} from '../actions/rigaBolla'
import {Row, Col} from 'react-bootstrap';

import FormRigaBolla from './FormRigaBolla';
import TableBolla from '../components/TableBolla';
import ModalGestioneItemCatalog from '../components/ModalGestioneItemCatalog';
import ModalSearching from '../components/ModalSearching';


import '../styles/app.css';
var bolla = null //Viene passsato come parametro
class GestioneBollaOld extends React.Component {
   

	

	componentDidMount() {
  
    bolla = this.props.params.id; //Arriva come prop da sopra

     this.props.actions.deletedRigaBolla(bolla);
    this.props.actions.addedRigaBolla(bolla);
    this.props.actions.totaliChanged(bolla); 
		this.props.actions.changedRigaBolla(bolla);	
  }
	
	componentWillUnmount() {
		this.props.actions.resetBolla(bolla);
		
	}


 
	
	
  editRow(row)
         { 
					 this.props.actions.setSelectedRigaBolla(row.key);
					 this.props.fillWithRowAction(row);
           this.props.eanFocusAction(); 
         }

 deleteRow = (row) => 
         {
           this.props.actions.deleteRigaBolla(bolla,row);
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
				<img src={this.props.activeImgUrl} alt="book-img" height="90%" width="90%"/>
 			</Col>
		  <Col sm={9}>	
      <FormRigaBolla bollaId={this.props.params.id} selectedRigaBollaValues={this.props.righeBollaArray[this.props.righeBollaArrayIndex[this.props.selectedRigaBolla]]}/>
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
				selectedRigaBolla={this.props.selectedRigaBolla}
				height={tableHeight} 
				dataFormat={ this.azioniFormatter } />
		   <ModalGestioneItemCatalog 
		    close={this.hideItemCatalogModal}
		    onSubmitAction={this.props.updateCatalogAndFillFormAction}
		    //Tutto da sistemare...
		    showModal={((this.props.catalog.status === "FAIL") || (this.props.catalog.status === "INCOMPLETE") )}
		   />
		   <ModalSearching
		    showModal={(this.props.catalog.status === "SEARCH")}
		   />
		  	</div>
      
     );
  }
}

//react-bs-container-body


function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
		 righeBollaArray: state.bolle.righeBollaArray,
		 righeBollaArrayIndex: state.bolle.righeBollaArrayIndex,
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
		fillWithRowAction: bindActionCreators(fillWithRow,dispatch),
		updateCatalogAndFillFormAction: bindActionCreators(updateCatalogAndFillForm,dispatch)
	
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GestioneBollaOld);
