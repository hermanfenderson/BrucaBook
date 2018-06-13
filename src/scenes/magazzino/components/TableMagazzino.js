import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import { withRouter } from 'react-router-dom';
import {Spin} from 'antd';





class TableMagazzino extends Component 
    {
    	
    detailRow = (row) => {
    	this.props.history.push('/dettagli/'+row.key);
    }
	selectRow = (row) => {
		this.props.selectedCallback(row.key);
	}
	
    componentDidMount() {
     //Ascolto modifiche sulle bolle... non passo parametri...sono nella radice. Ma sono pronto ad ascoltare di nuovo se non ci sono riuscito prima...
    	if (this.props.listening!=='')  this.props.listenMagazzino("");
    		
	}
	

    
    	render() { 
    	let props = {...this.props};
        let detailRow = (props.noDetails) ? null : this.detailRow;
        let selectRow = (props.selectedCallback) ? this.selectRow : (props.noDetails) ? null : this.detailRow;
        
    	  return(
    	  	<Spin spinning={(this.props.data.length===0)}>
			<WrappedTable {...props} selectRow={selectRow} detailRow={detailRow}  header={this.props.header}/>
			</Spin>
			)}
    }		
	
export default withRouter(TableMagazzino);

