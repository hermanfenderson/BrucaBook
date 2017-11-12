import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'


//E' un dato.... che passo come costante...
const header = [{dataField: 'ean', label: 'EAN', width: '160px'},
                {dataField: 'titolo', label: 'Titolo', width: '320px'},
			    {dataField: 'prezzoUnitario', label: 'Prezzo', width: '60px'},
			    {dataField: 'pezzi', label: 'Quantità', width: '60px'},
			    {dataField: 'gratis', label: 'Gratis', width: '60px'},
			    {dataField: 'prezzoTotale', label: 'Totale', width: '70px'}
			   ];
//Per gestire in modo smmooth il ricaricamento!

class TableBolla extends Component 
    {
    componentDidMount() {
    	var currentListenedIdBolla = null;
    	if (this.props.listeningItemBolla) currentListenedIdBolla = this.props.listeningItemBolla.bollaId;   
    		//Ascolto modifiche sulle righe della bolla
    	if (currentListenedIdBolla !== this.props.idBolla)
    	   {
    	   	if (currentListenedIdBolla) 
    	   		{this.props.offListenRigaBolla({'bollaId':currentListenedIdBolla}); 
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	this.props.listenRigaBolla({'bollaId':this.props.idBolla}); 
    	   	}
    	   	
	}
	
	
	
	
	deleteRow = (row) => {
		this.props.deleteRigaBolla({'bollaId':this.props.idBolla,'rigaBollaId':row.key});
	}
	
	editRow = (row) => {
		this.props.setSelectedRigaBolla(row);
	}

    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaBolla']; //Non la passo liscia...
    	delete props['setSelectedRigaBolla']; //Idem
    	  return(
			<WrappedTable {...props}  highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default TableBolla;

