import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import SubInput from '../../../components/SubInput'
import moment from 'moment'

//E' un dato.... che passo come costante...
const header = [
				{dataField: 'values.riferimento', label: 'Rif.', width: '80px'},
                {dataField: 'values.dataDocumento', label: 'Data', width: '160px'},
				{dataField: 'values.ean', label: 'EAN', width: '160px'},
                {dataField: 'values.titolo', label: 'Titolo', width: '320px'},
                {dataField: 'values.prezzoListino', label: 'Listino', width: '60px'},
			   
			    {dataField: 'values.prezzoUnitario', label: 'Prezzo', width: '60px'},
			    {dataField: 'values.pezzi', label: 'Quantità', width: '60px'},
			    {dataField: 'values.gratis', label: 'Gratis', width: '60px'},
			    {dataField: 'values.prezzoTotale', label: 'Totale', width: '70px'}
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
		this.props.deleteRigaResa(params,row.key,row.values);
	}
	

	
	
  onSubmit = (record,index) => {return(() => {this.onSave(record, index)})};  //Se la key è null faccio insert altrimenti update...
  onChange = (field,record,index) => {return((value) => this.props.changeEditedItem(field,value,record,index))}
  onSave = (record, index) => { 
  								
  								let selectedItem = (record.key) ? {key: record.key} : null;  
  								record.values.gratis = parseInt(record.values.gratis, 10) || 0;
  							    record.values.pezzi = parseInt(record.values.pezzi, 10) || 0;
  							    
  							    if ((record.values.gratis + record.values.pezzi) > 0) this.props.submitEditedItem(record.isValid, selectedItem , this.props.listeningItemResa, record.values);
  								else this.props.deleteRigaResa(this.props.listeningItemResa, record.key, record.values); //Se a zero cancello la riga resa...
								};
 
	pezziRowRender = (text, record, index) => {return(<SubInput errorMessage={(record.errorMessages && record.errorMessages.pezzi) ? record.errorMessages.pezzi : ''} onChange={this.onChange('pezzi',record,index)} value={text}  onSubmit={this.onSubmit(record,index)}  />)}
   gratisRowRender = (text, record, index) => {return(<SubInput errorMessage={(record.errorMessages && record.errorMessages.gratis) ? record.errorMessages.gratis : ''} onChange={this.onChange('gratis',record,index)} value={text} onSubmit={this.onSubmit(record,index)}  />)}
   dataRowRender = (text, record, index) => {return(<div>{moment(text).format('DD/MM/YYYY')}</div>)}
   
    customRowRender = {'values.pezzi' : this.pezziRowRender , 'values.gratis' : this.gratisRowRender, 'values.dataDocumento': this.dataRowRender}

   	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaResa']; //Non la passo liscia...
    	delete props['setSelectedRigaResa']; //Idem
    	  return(
			<WrappedTable {...props}  customRowRender={this.customRowRender}  highlightedRowKey={selectedItemKey} deleteRow={this.deleteRow} saveRow={this.onSave} header={header}/>
			)}
    }		
	
export default TableResa;