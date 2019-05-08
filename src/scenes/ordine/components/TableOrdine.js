import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import { withRouter } from 'react-router-dom';
import {Icon, Popover} from 'antd';

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
	  let params = [];
      params.push(this.props.cliente);
      	params.push(this.props.idOrdine);
      this.props.offListenRigaOrdine(params, this.props.listenersItemOrdine); //Voglio la garanzia di smettere di ascoltare solo qui gli ordini aperti
    	this.props.resetTableOrdine();
	 }
   
	componentDidUpdate(oldProps) {
    if (oldProps.idOrdine !== this.props.idOrdine)
    	{
    		 let oldParams = [];
      oldParams.push(oldProps.cliente);
      	oldParams.push(oldProps.idOrdine);
      this.props.offListenRigaOrdine(oldParams); 
    	this.props.resetTableOrdine();
    	let params = [];
    	    params.push(this.props.cliente);
    	  	params.push(this.props.idOrdine);
    	   	this.props.listenRigaOrdine(params); 
    	}
	}
	
	
	deleteRow = (row) => {
		 let params = [];
    	    params.push(row.cliente);
		params.push(row.ordine);
		this.props.deleteRigaOrdine(params,row.key,row);
	}
	
	editRow = (row) => {
		 let params = [];
    	    params.push(this.props.cliente);
    	  params.push(this.props.idOrdine);
		this.props.setSelectedRigaOrdine(row);
	}
	
	detailRow = (row) => {
    	this.props.history.push('/ordine/'+row.cliente+'/'+row.ordine);
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
    	let header = this.props.ordiniAperti? this.props.geometry.headerOA: this.props.geometry.header;
    		let customRowRender = {
    		
    		 	'titolo' : (text, record, index) => { return(<div style={{width: header[1].width-10, whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis'}}> {text}</div>)},
    		 	'stato' : (text, record, index) => { return(<div> {this.props.statoRigaOrdine[text]}</div>)},
    		 		'cliente' : (text, record, index) => 
    		 				{let cliente = this.props.clienti[text]; 
    		 				const contatto = (<div><p>Email: {cliente.email}  </p> <p>Tel: {cliente.telefono}</p></div>);
							return(<Popover title="Contatto" content={contatto}><Icon type="user" />{cliente.nome} {cliente.cognome}</Popover>)},
    		 	}

    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaOrdine']; //Non la passo liscia...
    	delete props['setSelectedRigaOrdine']; //Idem
    	  return(
			<WrappedTable {...props} size={'small'} sorterFunc={this.sorterFunc} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} detailRow={(this.props.ordiniAperti) ? this.detailRow : null} header={header} customRowRender={customRowRender}/>
			)}
    }		
	
export default withRouter(TableOrdine);

