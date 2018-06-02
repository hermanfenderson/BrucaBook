import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedTable';
import {withRouter} from 'react-router-dom'

import {isEqual} from '../../../helpers/form';
import {Modal} from 'antd';
import {period2month} from '../../../helpers/form'






class TableElencoBolle extends Component 
    {
    periodMount = () => {
  if (this.props.period)
    {
     	var currentListened = this.props.listeningPeriod;
    		//Ascolto modifiche sulle bolle... devo passare anno (voglio sentire un anno intero per ora. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (!currentListened) 
    		{   	
    			this.props.listenBolla(this.props.period);
    		}
    	else 
    		{
    			if (!isEqual(currentListened,this.props.period))
    				{
    				    this.props.offListenBolla(currentListened);
    				    this.props.resetTable();
    					this.props.listenBolla(this.props.period);
 
    				}
    		}
    }		
    }
    
    componentDidMount = () => {
       let oldProps = null;
       this.periodMount(oldProps);
    
	}
	
	componentDidUpdate = (oldProps) => {
	   this.periodMount(oldProps);
	}
	
	componentWillUnmount = () => {
		if (this.props.period) this.props.offListenBolla(this.props.period);
    	this.props.resetTable();
    					
	}
	
	
	deleteRow = (row) => {
	   const deleteBolla = () => {this.props.deleteBolla(this.props.period, row.key, row);};
	   if(row.totali && row.totali.pezzi + row.totali.gratis > 0)	Modal.confirm({
    		title: 'La bolla non è vuota. Vuoi elminarla?',
    		content: 'La bolla non è vuota: se premi OK cancelli anche tutti i libri che contiene.',
    		okText: 'Si',
    		okType: 'danger',
    		cancelText: 'No',
    		onOk() {deleteBolla()
    			
    		},
    		onCancel() {
    		},});
    		
		//Gestisco la situazione che non sia vuota la bolla...
		else deleteBolla();
	}
	
	editRow = (row) => {
		row.oldFornitore = row.fornitore; //Per gestire un eventuale cambiamento...
		this.props.setSelectedBolla(row);
	}
	
	selectRow = (row) => {
		this.props.setSelectedBolla(row); //Se faccio click in qualsiasi punto della riga... voglio inserire libri...
		this.props.setReadOnlyForm();
		this.props.history.push('/bolla/' + period2month(this.props.period) + '/' + row.key);
	}

    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteBolla']; //Non la passo liscia...
    	delete props['setSelectedBolla']; //Idem
    	  return(
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.selectRow} header={this.props.geometry.header}/>
			)}
    }		
	
export default withRouter(TableElencoBolle);

