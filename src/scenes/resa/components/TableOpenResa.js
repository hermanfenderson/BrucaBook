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

	//expandedRowRender = (record) => {return(<TableDettagliResa testataResa={this.props.testataResa} listeningItemResa={this.props.listeningItemResa} deleteRigaResa={this.props.deleteRigaResa} submitEditedItem={this.props.submitEditedItem} changeEditedItem={this.props.changeEditedItem} righeDettagli={this.props.tabelleRigheEAN[record.values.ean]} righeResa={this.props.righeResa} />)}
expandedRowRender = (ean) => {return(<TableDettagliResa testataResa={this.props.testataResa} listeningItemResa={this.props.listeningItemResa} deleteRigaResa={this.props.deleteRigaResa} submitEditedItem={this.props.submitEditedItem} changeEditedItem={this.props.changeEditedItem} righeDettagli={this.props.tabelleRigheEAN[ean]} righeResa={this.props.righeResa} />)}

    
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
			subTablesHeight={(ean) => {return((props.tabelleRigheEAN[ean].length+1)*30)}}
			
			subTablesRender={this.expandedRowRender}
			header={props.geometry.headerOpen}/>
			</div>
			)}
    }		
	
export default TableOpenResa;

