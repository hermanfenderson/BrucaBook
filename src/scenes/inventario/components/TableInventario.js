import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'


//E' un dato.... che passo come costante...
const header = [{dataField: 'ean', label: 'EAN', width: '160px'},
                {dataField: 'titolo', label: 'Titolo', width: '320px'},
			    {dataField: 'prezzoListino', label: 'Prezzo', width: '60px'},
			    {dataField: 'pezzi', label: 'Quantità', width: '60px'},
			   ];

var currentListenedIdInventario = null;

//Per gestire in modo smmooth il ricaricamento!

class TableInventario extends Component 
    {
    componentDidMount() {
    	if (this.props.listeningItemInventario) currentListenedIdInventario = this.props.listeningItemInventario[1];   
    		//Ascolto modifiche sulle righe della bolla
    	if (currentListenedIdInventario !== this.props.idInventario)
    	   {
    	   	if (currentListenedIdInventario) 
    	   		{
    	   			//Solo anno
    	   			//let params = [...this.props.period];
    	   			let params = [];
    	   			params[0] = this.props.period[0];
    	   			params.push(currentListenedIdInventario);
    
    	   			this.props.offListenRigaInventario(params); 
    	   			this.props.resetTableInventario();
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	
    	   	let params = [];
    	   	params[0] = this.props.period[0];
    	   		
    	   	params.push(this.props.idInventario);
    	   	this.props.listenRigaInventario(params); 
    	   	}
    	   	
	}
	
	
	
	
	deleteRow = (row) => {
		let params = [];
    	params[0] = this.props.period[0];
    	params.push(this.props.idInventario);
		this.props.deleteRigaInventario(params,row.key,row);
	}
	
	editRow = (row) => {
		let params = [];
    	params[0] = this.props.period[0];
    	params.push(this.props.idInventario);
		this.props.setSelectedRigaInventario(row);
	}

    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaInventario']; //Non la passo liscia...
    	delete props['setSelectedRigaInventario']; //Idem
    	  return(
			<WrappedTable {...props}  highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default TableInventario;

