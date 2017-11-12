import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import {Modal} from 'antd';



//E' un dato.... che passo come costante...
const header = [{dataField: 'riferimento', label: 'Rif.', width: '150px'},
			    {dataField: 'fornitore', label: 'Fornitore', width: '300px'},
			    {dataField: 'dataDocumento', label: 'Data Doc', width: '200px'},
			    {dataField: 'dataCarico', label: 'Data Carico', width: '200px'},
			    {dataField: 'totali.prezzoTotale', label: 'Totale', width: '200px'},
			   {dataField: 'totali.pezzi', label: 'Pezzi', width: '200px'},
			    {dataField: 'totali.gratis', label: 'Gratis', width: '200px'},
			   ];




class TableBolla extends Component 
    {
    periodMount = () => {
    	var currentListenedObj = this.props.listeningPeriod;
    		//Ascolto modifiche sulle bolle... devo passare anno (voglio sentire un anno intero per ora. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (!currentListenedObj) 
    		{   
    			this.props.listenBolla({anno: this.props.period.anno, mese: this.props.period.mese});
    		}
    	else 
    		{
    			if ((currentListenedObj.anno !== this.props.period.anno ) || (currentListenedObj.mese !== this.props.period.mese ))
    				{
    				    this.props.offListenBolla({currentListenedObj});
    				    this.props.resetTable();
    					this.props.listenBolla({anno: this.props.period.anno, mese: this.props.period.mese});
    					
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
	   const deleteBolla = () => {this.props.deleteBolla({'itemId':row.key}, row);};
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
		this.props.setSelectedBolla(row);
	}
	
	selectRow = (row) => {
		this.props.setSelectedBolla(row); //Se faccio click in qualsiasi punto della riga... voglio inserire libri...
		this.props.setReadOnlyForm();
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
	
export default TableBolla;

