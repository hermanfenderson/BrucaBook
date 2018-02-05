import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import SubInput from '../../../components/SubInput'
import moment from 'moment';

//E' un dato.... che passo come costante...
//Trucco che mi consente di riciclare un po' di roba dopo...

const header = [{dataField: 'values.riferimentoBolla', label: 'Rif.', width: '160px'},
                {dataField: 'values.dataDocumentoBolla', label: 'Data', width: '160px'},
                 {dataField: 'values.prezzoListino', label: 'Listino', width: '60px'},
			   
			    {dataField: 'values.prezzoUnitario', label: 'Prezzo', width: '60px'},
			   {dataField: 'values.maxRese', label: 'Max. pezzi', width: '160px'},
			   {dataField: 'values.maxGratis', label: 'Max. gratis', width: '160px'},
			   {dataField: 'values.pezzi', label: 'Pezzi', width: '160px'},
			   {dataField: 'values.gratis', label: 'Gratis', width: '160px'},
			    {dataField: 'values.prezzoTotale', label: 'Totale', width: '60px'},
			  
			   
			   ];


//Per gestire in modo smmooth il ricaricamento!


class TableDettagliResa extends Component 
    {
   
	
	
	

//	onChangeField = (field, value, record, index) => {this.props.(index)};
  	

  onSubmit = (record,index) => {return(() => {this.onSave(record, index)})};  //Se la key è null faccio insert altrimenti update...
  onChange = (field,record,index) => {return((value) => this.props.changeEditedItem(field,value,record,index, record.values.ean))}
  onSave = (record, index) => { 
  								let selectedItem = (record.values.key) ? {key: record.values.key} : null;  
  								record.values.gratis = parseInt(record.values.gratis, 10) || 0;
  							    record.values.pezzi = parseInt(record.values.pezzi, 10) || 0;
  							    record.values.testata = this.props.testataResa;
  							    if ((record.values.gratis + record.values.pezzi) > 0) this.props.submitEditedItem(record.isValid, selectedItem , this.props.listeningItemResa, record.values);
  								else this.props.deleteRigaResa(this.props.listeningItemResa, record.values.key, record.values); //Se a zero cancello la riga resa...
								};
  
 	pezziRowRender = (text, record, index) => {return(<SubInput errorMessage={(record.errorMessages && record.errorMessages.pezzi) ? record.errorMessages.pezzi : ''} onChange={this.onChange('pezzi',record,index)} value={text}  onSubmit={this.onSubmit(record,index)}  />)}
   gratisRowRender = (text, record, index) => {return(<SubInput errorMessage={(record.errorMessages && record.errorMessages.gratis) ? record.errorMessages.gratis : ''} onChange={this.onChange('gratis',record,index)} value={text} onSubmit={this.onSubmit(record,index)}  />)}
    dataRowRender = (text, record, index) => {return(<div>{moment(text).format('DD/MM/YYYY')}</div>)}
   
    customRowRender = {'values.pezzi' : this.pezziRowRender , 'values.gratis' : this.gratisRowRender, 'values.dataDocumentoBolla': this.dataRowRender}

    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaResa']; //Non la passo liscia...
    	delete props['setSelectedRigaResa']; //Idem
    	  return(
			<WrappedTable {...props} 
			data={this.props.righeDettagli}
			customRowRender={this.customRowRender} 
			highlightedRowKey={selectedItemKey} 
			saveRow={this.onSave}
			size={'small'}
			header={header}/>
			)}
    }		
	
export default TableDettagliResa;

