import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedTable';
import {Modal} from 'antd';



//E' un dato.... che passo come costante...
const header = [
				{dataField: 'dataInventario', label: 'Data inventario', width: '200px'},
			   {dataField: 'totali.pezzi', label: 'Pezzi', width: '200px'},
			    ];




class TableElencoInventari extends Component 
    {
    componentDidMount() {
     //Ascolto modifiche sulle bolle... non passo parametri...sono nella radice. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (this.props.listeningElencoInventari!=='')  this.props.listenElencoInventari("");
    		
	}
    
   
	
	
	
	deleteRow = (row) => {
	   const deleteInventario = () => {this.props.deleteInventario(this.props.period, row.key);};
	   if(row.totali && row.totali.pezzi + row.totali.gratis > 0)	Modal.confirm({
    		title: "L'Inventario non è vuota. Vuoi elminarlo?",
    		content: "L'Inventario non è vuota: se premi OK cancelli anche tutti i libri che contiene.",
    		okText: 'Si',
    		okType: 'danger',
    		cancelText: 'No',
    		onOk() {deleteInventario()
    			
    		},
    		onCancel() {
    		},});
    		
		//Gestisco la situazione che non sia vuota la bolla...
		else deleteInventario();
	}
	
	editRow = (row) => {
		this.props.setSelectedInventario(row);
	}
	
	selectRow = (row) => {
		this.props.setSelectedInventario(row); //Se faccio click in qualsiasi punto della riga... voglio inserire libri...
		this.props.setReadOnlyForm();
	}

    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteInventario']; //Non la passo liscia...
    	delete props['setSelectedInventario']; //Idem
    	  return(
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.selectRow} header={header}/>
			)}
    }		
	
export default TableElencoInventari;

