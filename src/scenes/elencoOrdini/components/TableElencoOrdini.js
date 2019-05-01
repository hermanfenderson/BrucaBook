import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedTable';
import {withRouter} from 'react-router-dom'

import {isEqual} from '../../../helpers/form';
import {Modal} from 'antd';






class TableElencoOrdini extends Component 
    {
    	
    
    componentDidMount = () => {
      if (this.props.match.params.cliente) this.props.listenOrdine(this.props.match.params.cliente);
	}
	
	
	componentWillUnmount = () => {
		if (this.props.match.params.cliente) this.props.offListenOrdine(this.props.match.params.cliente);
    	this.props.resetTable();
    					
	}
	
	
	deleteRow = (row) => {
	   const deleteOrdine = () => {this.props.deleteOrdine(this.props.match.params.cliente, row.key, row);};
	   Modal.confirm({
    		title: 'Conferma cancellazione ordine?',
    		content: 'Se premi OK cancelli anche tutte le righe.',
    		okText: 'Si',
    		okType: 'danger',
    		cancelText: 'No',
    		onOk() {deleteOrdine()
    			
    		},
    		onCancel() {
    		},});
    		
		//Gestisco la situazione che non sia vuota la bolla...
		}
	
	editRow = (row) => {
		this.props.setSelectedOrdine(row);
	}
	
	selectRow = (row) => {
		this.props.setSelectedOrdine(row); //Se faccio click in qualsiasi punto della riga... voglio inserire libri...
		this.props.setReadOnlyForm();
		this.props.history.push('/ordine/' + this.props.match.params.cliente + '/' + row.key);
	}

    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteOrdine']; //Non la passo liscia...
    	delete props['setSelectedOrdine']; //Idem
    	  return(
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.selectRow} header={this.props.geometry.header}/>
			)}
    }		
	
export default withRouter(TableElencoOrdini);

