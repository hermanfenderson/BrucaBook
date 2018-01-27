import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import SubInput from '../../../components/SubInput'

//E' un dato.... che passo come costante...
const header = [{dataField: 'riferimento', label: 'Rif.', width: '160px'},
                {dataField: 'dataDocumento', label: 'Data', width: '160px'},
			   {dataField: 'prezzoUnitario', label: 'Prezzo', width: '160px'},
			   {dataField: 'maxRese', label: 'Max. pezzi', width: '160px'},
			   {dataField: 'maxGratis', label: 'Max. gratis', width: '160px'},
			   {dataField: 'pezzi', label: 'Pezzi', width: '160px'},
			   {dataField: 'gratis', label: 'Gratis', width: '160px'},
			   
			   
			   ];

var currentListenedIdResa = null;

//Per gestire in modo smmooth il ricaricamento!

class TableDettagliResa extends Component 
    {
   
	
	
	

	expandedRowRender = (record) => {return(<div>Ciao</div>)}
	onChangeCustom = (e) => {console.log(e)};
	

  onSubmit = () => {console.log('do validate')}
  
 	pezziRowRender = (text, record) => {return(<SubInput onChange={this.onChangeCustom} value={text} onSubmit={this.onSubmit}  />)}
   gratisRowRender = (text, record) => {return(<SubInput onChange={this.onChangeCustom} value={text} onSubmit={this.onSubmit}  />)}
   
    customRowRender = {'pezzi' : this.pezziRowRender , 'gratis' : this.gratisRowRender}

    
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
			header={header}/>
			)}
    }		
	
export default TableDettagliResa;

