import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import SubInput from '../../../components/SubInput'
import moment from 'moment';

//E' un dato.... che passo come costante...
const header = [{dataField: 'riferimento', label: 'Rif.', width: '160px'},
                {dataField: 'dataDocumento', label: 'Data', width: '160px'},
			   {dataField: 'prezzoUnitario', label: 'Prezzo', width: '160px'},
			   {dataField: 'maxRese', label: 'Max. pezzi', width: '160px'},
			   {dataField: 'maxGratis', label: 'Max. gratis', width: '160px'},
			   {dataField: 'pezzi', label: 'Pezzi', width: '160px'},
			   {dataField: 'gratis', label: 'Gratis', width: '160px'},
			   
			   
			   ];


//Per gestire in modo smmooth il ricaricamento!

class TableDettagliResa extends Component 
    {
   
	
	
	

//	onChangeField = (field, value, record, index) => {this.props.(index)};
  	

  onSubmit = (record,index) => {return(() => {this.onSave(record, index)})};  //Se la key è null faccio insert altrimenti update...
  onChange = (field,record,index) => {return((value) => this.props.changeEditedItem(field,value,record,index, record.ean))}
  onSave = (record, index) => { 
  								let selectedItem = (record.key) ? {key: record.key} : null;  
  								record.gratis = parseInt(record.gratis) || 0;
  							    record.pezzi = parseInt(record.pezzi) || 0;
  							    
  							    if ((record.gratis + record.pezzi) > 0) this.props.submitEditedItem(true, selectedItem , this.props.listeningItemResa, record);
  								else this.props.deleteRigaResa(this.props.listeningItemResa, record.key); //Se a zero cancello la riga resa...
								};
  
 	pezziRowRender = (text, record, index) => {return(<SubInput onChange={this.onChange('pezzi',record,index)} value={text}  onSubmit={this.onSubmit(record,index)}  />)}
   gratisRowRender = (text, record, index) => {return(<SubInput onChange={this.onChange('gratis',record,index)} value={text} onSubmit={this.onSubmit(record,index)}  />)}
    dataRowRender = (text, record, index) => {return(<div>{moment(text).format('DD/MM/YYYY')}</div>)}
   
    customRowRender = {'pezzi' : this.pezziRowRender , 'gratis' : this.gratisRowRender, 'dataDocumento': this.dataRowRender}

    
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
			rowKey={'rigaBolla'}
			header={header}/>
			)}
    }		
	
export default TableDettagliResa;

