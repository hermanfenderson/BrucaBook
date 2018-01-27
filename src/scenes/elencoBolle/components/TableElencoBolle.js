import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedTable';
import {withRouter} from 'react-router-dom'

import {isEqual} from '../../../helpers/form';
import {Modal} from 'antd';
import {period2month} from '../../../helpers/form'


//E' un dato.... che passo come costante...
const header = [{dataField: 'riferimento', label: 'Rif.', width: '150px'},
			    {dataField: 'nomeFornitore', label: 'Fornitore', width: '300px'},
			    {dataField: 'tipoBolla', label: 'Tipo', width: '70px'},
			    
			    {dataField: 'dataDocumento', label: 'Data Doc', width: '200px'},
			    {dataField: 'dataCarico', label: 'Data Carico', width: '200px'},
			    {dataField: 'dataRendiconto', label: 'Data Rend.', width: '200px'},
			    
			    {dataField: 'totali.prezzoTotale', label: 'Totale', width: '200px'},
			   {dataField: 'totali.pezzi', label: 'Pezzi', width: '100px'},
			    {dataField: 'totali.gratis', label: 'Gratis', width: '100px'},
			   ];




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
       this.periodMount();
    
	}
	
	componentDidUpdate = () => {
	   this.periodMount();
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
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.selectRow} header={header}/>
			)}
    }		
	
export default withRouter(TableElencoBolle);

