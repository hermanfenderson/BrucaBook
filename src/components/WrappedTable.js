/*

*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Icon, Table } from 'antd';


class WrappedTable extends React.Component {
componentDidMount()
  {  this.node = ReactDOM.findDOMNode(this.refs.antTable).getElementsByClassName('ant-table-body')[0];
  }
  
  

  componentDidUpdate() {
	   if (this.props.tableScroll)
			{
	        this.node.scrollTop = this.node.scrollHeight;
			this.props.toggleTableScroll(false); //Resetto lo scroll...
			}
 }
	
selectRow = (row) => {
 	if(this.props.selectRow) this.props.selectRow(row);
 }
 
 
actionRowRender = (cell, row) => {
   return (
        <div>
        {(this.props.deleteRow) && <Icon type="delete" onClick={() => { this.props.deleteRow(row)}}/>} 
		{(this.props.editRow) && <Icon type="edit" onClick={() => { this.props.editRow(row)}}/>}  
        </div>
        );
 }
 
 
 
ordinaryRowRender = (cell,row) => {
 if (row.key === this.props.highlightedRowKey) return(<div style={{'color':'#108ee9','fontWeight':'bold'}} onClick={() => { this.props.selectRow(row)}}>{cell}</div>);
 else  return(<div onClick={() => { this.props.selectRow(row)}}>{cell}</div>);
 
} 


render ()
     {
    let columns = this.props.header.map((header) => 
  	            	{
  	            		return({
  	             	'title':  header.label,
  	             	'dataIndex': header.dataField,
  	             	 'width': header.width,
  	             	'render': (text, record) => {return this.ordinaryRowRender(text,record)}
  	            		})
  	            	}
  				);
  		if (this.props.deleteRow || this.props.editRow) columns.push(
  					{
  					'render': (text, record) => {return this.actionRowRender(text,record)},
  					'width': '60px',
  					'title': 'Sel.'
  	            	}
  	            	
  				)	
  	    return(
        	 <Table ref='antTable' scroll={{ y: this.props.height}} size={'middle'}  loading={this.props.loading} pagination={false} columns={columns} dataSource={this.props.data}/>
       		);	
     }	
} 

export default WrappedTable;
 


