/*

*/

import React from 'react';
import ReactDOM from 'react-dom';
import { Icon, Table } from 'antd';

var lastRowClicked = null; //Non posso aspettare che ritorni la modifica dallo stato...

class WrappedTable extends React.Component {
componentDidMount()
  {  this.node = ReactDOM.findDOMNode(this.refs.antTable).getElementsByClassName('ant-table-body')[0];
  }
  
  

  componentDidUpdate() {
  	lastRowClicked = this.props.highlightedRowKey; //Ma quando arriva me la prendo...
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
		{(this.props.editRow) && <Icon type="edit" onClick={() => { lastRowClicked = row.key;  this.props.editRow(row)}}/>}  
        </div>
        );
 }
 
 
rowClassName = (record,index) => {
	return((record.key === this.props.highlightedRowKey) ? 'ant-table-row ant-table-row-highlight' : 'ant-table-row');
} 
ordinaryRowRender = (cell,row) => {

if (row.key === this.props.highlightedRowKey) return(<div style={{'color':'#108ee9','fontWeight':'bold'}}>{cell}</div>);
 else  return(<div>{cell}</div>);

} 

onRow=(record, other) => ({
  onClick: () => {if (lastRowClicked!== record.key) {lastRowClicked = record.key; this.selectRow(record);}}
})


render ()
     {
   
    let columns = this.props.header.map((header) => 
  	            	{
  	            		return({
  	            	'key': header.dataField,		
  	             	'title':  header.label,
  	             	'dataIndex': header.dataField,
  	             	 'width': header.width,
  	             	'render': (text, record) => {return this.ordinaryRowRender(text,record)}
  	            		})
  	            	}
  				);
  	let actionColumn = {
  		            'key': 'Selezione',
  					'render': (text, record) => {return this.actionRowRender(text,record)},
  					'width': this.props.actionWidth || '60px',
  					'title': 'Sel.'
  	            	};
  	if (this.props.deleteRow || this.props.editRow) 
  		{if (this.props.actionFirst)
  		    columns.unshift(actionColumn);
			else columns.push(actionColumn);
  		}
    return(
        	 <Table size={this.props.size ? this.props.size : 'middle'} onRow={this.onRow} ref='antTable' rowClassName={this.rowClassName} scroll={{ y: this.props.height}}  loading={this.props.loading} pagination={false} columns={columns} dataSource={this.props.data}/>
       		);	
     }	
} 

export default WrappedTable;
 


