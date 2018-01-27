/*
Modificata per gestire filtri full text case insentive in and logico... 
forma: filters={{titolo: 'arte', autore: 'paola'}} 

Aggiungo il concetto di pinned...funziona con un campo boolean che passo come parametro e con un metodo da chiamare
quando viene premuto...

Aggiunto il cocnetto di custom renderer... passo un oggetto customRowRender con il nome del campo per cui voglio cambiare il comportamento...
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
        {(this.props.deleteRow) && <Icon type="delete" onClick={() => { lastRowClicked = row.key; this.props.deleteRow(row)}}/>} 
		{(this.props.editRow) && <Icon type="edit" onClick={() => { lastRowClicked = row.key;  this.props.editRow(row)}}/>}  
       	{(this.props.pinRow) && <Icon type={(row[this.props.pinField]) ? "pushpin" : "pushpin-o" } onClick={() => { lastRowClicked = row.key;  this.props.pinRow(row)}}/>}  
       {(this.props.detailRow) && <Icon type={"search"} onClick={() => { lastRowClicked = row.key;  this.props.detailRow(row)}}/>}  
       {(this.props.saveRow) && <Icon type={"save"} onClick={() => { lastRowClicked = row.key;  this.props.saveRow(row)}}/>}  
       
        </div>
        );
 }
 
 
rowClassName = (record,index) => {
	let rowClassName = (record.key === this.props.highlightedRowKey) ? 'ant-table-row ant-table-row-highlight' : 'ant-table-row';
	if (this.props.pinField && record[this.props.pinField]) rowClassName += ' ant-table-row-pinned';
	return(rowClassName);
} 

ordinaryRowRender = (cell,row) => {

 return(<div>{cell}</div>);

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
  	             	'render': (text, record) => 
  	             	
  	            			    {return (this.props.customRowRender && this.props.customRowRender[header.dataField]) ? (this.props.customRowRender[header.dataField])(text,record) : this.ordinaryRowRender(text,record)}
  	            	
  	            		})
  	            	}
  				);
  	let actionColumn = {
  		            'key': 'Selezione',
  					'render': (text, record) => {return this.actionRowRender(text,record)},
  					'width': this.props.actionWidth || '60px',
  					'title': 'Sel.'
  	            	};
  	let data = (this.props.filters) ? 
  		this.props.data.map((record) => 
  			{
  			//Il record è buono... se non esiste quel campo nel record oppure esiste e la regex è rispettata	
  			let good = true;
  			
  			for (var prop in this.props.filters)
  					
  				{  let regex = new RegExp(this.props.filters[prop],'i');
  					if ((record[prop]) && (!record[prop].match(regex))) good = false;
  				}
  			return (good ? {...record} : null) 
  			}).filter((record => !!record)) :
  			this.props.data;
  			
  	if (this.props.deleteRow || this.props.editRow || this.props.detailRow || this.props.pinRow || this.props.saveRow) 
  		{if (this.props.actionFirst)
  		    columns.unshift(actionColumn);
			else columns.push(actionColumn);
  		}
    return(
        	 <Table  expandedRowRender={this.props.expandedRowRender} size={this.props.size ? this.props.size : 'middle'} onRow={this.onRow} ref='antTable' rowClassName={this.rowClassName} scroll={{ y: this.props.height}}  loading={this.props.loading} pagination={false} columns={columns} dataSource={data}/>
       		);	
     }	
} 

export default WrappedTable;
 


