import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'


//E' un dato.... che passo come costante...
const header = [{dataField: 'ean', label: 'EAN'},
                {dataField: 'titolo', label: 'Titolo'},
			    {dataField: 'prezzoUnitario', label: 'Prezzo', width: '60'},
			    {dataField: 'pezzi', label: 'Quantità', width: '60'},
			    {dataField: 'gratis', label: 'Gratis', width: '60'},
			    {dataField: 'prezzoTotale', label: 'Totale', width: '70'}
			   ];


class TableBolla extends Component 
    {
    componentDidMount() {
    	//Ascolto modifiche sulle righe della bolla
    	this.props.listenRigaBolla({'bollaId':this.props.idBolla}); 
	}
	
	componentWillUnmount() {
		//Smetto di ascoltare...
		this.props.offListenRigaBolla({'bollaId':this.props.idBolla}); 
		
		
	}
	
	deleteRow = (row) => {
		this.props.deleteRigaBolla({'bollaId':this.props.idBolla,'itemId':row.key});
	}
	
	editRow = (row) => {
		this.props.setSelectedRigaBolla(row);
	}

    
    	render() { 
    	let props = {...this.props};
    	delete props['deleteRigaBolla']; //Non la passo liscia...
    	delete props['setSelectedRigaBolla']; //Idem
    	  return(
			<WrappedTable {...props} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default TableBolla;

