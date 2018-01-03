import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import moment from 'moment'
import { withRouter } from 'react-router-dom';



//E' un dato.... che passo come costante...
const header = [
	
			    {dataField: 'data', label: 'Data', width: '300px'},
			    {dataField: 'tipo', label: 'Tipo', width: '300px'},
			    {dataField: 'dettagli', label: 'Dettagli', width: '300px'},
			    
			    {dataField: 'pezzi', label: 'Pezzi', width: '100px'},
			   ];


const convertDetails = (inputData) =>
{
	let data = [];
	for (var propt in inputData) 
		{
			let row = {key: propt, ...inputData[propt]};
			if (row.tipo === 'scontrino') row.pezzi = -1 * row.pezzi;
			row.data = moment(row.data).format('DD-MM-YYYY');
			row.dettagli = (function(tipo) {  
				 switch(tipo) {
					 case 'scontrino':
    					return 'cassa '+row.cassa+' sc. '+row.numero;
					 case 'bolla':
    				    return 'rif. '+row.riferimento+' '+row.fornitore;
    				 default:
    					return '';
					}
					})(row.tipo);
			data.push(row);
		}
	return data;	
}

class TableDettagliArticolo extends Component 
    {

detailRow = (row) => {
    	this.props.history.push('/'+row.tipo+'/'+row.id);
    }
    
    	render() { 
    	let props = {...this.props};
    	  return(
			<WrappedTable {...props} header={header} detailRow={this.detailRow} data={convertDetails(this.props.dettagli)} />
			)}
    }		
	
export default withRouter(TableDettagliArticolo);

