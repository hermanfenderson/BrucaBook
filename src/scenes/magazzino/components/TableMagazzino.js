import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'



//E' un dato.... che passo come costante...
const header = [{dataField: 'key', label: 'EAN', width: '150px'},
			    {dataField: 'autore', label: 'Autore', width: '300px'},
			    {dataField: 'titolo', label: 'Titolo', width: '300px'},
			    {dataField: 'pezzi', label: 'Pezzi', width: '100px'},
			   ];

var listening = false;





class TableMagazzino extends Component 
    {
    componentDidMount() {
    	let result = null;
    	//Ascolto modifiche sulle bolle... non passo parametri...sono nella radice. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (!listening) result = this.props.listenMagazzino();
    	if (result === '') listening = true;
	}
	

    
    	render() { 
    	let props = {...this.props};
    	  return(
			<WrappedTable {...props} header={header}/>
			)}
    }		
	
export default TableMagazzino;

