import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedVirtualizedTable';
import {withRouter} from 'react-router-dom'

import {isEqual} from '../../../helpers/form';
import {Modal} from 'antd';
import {period2month} from '../../../helpers/form'






class TableElencoRese extends Component 
    {
    periodMount = () => {
  if (this.props.period)
    {
     	var currentListened = this.props.listeningPeriod;
    		//Ascolto modifiche sulle bolle... devo passare anno (voglio sentire un anno intero per ora. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (!currentListened) 
    		{   	
    			this.props.listenResa(this.props.period);
    		}
    	else 
    		{
    			if (!isEqual(currentListened,this.props.period))
    				{
    				    this.props.offListenResa(currentListened);
    				    this.props.resetTable();
    					this.props.listenResa(this.props.period);
 
    				}
    		}
    }		
    }
    
    componentDidMount = () => {
       this.periodMount();
    
	}
	
	componentDidUpdate = () => {
	   this.periodMount();
	}
	
	
	deleteRow = (row) => {
	   const deleteResa = () => {this.props.deleteResa(this.props.period, row.key);};
	   if(row.totali && row.totali.pezzi + row.totali.gratis > 0)	Modal.confirm({
    		title: 'La resa non è vuota. Vuoi elminarla?',
    		content: 'La resa non è vuota: se premi OK cancelli anche tutti i libri che contiene.',
    		okText: 'Si',
    		okType: 'danger',
    		cancelText: 'No',
    		onOk() {deleteResa()
    			
    		},
    		onCancel() {
    		},});
    		
		//Gestisco la situazione che non sia vuota la bolla...
		else deleteResa();
	}
	
	editRow = (row) => {
		this.props.setSelectedResa(row);
	}
	
	selectRow = (row) => {
		this.props.setSelectedResa(row); //Se faccio click in qualsiasi punto della riga... voglio inserire libri...
		this.props.setReadOnlyForm();
		this.props.history.push('/resa/' + period2month(this.props.period) + '/' + row.key);
	}

   saveRow = (row) => {
		this.props.saveResa(this.props.period, row.key);
	}
    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	let height = props.geometry.tableCoors.height;
    	let width = props.geometry.tableCoors.width;
        let header = props.geometry.header;
    	
    
    	delete props['deleteResa']; //Non la passo liscia...
    	delete props['setSelectedResa']; //Idem
    	  return(
			<WrappedTable {...props} width={width} height={height}   highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} saveRow={this.saveRow} selectRow={this.selectRow} header={header}/>
			)}
    }		
	
export default withRouter(TableElencoRese);

