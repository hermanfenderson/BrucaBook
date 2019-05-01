import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'


//Per gestire in modo smmooth il ricaricamento!

class TableOrdine extends Component 
    {
    componentDidMount() {
    	    let params = [];
    	    params.push(this.props.cliente);
    	  	params.push(this.props.idOrdine);
    	   	this.props.listenRigaOrdine(params); 
	}
	
	 componentWillUnmount() {
	 	console.log("smonto");
	  let params = [];
      params.push(this.props.cliente);
      this.props.offListenRigaOrdine(params); 
    	this.props.resetTableOrdine();
	 }
   
	
	
	deleteRow = (row) => {
		 let params = [];
    	    params.push(this.props.cliente);
		params.push(this.props.idOrdine);
		this.props.deleteRigaOrdine(params,row.key,row);
	}
	
	editRow = (row) => {
		 let params = [];
    	    params.push(this.props.cliente);
    	  params.push(this.props.idOrdine);
		this.props.setSelectedRigaOrdine(row);
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
    		
    		 	'titolo' : (text, record, index) => { return(<div style={{width: this.props.geometry.header[1].width-10, whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis'}}> {text}</div>)},
    		 	'stato' : (text, record, index) => { return(<div> {this.props.statoRigaOrdine[text]}</div>)},
    		 	
    			
    			
    		}

    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaOrdine']; //Non la passo liscia...
    	delete props['setSelectedRigaOrdine']; //Idem
    	  return(
			<WrappedTable {...props} size={'small'} sorterFunc={this.sorterFunc} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={this.props.geometry.header} customRowRender={customRowRender}/>
			)}
    }		
	
export default TableOrdine;

