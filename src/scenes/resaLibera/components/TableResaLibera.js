import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedVirtualizedTable'


var currentListenedIdResa = null;

//Per gestire in modo smmooth il ricaricamento!

class TableResaLibera extends Component 
    {
    componentDidMount() {
    	 	let params = [...this.props.period];
    	   	params.push(this.props.idResa);
    	   	this.props.listenRigaResa(params); 
    	   
 
	}
	
	 componentWillUnmount() {
	 	let params = [...this.props.period];
    	params.push(this.props.idResa);
    	this.props.offListenRigaResa(params); 
    	this.props.resetTableResa();
   	 }	
   	 
    
	
	
	
	
	deleteRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.idResa);
		this.props.deleteRigaResa(params,row.key,row);
	}
	
	editRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.idResa);
		this.props.setSelectedRigaResa(row);
	}
	
	


    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaResa']; //Non la passo liscia...
    	delete props['setSelectedRigaResa']; //Idem
    		let height = props.geometry.tableCoors.height;
    	let width = props.geometry.tableCoors.width;
    	
    	  return(
			<WrappedTable {...props}
			height={height} 
			width={width} 
			
			highlightedRowKey={selectedItemKey} 
			editRow={this.editRow} 
			deleteRow={this.deleteRow} 
			selectRow={this.editRow} 
			header={this.props.geometry.header} />
			)}
    	  
    }		
	
export default TableResaLibera;

