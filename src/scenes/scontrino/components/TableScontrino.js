//Ho rotto la schiavitù della wrapped table... in questo caso vado meglio custom....
import React, {Component} from 'react'


import WrappedTable from '../../../components/WrappedTable'


//E' un dato.... che passo come costante...
const header = [{dataField: 'ean', label: 'EAN', width: '140px'},
                {dataField: 'titolo', label: 'Titolo', width: '360px'},
			    {dataField: 'prezzoUnitario', label: 'Prezzo', width: '70px'},
			    {dataField: 'pezzi', label: 'Q.tà', width: '60px'},
			     {dataField: 'prezzoTotale', label: 'Totale', width: '70px'}
			   ];
var currentListenedIdScontrino = null;
    
//Per gestire in modo smmooth il ricaricamento!

class TableScontrino extends Component 
    {
    componentDidMount() {
    	if (this.props.listeningItemScontrino) currentListenedIdScontrino = this.props.listeningItemScontrino[3];   
    		//Ascolto modifiche sulle righe della bolla
    	
    	if (currentListenedIdScontrino !== this.props.scontrino)
    	   {
    	   	if (currentListenedIdScontrino) 
    	   		{   
    	   			let params = [...this.props.period];
    	   			params.push(this.props.cassa)
    	   			params.push(currentListenedIdScontrino);
    
    	   			this.props.offListenRigaScontrino(params, this.props.listenersItemScontrino); 
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	let params = this.props.period;
    	   	params.push(this.props.cassa);
    	   	params.push(this.props.scontrino);
    	   	this.props.listenRigaScontrino(params); 
    	   	}
    	   	
	}
	
	
	
	
	deleteRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.cassa);
    	params.push(this.props.scontrino);
		this.props.deleteRigaScontrino(params,row.key);
	}
	
	editRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.cassa);
    	params.push(this.props.scontrino);
		this.props.setSelectedRigaScontrino(row);
	}

    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaScontrino']; //Non la passo liscia...
    	delete props['setSelectedRigaScontrino']; //Idem
    	  return(
			<WrappedTable {...props}  highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default TableScontrino;

