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
   
	
	
	

	onChangeCustom = (e) => {console.log(e)};
	

  onSubmit = (record) => {console.log(record)}
  
 	pezziRowRender = (text, record) => {return(<SubInput onChange={this.onChangeCustom} value={text} record={record} onSubmit={this.onSubmit}  />)}
   gratisRowRender = (text, record) => {return(<SubInput onChange={this.onChangeCustom} value={text} record={record} onSubmit={this.onSubmit}  />)}
    dataRowRender = (text, record) => {return(<div>{moment(text).format('DD/MM/YYYY')}</div>)}
   
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
			saveRow={this.onSubmit}
			size={'small'}
			rowKey={'rigaBolla'}
			header={header}/>
			)}
    }		
	
export default TableDettagliResa;

