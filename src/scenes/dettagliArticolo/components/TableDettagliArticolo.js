import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import moment from 'moment'



//E' un dato.... che passo come costante...
const header = [
	
			    {dataField: 'data', label: 'Data', width: '300px'},
			    {dataField: 'tipo', label: 'Tipo', width: '300px'},
			    {dataField: 'id', label: 'Id', width: '300px'},
			    {dataField: 'pezzi', label: 'Pezzi', width: '100px'},
			   ];


const convertDetails = (inputData) =>
{
	let data = [];
	console.log(inputData);
	for (var propt in inputData) 
		{
			let row = {key: propt, ...inputData[propt]};
			if (row.tipo === 'scontrino') row.pezzi = -1 * row.pezzi;
			row.data = moment(row.data).format('DD-MM-YYYY');
			data.push(row);
		}
	console.log(data);
	return data;	
}

class TableDettagliArticolo extends Component 
    {

       
    	render() { 
    	let props = {...this.props};
    	  return(
			<WrappedTable {...props} header={header} data={convertDetails(this.props.dettagli)} />
			)}
    }		
	
export default TableDettagliArticolo;

