import React, {PureComponent} from 'react'
import WrappedTable from '../../../components/WrappedVirtualizedTable'
import { withRouter } from 'react-router-dom';
import {Spin} from 'antd';





class TableMagazzino extends PureComponent 
    {
    	
    detailRow = (row) => {
    	this.props.history.push('/dettagli/'+row.key);
    }
    
    editRow = (row) => {
    	this.props.history.push('/catalogo/'+row.key);
    }
    
	selectRow = (row) => {
		this.props.selectedCallback(row.key);
	}
	
    componentDidMount() {
     //Ascolto modifiche sulle bolle... non passo parametri...sono nella radice. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (this.props.listening!=='')  this.props.listenMagazzino("");
    		
	}
	
componentWillReceiveProps()
{
	console.log("ho props nuove");
	console.log(this.props.height);
}
    
    	render() { 
    	console.log("Sto renderizzando");
    	let props = {...this.props};
        let detailRow = (props.noDetails) ? null : this.detailRow;
        let editRow = (props.noDetails) ? null : this.editRow;
        
        let selectRow = (props.selectedCallback) ? this.selectRow : (props.noDetails) ? null : this.detailRow;
        
    	  return(
    	  	<Spin spinning={(this.props.data.length===0)}>
			<WrappedTable {...props}  disableSortColumns={{ean: true}} editRow={editRow} selectRow={selectRow} detailRow={detailRow}  header={this.props.header}/>
			</Spin>
			)}
    }		
	
export default withRouter(TableMagazzino);

