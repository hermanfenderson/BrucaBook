import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import TableDettagliResa from './TableDettagliResa'
import SubInput from '../../../components/SubInput'

//E' un dato.... che passo come costante...
const header = [{dataField: 'ean', label: 'EAN', width: '160px'},
                {dataField: 'titolo', label: 'Titolo', width: '320px'},
                {dataField: 'autore', label: 'Autore', width: '280px'},
			    
			    {dataField: 'prezzoListino', label: 'Listino', width: '90px'},
			    {dataField: 'stock', label: 'Stock', width: '60px'},
			    {dataField: 'resi', label: 'Resi', width: '60px'},
			    
			   ];
			   
const mock = {'2000000000015': [{riferimento: 1}, {riferimento: 2}], '2000000000039': [{riferimento: 3}, {riferimento: 4}]}			   

var currentListenedIdResa = null;

//Per gestire in modo smmooth il ricaricamento!

class TableOpenResa extends Component 
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
	
	
	
	

//	expandedRowRender = (record) => {return(<div>{record.ean}</div>)}

	expandedRowRender = (record) => {return(<TableDettagliResa righeDettagli={mock[record.ean]}/>)}

	onChangeCustom = (e) => {console.log(e)};
	

  onSubmit = () => {console.log('do validate')}
  
 	titoloRowRender = (text, record) => {return(<SubInput onChange={this.onChangeCustom} value={text} onSubmit={this.onSubmit}  />)}
   
    customRowRender = {'titolo' : this.titoloRowRender }

    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaResa']; //Non la passo liscia...
    	delete props['setSelectedRigaResa']; //Idem
    	  return(
			<WrappedTable {...props} 
			data={this.props.tabellaEAN}
			customRowRender={this.customRowRender} 
			expandedRowRender={this.expandedRowRender} 
			highlightedRowKey={selectedItemKey} 
			header={header}/>
			)}
    }		
	
export default TableOpenResa;

