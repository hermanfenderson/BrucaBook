import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import { withRouter } from 'react-router-dom';


//E' un dato.... che passo come costante...
const header = [{dataField: 'ean', label: 'EAN', width: '160px'},
                {dataField: 'titolo', label: 'Titolo', width: '320px'},
                {dataField: 'autore', label: 'Autore', width: '280px'},
			    
			    {dataField: 'prezzoListino', label: 'Prezzo', width: '60px'},
			    {dataField: 'stock', label: 'Stock', width: '60px'},
			   
			    {dataField: 'pezzi', label: 'Delta', width: '60px'},
			   ];

var currentListenedIdInventario = null;

//Per gestire in modo smmooth il ricaricamento!

class TableInventario extends Component 
    {
    componentDidMount() {
    	if (this.props.listeningItemInventario) currentListenedIdInventario = this.props.listeningItemInventario;   
    		//Ascolto modifiche sulle righe della bolla
    	if (currentListenedIdInventario !== this.props.idInventario)
    	   {
    	   	if (currentListenedIdInventario) 
    	   		{
    	   		
    
    	   			this.props.offListenRigaInventario(currentListenedIdInventario); 
    	   			this.props.resetTableInventario();
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	
    	   	
    	   	this.props.listenRigaInventario(this.props.idInventario); 
    	   	}
    	   	
	}
	
	
	
	
	deleteRow = (row) => {
	   this.props.deleteRigaInventario(this.props.idInventario,row.key,row);
	}
	
	editRow = (row) => {
		
		this.props.setSelectedRigaInventario(row);
	}

    pinRow = (row) => {
    	this.props.togglePin(this.props.idInventario,row.key,row, 'pinned');
    }
    
    detailRow = (row) => {
    	this.props.history.push('/dettagli/'+row.ean);
    }
    
    	render() { 
        let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaInventario']; //Non la passo liscia...
    	delete props['setSelectedRigaInventario']; //Idem
    	  return(
			<WrappedTable {...props}  highlightedRowKey={selectedItemKey} detailRow={this.detailRow} pinRow={this.pinRow} pinField={'pinned'} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default withRouter(TableInventario);

