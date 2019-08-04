import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedTable';
import {Modal} from 'antd' 
import {withRouter} from 'react-router-dom'



class TableClienti extends Component 
    {
    componentDidMount() {
     //Ascolto modifiche sulle bolle... non passo parametri...sono nella radice. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (this.props.listeningClienti!=='')  this.props.listenClienti("");
    		
	}
    
   
	
	deleteRow = (row) => {
	   const deleteCli = () => {this.props.deleteCliente(null, row.key);};
	   Modal.confirm({
    		title: 'Confermi cancellazione cliente?',
    		content: 'Se premi OK cancelli anche tutti gli ordini di questo cliente.',
    		okText: 'Si',
    		okType: 'danger',
    		cancelText: 'No',
    		onOk() {deleteCli()
    			
    		},
    		onCancel() {
    		},});
    		
	}
	

	
	editRow = (row) => {
		this.props.setSelectedCliente(row);
	}
	
selectRow = (row) => {
		this.props.setSelectedCliente(row); //Se faccio click in qualsiasi punto della riga... voglio inserire libri...
		this.props.setReadOnlyForm();
		this.props.history.push('/ordini/' + row.key);
	}


    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteCliente']; //Non la passo liscia...
    	delete props['setSelectedCliente']; //Idem
    	  return(
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.selectRow} header={this.props.geometry.header}/>
			)}
    }		
	
export default withRouter(TableClienti);

