import React, {Component} from 'react';
import {Popover, Icon} from 'antd';
import WrappedTable from '../../../components/WrappedTable';
import moment from 'moment';






class TableOrdiniAperti extends Component 
    {
    	
    
    componentDidMount = () => {
   	}
	
	
	componentWillUnmount = () => {
  					
	}
	
	

    
    	render() { 
    	let props = {...this.props};
    	let customRowRender = {
    		
    		 	
    		 	'stato' : (text, record, index) => { return(<div> {this.props.statoRigaOrdine[text]}</div>)},
    		 		'dataOrdine' : (text, record, index) => { return(<div> {moment(text).format('DD/MM/YYYY')}</div>)},
    		   
    		     'cliente' : (text, record, index) => 
    		 				{if (text) 
    		 					{let cliente = this.props.clienti[text]; 
    		 					const contatto = (<div><p>Email: {cliente.email}  </p> <p>Tel: {cliente.telefono}</p></div>);
								return(<Popover title="Contatto" content={contatto}><Icon type="user" />{cliente.nome} {cliente.cognome}</Popover>)
    		 					}
    		 				else return("Vendita libera")	
    		 				},
    		
    			
    		}

    		  return(
			<WrappedTable {...props} header={this.props.geometry.header} customRowRender={customRowRender}/>
			)}
    }		
	
export default TableOrdiniAperti;

