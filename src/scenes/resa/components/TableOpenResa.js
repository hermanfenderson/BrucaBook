import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedVirtualizedTable'
import TableDettagliResa from './TableDettagliResa'
import ModalDettagli from '../containers/ModalDettagli'


			   

//var currentListenedIdResa = null;

//Per gestire in modo smmooth il ricaricamento!

class TableOpenResa extends Component 
    {
  
	detailRow = (record) => {
		                  
						    //let matrixEAN = getDetailsInMatrix(this.props.dettagliEAN[record.values.ean]);
		                   // let headerEAN = {ean: record.values.ean, titolo: record.values.titolo, autore: record.values.autore, imgFirebaseUrl: record.values.imgFirebaseUrl, pezzi: matrixEAN.totale.totali.stock};
		                    let headerEAN = {ean: record.values.ean, titolo: record.values.titolo, autore: record.values.autore, imgFirebaseUrl: record.values.imgFirebaseUrl, pezzi: this.props.stock[record.values.ean]};
		                    this.props.showModalDetails(headerEAN);
		                    //this.props.setModalDetails(matrixEAN, headerEAN)
		                    //this.props.setActiveModal(true);
		                    //this.props.setPeriodResa([null, null]);
		                    
							}
subTablesHeight = (ean) => {return(10+(this.props.tabelleRigheEAN[ean].length+1)*30)};

	//expandedRowRender = (record) => {return(<TableDettagliResa testataResa={this.props.testataResa} listeningItemResa={this.props.listeningItemResa} deleteRigaResa={this.props.deleteRigaResa} submitEditedItem={this.props.submitEditedItem} changeEditedItem={this.props.changeEditedItem} righeDettagli={this.props.tabelleRigheEAN[record.values.ean]} righeResa={this.props.righeResa} />)}
expandedRowRender = (ean) => {return(<TableDettagliResa width={this.props.geometry.tableCoors.width} height={this.subTablesHeight(ean)}
			 getMagazzinoItem={this.props.getMagazzinoItem} testataResa={this.props.testataResa} listeningItemResa={this.props.listeningItemResa} deleteRigaResa={this.props.deleteRigaResa} getRigaBolla={this.props.getRigaBolla}  submitEditedItem={this.props.submitEditedItem} changeEditedItem={this.props.changeEditedItem} righeDettagli={this.props.tabelleRigheEAN[ean]} righeResa={this.props.righeResa} geometry={this.props.geometry} />)}
//Serve a filtrare fuori i record con stock a zero se il bottone è premuto

customFilterFunc = (record, filters) => {
   		let good = true;
   			for (var prop in filters)
	  			{	
	  				
   					//Se il filtro noZeroStock che è l'esito del bottone è true
   				if (filters['noZeroStock']) 
   					{
   		    		if (record.values.stock <= 0) 	good = false;
   					}
   				if (!good) break;	
   				if (prop !== 'noZeroStock')
   					
   					{  let regex = new RegExp(filters[prop],'i');
	  				
	  					if (filters[prop] && (record.values[prop]!==undefined) && (!record.values[prop].match(regex))) good = false;
	  					if (filters[prop] && ((record.values[prop]===undefined) || record.values[prop].length===0)) good = false;
	  				}
   			        
   				}
	    return (good ? {...record} : null) 
   }

    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteRigaResa']; //Non la passo liscia...
    	delete props['setSelectedRigaResa']; //Idem
    	return(
    	  	<div>
    	  	<ModalDettagli headerEAN={this.props.headerEAN} matrixEAN={this.props.matrixEAN}/>
			<WrappedTable {...props} 
			data={this.props.tabellaEAN}
			expandedRowRender={this.expandedRowRender} 
			highlightedRowKey={selectedItemKey} 
			detailRow={this.detailRow}
			height={props.geometry.tableCoors.height}
			width={props.geometry.tableCoors.width}
			subTables={props.tabelleRigheEAN}
			subTablesHeight={this.subTablesHeight}
			filters={this.props.filters}
			customFilterFunc={this.customFilterFunc}
			subTablesRender={this.expandedRowRender}
			header={props.geometry.headerOpen}/>
			</div>
			)}
    }		
	
export default TableOpenResa;

