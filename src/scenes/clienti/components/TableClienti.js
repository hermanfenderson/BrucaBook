import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedTable';
import {withRouter} from 'react-router-dom'


//E' un dato.... che passo come costante...
const header = [
				{dataField: 'nome', label: 'Nome', width: '200px'},
			    	{dataField: 'cognome', label: 'Cognome', width: '200px'},
				{dataField: 'email', label: 'email', width: '200px'},
				{dataField: 'telefono', label: 'telefono', width: '200px'},
				
			    ];




class TableClienti extends Component 
    {
    componentDidMount() {
     //Ascolto modifiche sulle bolle... non passo parametri...sono nella radice. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (this.props.listeningClienti!=='')  this.props.listenClienti("");
    		
	}
    
   
	
	
	
	deleteRow = (row) => {
	  this.props.deleteCliente(null, row.key);
	}
	
	editRow = (row) => {
		this.props.setSelectedCliente(row);
	}
	
selectRow = (row) => {
		this.props.setSelectedCliente(row); //Se faccio click in qualsiasi punto della riga... voglio inserire libri...
		this.props.setReadOnlyForm();
		this.props.history.push('/ordiniCliente/' + row.key);
	}


    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteCliente']; //Non la passo liscia...
    	delete props['setSelectedCliente']; //Idem
    	  return(
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.selectRow} header={this.props.geometry.header}/>
			)}
    }		
	
export default withRouter(TableClienti);

