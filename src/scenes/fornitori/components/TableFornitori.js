import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedTable';
import {Modal} from 'antd';


//E' un dato.... che passo come costante...
const header = [
				{dataField: 'nome', label: 'Nome', width: '400px'},
				
			    ];




class TableFornitori extends Component 
    {
    componentDidMount() {
     //Ascolto modifiche sulle bolle... non passo parametri...sono nella radice. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (this.props.listeningFornitori!=='')  this.props.listenFornitori("");
    		
	}
    
   
	
	
	
	deleteRow = (row) => {
	  this.props.deleteFornitori(null, row.key);
	}
	
	editRow = (row) => {
		this.props.setSelectedFornitore(row);
	}
	


    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteFornitore']; //Non la passo liscia...
    	delete props['setSelectedFornitore']; //Idem
    	  return(
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default TableFornitori;

