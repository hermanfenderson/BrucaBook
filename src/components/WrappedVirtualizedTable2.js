import React from 'react';

import { VariableSizeGrid as Grid } from 'react-window';
import {Row, Icon} from 'antd'; 

import classNames from 'classnames';

// These item sizes are arbitrary.
// Yours should be based on the content of the item.


function itemKey({ columnIndex, data, rowIndex }) {
   const item = data[rowIndex];
   return `${item.key}-${columnIndex}`;
}


const Header = (header) => 
{
	
let headCols = header.map((col, idx) => 
				  <div className={'vtHeadCell'} key={idx} style={{ display: 'table-cell', width:col.width}}>
                       {col.label}
                  </div>
			)	
return (
    <div>
    {headCols}
    </div>
)
};



class WrappedVirtualizedTable extends React.PureComponent {
//if (this.props.actionFirst)


componentDidUpdate(prevProps, prevState) {
  // only update chart if the data has changed
  if (prevProps.header !== this.props.header) {
   this.refs.gridRef.resetAfterColumnIndex(0,true);
  }
}

constructor(props) {
	super(props)
	//HEader con sel... al posto giusto LO USO SEMPRE
	this.header2 = [...this.props.header];
	(this.props.actionFirst) ? this.header2.unshift({label: 'Sel', width: 60}) : this.header2.push({label: 'Sel', width: 60})
	
	//Indice della action
	this.actIdx = this.props.actionFirst ? 0 : this.props.header.length;
	
	
}


actionCellRenderer = ({rowData, rowIndex}) => {
 return (
        <div className={'vtCellValue'}>
        {(this.props.deleteRow) && <Icon type="delete" onClick={() => { this.props.deleteRow(rowData)}}/>} 
		{(this.props.editRow) && <Icon type="edit" onClick={() => {   this.props.editRow(rowData)}}/>}  
       {(this.props.detailRow) && <Icon type={"search"} onClick={() => {this.props.detailRow(rowData)}}/>}  
       	{(this.props.pinRow) && <Icon type={(rowData[this.props.pinField]) ? "pushpin" : "pushpin-o" } onClick={() => { this.props.pinRow(rowData)}}/>}  
      
       {(this.props.saveRow) && <Icon type={"save"} onClick={() => { this.props.saveRow(rowData, rowIndex)}}/>}  
       {(this.props.ordiniRow) && (this.props.ordiniRow(rowData)) && <Icon type="team" onClick={() => { this.props.ordiniRow(rowData,true)}}/>}  
       {(this.props.bollaRow) && (this.props.bollaRow(rowData)) && <Icon type="shopping-cart" onClick={() => { this.props.bollaRow(rowData,true)}}/>}  
       {(this.props.scontrinoRow) && (this.props.scontrinoRow(rowData)) && <Icon type="smile-o" onClick={() => { this.props.scontrinoRow(rowData,true)}}/>}  
       
        </div>
        );
 }


onRowClick = ({event, index, rowData, column}) => {
	//Eseguo se l'utente non ha fatto click su una icona
	if ((column !== this.actIdx) && this.props.selectRow) this.props.selectRow(rowData);	
};

columnCount = this.props.header.length+1;


cellRenderer = (rowIndex, columnIndex, data) => {
	let cIdx = this.props.actionFirst ? columnIndex + 1 : columnIndex;
	
	if (columnIndex === this.actIdx) return data[rowIndex] ? this.actionCellRenderer({rowData: data[rowIndex], rowIndex: rowIndex}) : '';
	else 
		{   	let cellName = this.props.header[cIdx].dataField;
			let cellValue = data[rowIndex] ? data[rowIndex][cellName] : '';

			return(<div className={'vtCellValue'}>{cellValue}</div>);
		}	
}


Cell = ({ columnIndex, data, rowIndex, style }) => (
  <div className={classNames({'vtCell': true, 'vtCellSelected': (this.props.highlightedRowKey===data[rowIndex].key)})} style={style} onClick={(e) => {this.onRowClick({event: e, index: rowIndex, rowData: data[rowIndex], column: columnIndex})} }>
    {this.cellRenderer(rowIndex, columnIndex, data)}
  </div>
);

