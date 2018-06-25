import React from 'react';
import {Table, Column } from 'react-virtualized'
import { Icon } from 'antd';


class WrappedVirtualizedTable extends React.Component {
	
onRowClick = ({event, index, rowData}) => {
var myRe = /<i.+class=.anticon/m;
var element = event.target.outerHTML;

var bool = myRe.test(element);
//Eseguo se l'utente non ha fatto click su una icona
if (!bool)
	{
	if (this.props.selectRow) this.props.selectRow(rowData);	
	}


};



actionCellRenderer = ({rowData, rowIndex}) => {
 return (
        <div>
        {(this.props.deleteRow) && <Icon type="delete" onClick={() => { this.props.deleteRow(rowData)}}/>} 
		{(this.props.editRow) && <Icon type="edit" onClick={() => {   this.props.editRow(rowData)}}/>}  
       	{(this.props.pinRow) && <Icon type={(rowData[this.props.pinField]) ? "pushpin" : "pushpin-o" } onClick={() => { this.props.pinRow(rowData)}}/>}  
       {(this.props.detailRow) && <Icon type={"search"} onClick={() => {this.props.detailRow(rowData)}}/>}  
       {(this.props.saveRow) && <Icon type={"save"} onClick={() => { this.props.saveRow(rowData, rowIndex)}}/>}  
       
        </div>
        );
 }
 

render ()
     {
     let columns = this.props.header.map((col,index) =>
		    <Column 
		       label={col.label}
		       dataKey = {col.dataField}
		       width = {col.width}
		       key = {index}
		    />
		);
	let actionColumn = 
			(
			 <Column 	
			 label={'Sel.'}
		     dataKey = {'sel'}
		     width = {60}
		     key={-1}
		     cellRenderer={this.actionCellRenderer}
		     />
			);
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
	let rowGetter = ({index})	=> {
							let row = data[index];
							row.sel = index;
							return(row);
							};
		
	if (this.props.deleteRow || this.props.editRow || this.props.detailRow || this.props.pinRow || this.props.saveRow) 
  		{if (this.props.actionFirst)
  		    columns.unshift(actionColumn);
			else columns.push(actionColumn);
  		}
  	console.log(columns);	
    return(
        	 <Table onRowClick={this.onRowClick} height={this.props.height} width={this.props.width} headerHeight={25} rowHeight={25} rowCount={data.length} rowGetter={rowGetter}>
			{columns}
        	 </Table>);
     }
}

export default WrappedVirtualizedTable
