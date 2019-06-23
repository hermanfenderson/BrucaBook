import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import OrdiniModalTable from '../../ordine/containers/OrdiniModalTable'

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
	
	ordiniRow = (row,action=false) => {
		if (!action) return(row.ordini);
		this.props.setOrdiniModalVisible(row.ordini);
		
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
    		let customRowRender = {

    		 	'titolo' : (text, record, index) => { return(<div style={{width: this.props.geometry.header[1].width-10, whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis'}}> {text}</div>)}}

    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaBolla']; //Non la passo liscia...
    	delete props['setSelectedRigaBolla']; //Idem
    	  return(
			<WrappedTable {...props} size={'small'} sorterFunc={this.sorterFunc} highlightedRowKey={selectedItemKey} ordiniRow={this.ordiniRow} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={this.props.geometry.header} customRowRender={customRowRender}/>
			)}
    }		
	
export default TableBolla;

