import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedVirtualizedTable'
import SubInput from '../../../components/SubInput'
import moment from 'moment';

//E' un dato.... che passo come costante...
//Trucco che mi consente di riciclare un po' di roba dopo...
/*
const header = [{dataField: 'values.riferimentoBolla', label: 'Rif.', width: 160},
                {dataField: 'values.dataDocumentoBolla', label: 'Data', width: 160},
                 {dataField: 'values.prezzoListino', label: 'Listino', width: 60},
			   
			    {dataField: 'values.prezzoUnitario', label: 'Prezzo', width: 60},
			   {dataField: 'values.maxRese', label: 'Max. pezzi', width: 160},
			   {dataField: 'values.maxGratis', label: 'Max. gratis', width: 160},
			   {dataField: 'values.pezzi', label: 'Pezzi', width: 160},
			   {dataField: 'values.gratis', label: 'Gratis', width: 160},
			    {dataField: 'values.prezzoTotale', label: 'Totale', width: 60},
			  
			   
			   ];
*/

//Per gestire in modo smmooth il ricaricamento!


class TableDettagliResa extends Component 
    {
   
	
	
	

//	onChangeField = (field, value, record, index) => {this.props.(index)};
  	

  onSubmit = (record,index) => {return(() => {this.onSave(record, index)})};  //Se la key è null faccio insert altrimenti update...
  onChange = (field,record,index) => {return((value) => this.props.changeEditedItem(field,value,record,index, 'aperta'))}
  onSave = (record, index) => { 
  								let selectedItem = (record.values.key) ? {key: record.values.key} : null;  
  								let ean = record.values.ean;
  							  
  								record.values.gratis = parseInt(record.values.gratis, 10) || 0;
  							    record.values.pezzi = parseInt(record.values.pezzi, 10) || 0;
  							    record.values.testata = this.props.testataResa;
  							    
  							    record.values.rigaMagazzino = this.props.getMagazzinoItem(ean); 
  							    
  							    record.values.rigaResa = this.props.righeResa[record.values.key];
  							    record.values.bolla = this.props.getRigaBolla(ean,record.values.rigaBolla);
  							
  							   
  							    //Persisto sempre il valore a magazzino...
  							    //e mando anche il valore dei dettagli...
  							    if ((record.values.gratis + record.values.pezzi) > 0) this.props.submitEditedItem(record.isValid, selectedItem , this.props.listeningItemResa, record.values);
  								else this.props.deleteRigaResa(this.props.listeningItemResa, record.values.key, record.values); //Se a zero cancello la riga resa...
								};
  isChanged = (record, field) =>
	{
		if (record.values.key) return (parseInt(record.values[field],10) !== this.props.righeResa[record.values.key][field])
		else return (parseInt(record.values[field],10) !==0); //Se non è memorizzato ed è diverso da zero è cambiato... 
	}
	
 	pezziRowRender = (text, record, index) => {return(<div className={'subInputTable'}><SubInput isChanged={this.isChanged(record, 'pezzi')} errorMessage={(record.errorMessages && record.errorMessages.pezzi) ? record.errorMessages.pezzi : ''} onChange={this.onChange('pezzi',record,index)} value={text}  onSubmit={this.onSubmit(record,index)}  /></div>)}
   gratisRowRender = (text, record, index) => {return(<div className={'subInputTable'}><SubInput isChanged={this.isChanged(record, 'gratis')} errorMessage={(record.errorMessages && record.errorMessages.gratis) ? record.errorMessages.gratis : ''} onChange={this.onChange('gratis',record,index)} value={text} onSubmit={this.onSubmit(record,index)}  /></div>)}
    dataRowRender = (text, record, index) => {return(<div>{moment(text).format('DD/MM/YYYY')}</div>)}
   
    customRowRender = {'values.pezzi' : this.pezziRowRender , 'values.gratis' : this.gratisRowRender, 'values.dataDocumentoBolla': this.dataRowRender}

    
    	render() { 
    
    	let props = {...this.props};
    	
    	delete props['deleteRigaResa']; //Non la passo liscia...
    	delete props['setSelectedRigaResa']; //Idem
    	  return(
			<WrappedTable {...props} 
			data={this.props.righeDettagli}
			customRowRender={this.customRowRender} 
			highlightedRowKey={this.props.righeDettagli.changedKeys} 
			saveRow={this.onSave}
			header={this.props.geometry.headerDetail}/>
			)}
    }		
	
export default TableDettagliResa;

