import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'

//E' un dato.... che passo come costante...
const header = [{dataField: 'ean', label: 'EAN', width: '120px'},
                {dataField: 'titolo', label: 'Titolo', width: '360px'},
			    {dataField: 'prezzoUnitario', label: 'Prezzo', width: '60px'},
			    {dataField: 'pezzi', label: 'Q.tà', width: '60px'},
			    {dataField: 'gratis', label: 'Gratis', width: '60px'},
			    {dataField: 'prezzoTotale', label: 'Totale', width: '70px'}
			   ];


//Per gestire in modo smmooth il ricaricamento!

class TableBolla extends Component 
    {
    componentDidMount() {
    	 	let params = [...this.props.period];
    	   	params.push(this.props.idBolla);
    	   	this.props.listenRigaBolla(params); 
	}
	
	 componentWillUnmount() {
	 	console.log("smonto");
	 	let params = [...this.props.period];
    	params.push(this.props.idBolla);
    	this.props.offListenRigaBolla(params); 
    	this.props.resetTableBolla();
	 }
   
	
	
	deleteRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.idBolla);
		this.props.deleteRigaBolla(params,row.key,row);
	}
	
	editRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.idBolla);
		this.props.setSelectedRigaBolla(row);
	}
	
	sorterFunc = (header) => {
	 if (header.dataField==='ean') 
		return(function(b, a) { return(a.ean-b.ean)});
	 if (header.dataField==='titolo') 
		return(function(b, a) { return(a.titolo.localeCompare(b.titolo))});
	return(false);
	};

    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaBolla']; //Non la passo liscia...
    	delete props['setSelectedRigaBolla']; //Idem
    	  return(
			<WrappedTable {...props} size={'small'} sorterFunc={this.sorterFunc} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header} />
			)}
    }		
	
export default TableBolla;

