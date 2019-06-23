import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import { withRouter } from 'react-router-dom';
import {Icon, Popover, Modal} from 'antd';
import moment from 'moment';

//Per gestire in modo smmooth il ricaricamento!

class OrdiniModalTable extends Component 
    {
    
	
	
	detailRow = (row) => {
    	console.log(row);
    }
    
   

	
	
    
    	render() { 
    
    	let props = {...this.props};
    	let header = this.props.geometry.ordiniModalHeader;
    		let customRowRender = {
    		    'dataOrdine' : (text, record, index) => { return(<div> {moment(text).format("DD/MM/YYYY")}</div>)},
    		  	'cliente' : (text, record, index) => 
    		 				{let cliente = this.props.clienti[text]; 
    		 				const contatto = (<div><p>Email: {cliente.email}  </p> <p>Tel: {cliente.telefono}</p></div>);
							return(<Popover title="Contatto" content={contatto}><Icon type="user" />{cliente.nome} {cliente.cognome}</Popover>)},
    		 	}
    		return(
    	   	<Modal visibile={(this.props.ordiniModalVisible!==null)}>
    	   	<WrappedTable {...props} size={'small'}    detailRow={ this.detailRow } header={header} customRowRender={customRowRender}/>
			
    	   	<div>Ciao!</div>
    	   	</Modal>
			)}
    }		
	
export default withRouter(OrdiniModalTable);