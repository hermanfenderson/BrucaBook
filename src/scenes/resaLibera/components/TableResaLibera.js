import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'



var currentListenedIdResa = null;

//Per gestire in modo smmooth il ricaricamento!

class TableResaLibera extends Component 
    {
    componentDidMount() {
    	if (this.props.listeningItemResa) currentListenedIdResa = this.props.listeningItemResa[2];   
    		//Ascolto modifiche sulle righe della Resa
    	if (currentListenedIdResa !== this.props.idResa)
    	   {
    	   	if (currentListenedIdResa) 
    	   		{
    	   			let params = [...this.props.period];
    	   			params.push(currentListenedIdResa);
    
    	   			this.props.offListenRigaResa(params); 
    	   			this.props.resetTableResa();
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	let params = [...this.props.period];
    	   	params.push(this.props.idResa);
    	   	this.props.listenRigaResa(params); 
    	   	}
    	   	
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
	
	
	sorterFunc = (header) => {
	 if (header.dataField==='ean') 
		return(function(b, a) { return(a.ean-b.ean)});
	 if (header.dataField==='titolo') 
		return(function(b, a) { return(a.titolo.localeCompare(b.titolo))});
	 if (header.dataField==='editore') 
		return(function(b, a) { return(a.editore.localeCompare(b.editore))});
	
	return(false);
	};


    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	let customRowRender = {

    		 	'titolo' : (text, record, index) => { return(<div style={{width: this.props.geometry.header[1].width-10, whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis'}}> {text}</div>)}}

    	delete props['deleteRigaResa']; //Non la passo liscia...
    	delete props['setSelectedRigaResa']; //Idem
    	  return(
			<WrappedTable {...props} sorterFunc={this.sorterFunc} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={this.props.geometry.header} customRowRender={customRowRender}/>
			)}
    }		
	
export default TableResaLibera;

