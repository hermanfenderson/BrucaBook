import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import SubInput from '../../../components/SubInput'

//E' un dato.... che passo come costante...
const header = [{dataField: 'ean', label: 'EAN', width: '160px'},
                {dataField: 'titolo', label: 'Titolo', width: '320px'},
			    {dataField: 'prezzoUnitario', label: 'Prezzo', width: '60px'},
			    {dataField: 'pezzi', label: 'Quantità', width: '60px'},
			    {dataField: 'gratis', label: 'Gratis', width: '60px'},
			    {dataField: 'prezzoTotale', label: 'Totale', width: '70px'}
			   ];

var currentListenedIdResa = null;

//Per gestire in modo smmooth il ricaricamento!

class TableResa extends Component 
    {
    componentDidMount() {
    	if (this.props.listeningItemResa) currentListenedIdResa = this.props.listeningItemResa[2];   
    		//Ascolto modifiche sulle righe della Resa
    	if (currentListenedIdResa !== this.props.idResa)
    	   {
    	   	if (currentListenedIdResa) 
    	   		{
    	   			let params = [...this.props.period];
    	   			params.push(currentListenedIdResa);
    
    	   			this.props.offListenRigaResa(params); 
    	   			this.props.resetTableResa();
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	let params = [...this.props.period];
    	   	params.push(this.props.idResa);
    	   	this.props.listenRigaResa(params); 
    	   	}
    	   	
	}
	
	
	
	
	deleteRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.idResa);
		this.props.deleteRigaResa(params,row.key,row);
	}
	
	editRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.idResa);
		this.props.setSelectedRigaResa(row);
	}
	
   	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaResa']; //Non la passo liscia...
    	delete props['setSelectedRigaResa']; //Idem
    	  return(
			<WrappedTable {...props}  highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default TableResa;