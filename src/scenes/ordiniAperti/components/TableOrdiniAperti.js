import React, {Component} from 'react';
import {Popover, Icon} from 'antd';
import WrappedTable from '../../../components/WrappedTable';
import moment from 'moment';
import SubInput from '../../../components/SubInput';





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
    		 	'pezziDelta' : (text, record, index) => 
    		 				{   
    		 					const onChangeDeltaPezzi = (value) => {this.props.changeDeltaPezzi(index,value)}
   
    		 					return(<SubInput value={text} onSubmit={this.props.onSubmit} onChange={onChangeDeltaPezzi} errorMessage={(this.props.errors.eanArrayErrors[index]) ? this.props.errors.eanArrayErrors[index].error : ''}/>)
    		 				}
    		
    			
    		}

    		  return(
    		  	<div>
			<WrappedTable {...props} header={this.props.geometry.header} customRowRender={customRowRender}/>
				 <p style={(this.props.errors.generalError) ? {color:'red'} : {}}>{(this.props.errors.generalError) ? this.props.errors.generalError : "Premi OK per confermare l'associazione cliente-quantità (totale pezzi " + this.props.qty+")"}</p>
				 </div>
  
			
			)}
    }		
	
export default TableOrdiniAperti;

