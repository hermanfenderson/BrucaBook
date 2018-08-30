import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedTable';


//E' un dato.... che passo come costante...
const header = [
				{dataField: 'nome', label: 'Nome', width: '400px'},
				
			    ];




class TableCategorie extends Component 
    {
    componentDidMount() {
     //Ascolto modifiche sulle bolle... non passo parametri...sono nella radice. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (this.props.listeningCategorie!=='')  this.props.listenCategorie("");
    		
	}
    
   
	
	
	
	deleteRow = (row) => {
	  this.props.deleteCategoria(null, row.key);
	}
	
	editRow = (row) => {
		this.props.setSelectedCategoria(row);
	}
	


    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteCategoria']; //Non la passo liscia...
    	delete props['setSelectedCategoria']; //Idem
    	  return(
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default TableCategorie;

