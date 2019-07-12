import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedTable';
import {Modal} from 'antd';

import {withRouter} from 'react-router-dom'






class TableElencoInventari extends Component 
    {
    componentDidMount() {
     //Ascolto modifiche sulle bolle... non passo parametri...sono nella radice. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	this.props.listenElencoInventari("");
    		
	}
    
    componentWillUnmount() {
       this.props.offListenElencoInventari("");
       this.props.resetTable();
    }
   
	
	
	
	deleteRow = (row) => {
	   const deleteInventario = () => {this.props.deleteInventario(null, row.key);};
	   if(row.totali && row.totali.righe > 0)	Modal.confirm({
    		title: "L'Inventario non è vuota. Vuoi elminarlo?",
    		content: "L'Inventario non è vuoto: se premi OK cancelli anche tutti i libri che contiene.",
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
	
	saveRow = (row) => {
		this.props.saveInventario(row.key);
	}
	
	selectRow = (row) => {
		this.props.setSelectedInventario(row); //Se faccio click in qualsiasi punto della riga... voglio inserire libri...
		this.props.setReadOnlyForm();
		this.props.history.push('/inventario/' + row.key);
	}

    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteInventario']; //Non la passo liscia...
    	delete props['setSelectedInventario']; //Idem
    	  return(
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} saveRow={this.saveRow} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.selectRow} header={this.props.header}/>
			)}
    }		
	
export default withRouter(TableElencoInventari);

