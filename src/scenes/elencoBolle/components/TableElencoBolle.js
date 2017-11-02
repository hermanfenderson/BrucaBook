import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'


//E' un dato.... che passo come costante...
const header = [{dataField: 'riferimento', label: 'Rif.', width: '150px'},
			    {dataField: 'fornitore', label: 'Fornitore', width: '300px'},
			    {dataField: 'dataDocumento', label: 'Data Doc', width: '200px'},
			    {dataField: 'dataCarico', label: 'Data Carico', width: '200px'}
			   ];


class TableBolla extends Component 
    {
    componentDidMount() {
    	//Ascolto modifiche sulle bolle... non passo parametri...sono nella radice
    	this.props.listenBolla(); 
	}
	
	componentWillUnmount() {
		//Smetto di ascoltare...
		this.props.offListenBolla(); 
		
		
	}
	
	deleteRow = (row) => {
		this.props.deleteBolla({'itemId':row.key});
	}
	
	editRow = (row) => {
		this.props.setSelectedBolla(row);
	}
	
	selectRow = (row) => {
		this.props.setSelectedBolla(row); //Se faccio click in qualsiasi punto della riga... voglio inserire libri...
		this.props.setReadOnlyForm();
	}

    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteBolla']; //Non la passo liscia...
    	delete props['setSelectedBolla']; //Idem
    	  return(
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.selectRow} header={header}/>
			)}
    }		
	
export default TableBolla;