 //Item {rowIndex},{columnIndex}
  


render ()
     {
   let itemData = this.props.data;  
let columnWidths = (() => 
		{
		let cW = this.header2.map(h => h.width);
		return cW;
		})()
		
   return(
  <div >
  <Row >
   {Header(this.header2)}	
 
  </Row>
  <Grid 
    columnCount={this.columnCount}
    columnWidth={index => columnWidths[index]}
    height={this.props.height}
    rowCount={itemData ? itemData.length : 0}
    rowHeight={index => 40}
    width={this.props.width}
    itemData={itemData}
    itemKey={itemKey}
    ref='gridRef'
          
  >
    {this.Cell}
  </Grid>	
  </div> 
)
     	
     };

}

export default WrappedVirtualizedTable

/*
import React from 'react';
import {Table, Column } from 'react-virtualized'
import { Icon } from 'antd';
import classNames from 'classnames';

// Si appoggia alla react-virtualized table. Capace di filtrare e rortare 
// Gestisco internamente le funzioni di sort e di filter
// gestisco lo stato della ricerca internamente...
//disableSort disabilita il sort
//disableSortColumns disabilita il sort per una o più colonne

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
       {(this.props.ordiniRow) && (this.props.ordiniRow(rowData)) && <Icon type="team" onClick={() => { this.props.ordiniRow(rowData,true)}}/>}  
       {(this.props.bollaRow) && (this.props.bollaRow(rowData)) && <Icon type="shopping-cart" onClick={() => { this.props.bollaRow(rowData,true)}}/>}  
       {(this.props.scontrinoRow) && (this.props.scontrinoRow(rowData)) && <Icon type="smile-o" onClick={() => { this.props.scontrinoRow(rowData,true)}}/>}  
       
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
		       disableSort = {this.props.disableSortColumns && this.props.disableSortColumns[col.dataField]}
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
		     disableSort = {true}
		  
		     />
			);
	let data = (this.props.filters) ? 
  		this.props.data.map((record) => 
  			{
  			//Il record è buono... se non esiste quel campo nel record oppure esiste e la regex è rispettata	
  			let good = true;
  			
  			for (var prop in this.props.filters)
  					
  				{  let regex = new RegExp(this.props.filters[prop],'i');
  				
  					if (this.props.filters[prop] && (record[prop]!==undefined) && (!record[prop].match(regex))) good = false;
  					if (this.props.filters[prop] && ((record[prop]===undefined) || record[prop].length===0)) good = false;
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
	let rowClassName = ({index})	=> {
							if (index===-1) return("ReactVirtualized__Table__headerRow");
							let row = sortedData[index];
							let selected = (this.props.highlightedRowKey===row.key);
							let pinned = (this.props.pinField && row[this.props.pinField])
							return (classNames({ReactVirtualized__Table__Row: true, ReactVirtualized__Table__Selected: selected, ReactVirtualized__Table__Pinned: pinned}))
							};
		
	
		
	if (this.props.deleteRow || this.props.editRow || this.props.detailRow || this.props.pinRow || this.props.saveRow) 
  		{if (this.props.actionFirst)
  		    columns.unshift(actionColumn);
			else columns.push(actionColumn);
  		}
   return(
        	 <Table rowClassName={rowClassName} sortBy={this.state.sortBy} sortDirection={this.state.sortDirection} sort={this.props.disableSort ? null: sort} onRowClick={this.onRowClick} height={this.props.height} width={this.props.width} headerHeight={25} rowHeight={25} rowCount={data.length} rowGetter={rowGetter}>
			{columns}
        	 </Table>);
     }
}

export default WrappedVirtualizedTable

*/




