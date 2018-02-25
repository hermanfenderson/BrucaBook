import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import TableDettagliResa from './TableDettagliResa'
import ModalDettagli from '../containers/ModalDettagli'
import {getDetailsInMatrix} from '../../../helpers/form'


//E' un dato.... che passo come costante...
const header = [{dataField: 'values.ean', label: 'EAN', width: '160px'},
                {dataField: 'values.titolo', label: 'Titolo', width: '310px'},
                {dataField: 'values.autore', label: 'Autore', width: '270px'},
			    
			    {dataField: 'values.prezzoListino', label: 'Listino', width: '90px'},
			    {dataField: 'values.stock', label: 'Stock*', width: '70px'},
			    {dataField: 'values.resi', label: 'Resi', width: '70px'},
			    
			   ];
			   

var currentListenedIdResa = null;

//Per gestire in modo smmooth il ricaricamento!

class TableOpenResa extends Component 
    {
    componentDidMount() {
    	if (this.props.listeningItemResa) currentListenedIdResa = this.props.listeningItemResa[2];   
    		//Ascolto modifiche sulle righe della Resa
    	if (currentListenedIdResa !== this.props.idResa)
    	   {
    	   	if (currentListenedIdResa) 
    	   		{
    	   			let params = [...this.props.period];
    	   			params.push(currentListenedIdResa);
    
    	   			this.props.offListenRigaResa(params); 
    	   			this.props.resetTableResa();
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	let params = [...this.props.period];
    	   	params.push(this.props.idResa);
    	   	this.props.listenRigaResa(params); 
    	   	}
    this.props.setActiveModal(false);	   //Evita crash quando torno...	
	}
	
	headerEAN = {};
	matrixEAN = {};
	
	detailRow = (record) => {
							this.matrixEAN = getDetailsInMatrix(this.props.dettagliEAN[record.values.ean]);
		                    this.headerEAN = {titolo: record.values.titolo, autore: record.values.autore, pezzi: this.matrixEAN.totale.totali.stock};
		                    this.props.setActiveModal(true);
		                    
							}

	expandedRowRender = (record) => {return(<TableDettagliResa testataResa={this.props.testataResa} listeningItemResa={this.props.listeningItemResa} deleteRigaResa={this.props.deleteRigaResa} submitEditedItem={this.props.submitEditedItem} changeEditedItem={this.props.changeEditedItem} righeDettagli={this.props.tabelleRigheEAN[record.values.ean]} righeResa={this.props.righeResa} />)}


    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaResa']; //Non la passo liscia...
    	delete props['setSelectedRigaResa']; //Idem
    	  return(
    	  	<div>
    	  	<ModalDettagli headerEAN={this.headerEAN} matrixEAN={this.matrixEAN}/>
			<WrappedTable {...props} 
			data={this.props.tabellaEAN}
			expandedRowRender={this.expandedRowRender} 
			highlightedRowKey={selectedItemKey} 
			detailRow={this.detailRow}
			header={header}/>
			</div>
			)}
    }		
	
export default TableOpenResa;

