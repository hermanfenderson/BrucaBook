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

var currentListenedIdBolla = null;

//Per gestire in modo smmooth il ricaricamento!

class TableBolla extends Component 
    {
    componentDidMount() {
    	if (this.props.listeningItemBolla) currentListenedIdBolla = this.props.listeningItemBolla[2];   
    		//Ascolto modifiche sulle righe della bolla
    	if (currentListenedIdBolla !== this.props.idBolla)
    	   {
    	   	if (currentListenedIdBolla) 
    	   		{
    	   			let params = [...this.props.period];
    	   			params.push(currentListenedIdBolla);
    
    	   			this.props.offListenRigaBolla(params); 
    	   			this.props.resetTableBolla();
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	let params = [...this.props.period];
    	   	params.push(this.props.idBolla);
    	   	this.props.listenRigaBolla(params); 
    	   	}
    	   	
	}
	
	
	
	
	deleteRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.idBolla);
		this.props.deleteRigaBolla(params,row.key,row);
	}
	
	editRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.idBolla);
		this.props.setSelectedRigaBolla(row);
	}
	

	expandedRowRender = (record) => {return(<div>Ciao</div>)}
	onChangeCustom = (e) => {console.log(e)};
	

  onSubmit = () => {console.log('do validate')}
  
 	titoloRowRender = (text, record) => {return(<SubInput onChange={this.onChangeCustom} value={text} onSubmit={this.onSubmit}  />)}
   
    customRowRender = {'titolo' : this.titoloRowRender }

    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaBolla']; //Non la passo liscia...
    	delete props['setSelectedRigaBolla']; //Idem
    	  return(
			<WrappedTable {...props}  customRowRender={this.customRowRender} expandedRowRender={this.expandedRowRender} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default TableBolla;

