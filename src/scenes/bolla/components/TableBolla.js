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
    	this.props.listenRigaBolla(this.props.idBolla); 
	}
	
	componentWillUnmount() {
		//Smetto di ascoltare...
		this.props.offListenRigaBolla(this.props.idBolla); 
		
		
	}

    
    	render() { 
    	const props = this.props;	
    	  return(
			<WrappedTable {...props} header={header}/>
			)}
    }		
	
export default TableBolla;

