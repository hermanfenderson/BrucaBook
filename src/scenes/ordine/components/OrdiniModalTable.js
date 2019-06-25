import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import { withRouter } from 'react-router-dom';
import {Icon, Popover, Modal} from 'antd';
import moment from 'moment';

//Per gestire in modo smmooth il ricaricamento!

class OrdiniModalTable extends Component 
    {
    
	
	closeOrdiniModal = () => {this.props.setOrdiniModalVisible(null)}
   
	detailRow = (row) => {
		    this.closeOrdiniModal();
    		this.props.history.push('/ordine/' + row.cliente + '/' + row.ordine);

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
    		<Modal
    		onCancel={this.closeOrdiniModal}
          title="Ordini cliente"
          footer={null}
        visible={(this.props.ordiniModalVisible!==null)}
        >
           	<WrappedTable {...props} size={'small'}   detailRow={ this.detailRow } header={header} customRowRender={customRowRender}/>
		
        </Modal>	
    	   
			)}
    }		
	
export default withRouter(OrdiniModalTable);