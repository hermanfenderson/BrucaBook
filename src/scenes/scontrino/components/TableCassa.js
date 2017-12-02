import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import {Modal} from 'antd';


//E' un dato.... che passo come costante...
const header = [{dataField: 'numero', label: '#', width: '30px'},
				{dataField: 'oraScontrino', label: 'Ora', width: '45px'},		
                {dataField: 'totali.pezzi', label: 'Q.tà', width: '35px'},
			     {dataField: 'totali.prezzoTotale', label: 'Tot.', width: '55px'}
			   ];
//Per gestire in modo smmooth il ricaricamento!

class TableCassa extends Component 
    {
    componentDidMount() {
    	var currentListenedIdCassa = null;
    	if (this.props.listeningItemCassa) currentListenedIdCassa = this.props.listeningItemCassa[2];   
    		//Ascolto modifiche sulle righe della bolla
    	if (currentListenedIdCassa !== this.props.cassa)
    	   {
    	   	if (currentListenedIdCassa) 
    	   		{
    	   		let params = [...this.props.period];
    	   		params.push(currentListenedIdCassa);
    
    	   			this.props.offListenRigaCassa(params); 
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	let params = [...this.props.period];
    	   	params.push(this.props.cassa);
    	   	this.props.listenRigaCassa(params); 
    	   	}
    	   	
	}
	
	
	deleteRow = (row) => {
	   const deleteRigaCassa = () => {
	   	    let params = [...this.props.period];
    		params.push(this.props.cassa);
	   		this.props.deleteRigaCassa(params, row.key);
	   };
	   
	   if(row.totali && row.totali.pezzi > 0)	Modal.confirm({
    		title: 'Lo scontrino non è vuoto. Vuoi elminarlo?',
    		content: 'Lo scontrino non è vuota: se premi OK cancelli anche tutti i libri che contiene.',
    		okText: 'Si',
    		okType: 'danger',
    		cancelText: 'No',
    		onOk() {deleteRigaCassa()
    			
    		},
    		onCancel() {
    		},});
    		
		//Gestisco la situazione che non sia vuota la bolla...
		else deleteRigaCassa();
	}
	
	

	
	editRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.cassa);
    	this.props.setSelectedRigaCassa(row);
	}

    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaScontrino']; //Non la passo liscia...
    	delete props['setSelectedRigaScontrino']; //Idem
    	  return(
			<WrappedTable {...props}  size={'small'} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default TableCassa;

