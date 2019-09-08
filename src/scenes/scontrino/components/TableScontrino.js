//Ho rotto la schiavitù della wrapped table... in questo caso vado meglio custom....
import React, {Component} from 'react'


import WrappedTable from '../../../components/WrappedVirtualizedTable'

//E' un dato.... che passo come costante...
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
    	//this.listenScontrino(null, this.props);   		
    		}
	
	componentDidUpdate = (oldProps) => {
		//this.listenScontrino(oldProps, this.props);
	
	}
	
	 componentWillUnmount() {
	 	/*
	 	if (this.props.listeningItemScontrino && this.props.listeningItemScontrino[3])
    			{  
    				let currentListenedIdScontrino = this.props.listeningItemScontrino[3];
    	   			let params = [...this.props.period];
    	   			params.push(this.props.cassa)
    	   			params.push(currentListenedIdScontrino);
                   	this.props.offListenRigaScontrino(params, this.props.listenersItemScontrino); 
    	   		}
    	 */  	
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

	
   ordiniRow = (row,action=false) => {
		if (!action) return(row.ordini);
		this.props.setOrdiniModalVisible(row.ordini);
		
	}	
    
    	render() { 
      	let props = {...this.props};
    	let selectedItemKey = null;
    	let height = props.geometry.tableCoors.height;
    	let width = props.geometry.tableCoors.width;
    	
    //	let colsW = this.props.geometry.tableScontrinoCols;
      /*
        let header = [{dataField: 'ean', label: 'EAN', width: colsW.ean},
                {dataField: 'titolo', label: 'Titolo', width: colsW.titolo},
			    {dataField: 'prezzoUnitario', label: 'Eur', width: colsW.prezzoUnitario},
			    {dataField: 'pezzi', label: 'Q.tà', width: colsW.pezzi},
			      {dataField: 'sconto', label: 'Sc.', width: colsW.sconto},
			     {dataField: 'prezzoTotale', label: 'Tot.', width: colsW.prezzoTotale}
			   ];
    	*/
    	let header = this.props.geometry.header;
    		
    		     //'ean' : (text, record, index) => { return(<div style={{width: colsW.ean - 10}}> {text}</div>)},
    		//	'titolo' : (text, record, index) => { return(<div style={{width: colsW.titolo-10, whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis'}}> {text}</div>)}}
//'titolo' : (text, record, index) => {let w=parseInt(colsW.titolo/6.9); let c=text.length; let txt=(c>w) ? text.substring(0,w-4)+"..." : text; return(<div> {txt}</div>)}}


    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	
    	delete props['deleteRigaScontrino']; //Non la passo liscia...
    	delete props['setSelectedRigaScontrino']; //Idem
    	  return(
			<WrappedTable {...props} height={height} width={width} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow}  ordiniRow={this.ordiniRow} selectRow={this.editRow} header={header} />
			)}
    }		
	
export default TableScontrino;

