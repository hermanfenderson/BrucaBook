import React, {PureComponent} from 'react'
import WrappedTable from '../../../components/WrappedVirtualizedTable'
import { withRouter } from 'react-router-dom';
import {Spin} from 'antd';
import {getAliquotaIVA} from '../../../helpers/ean';




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
	





customRowRender = {
	                     'iva' : (text, record, index) => { return(<div style={{width: 30}}> {getAliquotaIVA(text,this.props.iva)}</div>)}
            			
            		}  
    
    	render() { 
    	let props = {...this.props};
        let detailRow = (props.noDetails) ? null : this.detailRow;
        let editRow = (props.noDetails) ? null : this.editRow;
        
        let selectRow = (props.selectedCallback) ? this.selectRow : (props.noDetails) ? null : this.detailRow;
          return(
    	  	<Spin spinning={(this.props.data.length===0)}>
			<WrappedTable {...props}  noSel={this.props.inModal} customRowRender={this.customRowRender} editRow={editRow} selectRow={selectRow} detailRow={detailRow}  header={this.props.header}/>
			</Spin>
			)}
    }		
	
export default withRouter(TableMagazzino);

