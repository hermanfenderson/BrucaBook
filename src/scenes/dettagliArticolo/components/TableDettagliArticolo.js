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
			    {dataField: 'gratis', label: 'Gratis', width: '100px'},
			    
			   ];


const convertDetails = (inputData) =>
{
	let data = [];
     for (var propt2 in inputData)
      {
	  for (var propt in inputData[propt2]) 
		{   
			let input = inputData[propt2];
			let row = {key: propt, ...input[propt]};
			if (row.tipo === 'scontrini' || row.tipo === 'rese') row.pezzi = -1 * row.pezzi;
			if (row.tipo === 'rese') row.gratis = -1 * row.gratis;
			
			row.data = moment(row.data).format('DD-MM-YYYY');
			row.dettagli = (function(tipo) {  
				 switch(tipo) {
					 case 'scontrini':
    					return 'cassa '+row.cassa+' sc. '+row.numero;
					 case 'bolle':
    				    return 'rif. '+row.riferimento+' '+row.nomeFornitore;
    				 case 'rese':
    				    return 'rif. '+row.riferimento+' '+row.nomeFornitore;
    			
    				 case 'inventari':
    				 	return row.note;
    				 default:
    					return '';
					}
					})(row.tipo);
			data.push(row);
		}
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
			<WrappedTable {...props} header={header} selectRow={this.detailRow} detailRow={this.detailRow} data={convertDetails(this.props.dettagli)} />
			)}
    }		
	
export default withRouter(TableDettagliArticolo);

