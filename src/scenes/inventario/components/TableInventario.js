import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedVirtualizedTable'
import { withRouter } from 'react-router-dom';

//E' un dato.... che passo come costante...
/*
const header = [{dataField: 'ean', label: 'EAN', width: '160px'},
                {dataField: 'titolo', label: 'Titolo', width: '320px'},
                {dataField: 'autore', label: 'Autore', width: '280px'},
			    
			    {dataField: 'prezzoListino', label: 'Prezzo', width: '60px'},
			    {dataField: 'stock', label: 'Stock', width: '60px'},
			   
			    {dataField: 'pezzi', label: 'Delta', width: '60px'},
			   ];

*/
// Fixed ascoltatori ecc..

class TableInventario extends Component 
    {
    componentDidMount = () =>{
    	   	this.props.listenRigaInventario(this.props.idInventario); 
	}
	
	
	componentWillUnmount = () => {
		  			this.props.offListenRigaInventario(this.props.listeningItemInventario); 
    	   			this.props.resetTableInventario();
	}
/*	
	shouldComponentUpdate(nextProps, nextState) {
		let shouldUpdate = false;
		let props = this.props;
		if (!equal(props.height, nextProps.height)) shouldUpdate = true;
		if (!equal(props.header, nextProps.header)) shouldUpdate = true;
		if (!equal(props.data, nextProps.data)) shouldUpdate = true;
		
		 return shouldUpdate;
	}
*/

	deleteRow = (row) => {
	   this.props.deleteRigaInventario(this.props.idInventario,row.key,row);
	}
	
	editRow = (row) => {
		
		this.props.setSelectedRigaInventario(row);
	}

    pinRow = (row) => {
    	this.props.togglePin(this.props.idInventario,row.key,row, 'pinned');
    }
    
    detailRow = (row) => {
    	this.props.history.push('/dettagli/'+row.ean);
    }
    
  //  customRowRender = {

   // 		 	'titolo' : (text, record, index) => { return(<div style={{width: this.props.header[1].width-10, whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis'}}> {text}</div>)}}

    	render() { 
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	delete props['deleteRigaInventario']; //Non la passo liscia...
    	delete props['setSelectedRigaInventario']; //Idem
    	  return(
			<WrappedTable {...props}  highlightedRowKey={selectedItemKey} detailRow={this.detailRow} pinRow={this.pinRow} pinField={'pinned'} deleteRow={this.deleteRow} selectRow={this.editRow} width={this.props.width} header={this.props.header}/>
			)}
    }		
	
export default withRouter(TableInventario);

