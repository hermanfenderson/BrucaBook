import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedVirtualizedTable'
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
	
	

    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaBolla']; //Non la passo liscia...
    	delete props['setSelectedRigaBolla']; //Idem
    	let height = props.geometry.tableCoors.height;
    	let width = props.geometry.tableCoors.width;
    	
    	  return(
			<WrappedTable {...props} height={height} width={width} size={'small'}  highlightedRowKey={selectedItemKey} ordiniRow={this.ordiniRow} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={this.props.geometry.header} />
			)}
    }		
	
export default TableBolla;

