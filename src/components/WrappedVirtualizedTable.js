import React from 'react';
import {Table, Column } from 'react-virtualized'
import { Icon } from 'antd';

// Si appoggia alla react-virtualized table. Capace di filtrare e rortare 
// Gestisco internamente le funzioni di sort e di filter
// gestisco lo stato della ricerca internamente...
// Penso di dover avere uno stato locale specifico per gestire la sort
class WrappedVirtualizedTable extends React.Component {
constructor(props, context) {
    super(props, context);
    this.state = {
      sortBy: null,
      sortDirection: null,
    }
 }
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
  	//Se devo sortare... applico una funzione di sort... altrimenti ritornoa sortedData... data...
  	let sortedData = (this.state.sortBy) ? 
  					  data.sort((a, b) => 
  							{
  							let sortBool = false;	
  							if (typeof(a[this.state.sortBy]) === 'string') 
  								{
  									sortBool = a[this.state.sortBy].localeCompare(b[this.state.sortBy]);
  									
  								}
  							else sortBool = a[this.state.sortBy] - b[this.state.sortBy];
  							if (this.state.sortDirection==='DESC') sortBool = -sortBool;
  							return sortBool;
  							}) 
  					  : data;
  			
  	let sort = ({defaultSortDirection, event, sortBy, sortDirection}) => {
		let newState = {sortBy: sortBy, sortDirection: sortDirection};
		this.setState(newState);
	} 
		
	let rowGetter = ({index})	=> {
							let row = sortedData[index];
							row.sel = index;
							return(row);
							};
		
	if (this.props.deleteRow || this.props.editRow || this.props.detailRow || this.props.pinRow || this.props.saveRow) 
  		{if (this.props.actionFirst)
  		    columns.unshift(actionColumn);
			else columns.push(actionColumn);
  		}
   return(
        	 <Table sortBy={this.state.sortBy} sortDirection={this.state.sortDirection} sort={sort} onRowClick={this.onRowClick} height={this.props.height} width={this.props.width} headerHeight={25} rowHeight={25} rowCount={data.length} rowGetter={rowGetter}>
			{columns}
        	 </Table>);
     }
}

export default WrappedVirtualizedTable
