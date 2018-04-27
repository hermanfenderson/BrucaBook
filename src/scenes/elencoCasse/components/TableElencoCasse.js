import React, {Component} from 'react';
import WrappedTable from '../../../components/WrappedTable';
import {isEqual} from '../../../helpers/form';
import {Modal} from 'antd';
import {period2month} from '../../../helpers/form'
import {withRouter} from 'react-router-dom'



//E' un dato.... che passo come costante...
const header = [{dataField: 'dataCassa', label: 'Data', width: '200px'},
			    
				{dataField: 'cassa', label: 'Cassa', width: '150px'},
			    {dataField: 'totali.prezzoTotale', label: 'Totale', width: '200px'},
			      {dataField: 'totali.scontrini', label: 'Scontrini', width: '200px'},
			   {dataField: 'totali.pezzi', label: 'Pezzi', width: '200px'},
			   ];




class TableElencoCasse extends Component 
    {
    periodMount = () => {
    if (this.props.period)
    {
    	var currentListened = this.props.listeningPeriod;
    		//Ascolto modifiche sulle bolle... devo passare anno (voglio sentire un anno intero per ora. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (!currentListened) 
    		{   	
    			this.props.listenCassa(this.props.period);
    		}
    	else 
    		{
    			if (!isEqual(currentListened,this.props.period))
    				{
    				    this.props.offListenCassa(currentListened);
    				    this.props.resetTable();
    					this.props.listenCassa(this.props.period);
 
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
	
	componentWillUnmount = () => {
		if (this.props.period) this.props.offListenCassa(this.props.period);
    	this.props.resetTable();
    								    
	}
	
	
	deleteRow = (row) => {
	   const deleteCassa = () => {this.props.deleteCassa(this.props.period, row.key);};
	   if(row.totali && row.totali.pezzi > 0)	Modal.confirm({
    		title: 'La cassa non è vuota. Vuoi elminarla?',
    		content: 'La cassa non è vuota: se premi OK cancelli anche tutti i libri che contiene.',
    		okText: 'Si',
    		okType: 'danger',
    		cancelText: 'No',
    		onOk() {deleteCassa()
    			
    		},
    		onCancel() {
    		},});
    		
		//Gestisco la situazione che non sia vuota la bolla...
		else deleteCassa();
	}
	
	editRow = (row) => {
		this.props.setSelectedCassa(row);
	}
	
	selectRow = (row) => {
		this.props.setSelectedCassa(row); //Se faccio click in qualsiasi punto della riga... voglio inserire libri...
		this.props.setReadOnlyForm();
	   this.props.history.push('/scontrino/' + period2month(this.props.period) + '/' + row.key);

	}
	
	saveRow = (row) => {
		this.props.saveCassa(this.props.period, row.key);
	}

    
    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteCassa']; //Non la passo liscia...
    	delete props['setSelectedCassa']; //Idem
    	  return(
			<WrappedTable {...props} highlightedRowKey={selectedItemKey} saveRow={this.saveRow} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.selectRow} header={header}/>
			)}
    }		
	
export default withRouter(TableElencoCasse);

