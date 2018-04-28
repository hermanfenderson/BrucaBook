//Ho rotto la schiavitù della wrapped table... in questo caso vado meglio custom....
import React, {Component} from 'react'


import WrappedTable from '../../../components/WrappedTable'


//E' un dato.... che passo come costante...
const header = [{dataField: 'ean', label: 'EAN', width: '165px'},
                {dataField: 'titolo', label: 'Titolo', width: '290px'},
			    {dataField: 'prezzoUnitario', label: 'Eur', width: '70px'},
			    {dataField: 'pezzi', label: 'Q.tà', width: '60px'},
			      {dataField: 'sconto', label: 'Sc.', width: '60px'},
			     {dataField: 'prezzoTotale', label: 'Tot.', width: '70px'}
			   ];
//Per gestire in modo smmooth il ricaricamento!

class TableScontrino extends Component 
    {
    	
    listenScontrino = (oldProps, newProps) => 
    {
    		let newId = newProps.scontrino;
    		let oldId = (oldProps && oldProps.listeningItemScontrino) ? oldProps.listeningItemScontrino[3] : null;
    		if (newId !== oldId)
    			{   
    			    if (oldId)
    			    	{
    			    	let params = [...this.props.period];
    	   				params.push(this.props.cassa)
    	   				params.push(oldId);
                   		newProps.offListenRigaScontrino(params, oldProps.listenersItemScontrino); 	
    			    	}
    				let params = newProps.period;
    	   			params.push(newProps.cassa);
    	   			params.push(newProps.scontrino);
    	   			newProps.listenRigaScontrino(params); 
    			}
    	   

    }
    
    
    componentDidMount() {
    	this.listenScontrino(null, this.props);   		
    		}
	
	componentDidUpdate = (oldProps) => {
		this.listenScontrino(oldProps, this.props);
	}
	
	 componenWillUnmount() {
    	   		
    	if (this.props.listeningItemScontrino && this.props.listeningItemScontrino[3])
    			{
    				
    			    let currentListenedIdScontrino = this.props.listeningItemScontrino[3];
    	   			let params = [...this.props.period];
    	   			params.push(this.props.cassa)
    	   			params.push(currentListenedIdScontrino);
                   	this.props.offListenRigaScontrino(params, this.props.listenersItemScontrino); 
    	   		}
    	   	
	}
	
	
	
	
	deleteRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.cassa);
    	params.push(this.props.scontrino);
		this.props.deleteRigaScontrino(params,row.key,row);
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

