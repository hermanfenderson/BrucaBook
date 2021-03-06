import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedVirtualizedTable'
import SubInput from '../../../components/SubInput'
import moment from 'moment'


//var currentListenedIdResa = null;

//Per gestire in modo smmooth il ricaricamento!

class TableResa extends Component 
    {
 
	
	
	
	deleteRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.idResa);
		this.props.deleteRigaResa(params,row.values.key,row.values);
	}
	

	
  isChanged = (record, field, index) =>
	{
		if (record.key) return (parseInt(record.values[field],10) !== this.props.data[index].values[field])
		else return (parseInt(record.values[field],10) !==0); //Se non è memorizzato ed è diverso da zero è cambiato... 
	}

  onSubmit = (record,index) => {return(() => {this.onSave(record, index)})};  //Se la key è null faccio insert altrimenti update...
  onChange = (field,record,index) => {return((value) => this.props.changeEditedItem(field,value,record,index, 'chiusa'))}
  onSave = (record, index) => { 
  								
  								let selectedItem = (record.values.key) ? {key: record.values.key} : null;  
  									let ean = record.values.ean;
  							
  								  record.values.rigaResa = {...record.values};
  							  
  								record.values.gratis = parseInt(record.values.gratis, 10) || 0;
  							    record.values.pezzi = parseInt(record.values.pezzi, 10) || 0;
  							    record.values.testata = this.props.testataResa;
  							    
  							    record.values.rigaMagazzino = this.props.getMagazzinoItem(ean); 
  							    
  							    record.values.bolla = this.props.getRigaBolla(ean,record.values.rigaBolla);
  								
  							    if ((record.values.gratis + record.values.pezzi) > 0) this.props.submitEditedItem(record.isValid, selectedItem , this.props.listeningItemResa, record.values);
  								else this.props.deleteRigaResa(this.props.listeningItemResa, record.values.key, record.values); //Se a zero cancello la riga resa...
								};
 
	pezziRowRender = (text, record, index) => {return(<SubInput  isChanged={this.isChanged(record, 'pezzi', index)} errorMessage={(record.errorMessages && record.errorMessages.pezzi) ? record.errorMessages.pezzi : ''} onChange={this.onChange('pezzi',record,index)} value={text}  onSubmit={this.onSubmit(record,index)}  />)}
   gratisRowRender = (text, record, index) => {return(<SubInput  isChanged={this.isChanged(record, 'gratis', index)} errorMessage={(record.errorMessages && record.errorMessages.gratis) ? record.errorMessages.gratis : ''} onChange={this.onChange('gratis',record,index)} value={text} onSubmit={this.onSubmit(record,index)}  />)}
   dataRowRender = (text, record, index) => {return(<div>{moment(text).format('DD/MM/YYYY')}</div>)}
   
    customRowRender = {'values.pezzi' : this.pezziRowRender , 'values.gratis' : this.gratisRowRender, 'values.dataDocumentoBolla': this.dataRowRender}
	customFilterFunc = (record, filters) => {
   		let good = true;
   			for (var prop in filters)
	  			{	
	  				
   				if (prop !== 'noZeroStock')
   					
   					{  let regex = new RegExp(filters[prop],'i');
	  				
	  					if (filters[prop] && (record.values[prop]!==undefined) && (!record.values[prop].match(regex))) good = false;
	  					if (filters[prop] && ((record.values[prop]===undefined) || record.values[prop].length===0)) good = false;
	  				}
   			        
   				}
	    return (good ? {...record} : null) 
   }

   	render() { 
       	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaResa']; //Non la passo liscia...
    	delete props['setSelectedRigaResa']; //Idem
    	  return(
			<WrappedTable {...props}  highlightedRowKey={selectedItemKey} deleteRow={this.deleteRow} saveRow={this.onSave}
			height={props.geometry.tableCoors.height}
			width={props.geometry.tableCoors.width}
			customRowRender={this.customRowRender}
			header={props.geometry.header}
			customFilterFunc={this.customFilterFunc}
			
			/>
			)}
    }		
	
export default TableResa;