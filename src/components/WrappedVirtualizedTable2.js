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
	//Gestisco hover e direzione del sort...
	this.state = {
    //options: [],
    hoverKey: null,
  }
	

	//Indice della action
	this.actIdx = this.props.actionFirst ? 0 : this.props.header.length;
	
	
}

onHeaderClick = ({event, dataField}) => {
		//loop su tre stati...sortBy null, sortDirection ASC sortDirection DESC
	let sortBy = dataField;
	let sortDirection = 'ASC';
	if (this.state.sortBy === dataField)
		{
		if (this.state.sortDirection==='ASC') sortDirection = 'DESC';
	    if (this.state.sortDirection==='DESC') {sortBy = null, sortDirection = null} 	
		}
	let newState = {...this.state, sortBy: sortBy, sortDirection: sortDirection};
	this.setState(newState);

};

Header = (header) => 
{
	
let headCols = header.map((col, idx) => 
				  <div className={'vtHeadCell'} 
				  key={idx} 
				  onClick={(e) => {this.onHeaderClick({event: e, dataField:col.dataField })} }
                             
				  style={{ display: 'table-cell', width:col.width}}>
                       {col.label} 
                        {((col.dataField === this.state.sortBy) && (this.state.sortDirection === 'ASC')) ? <Icon type="sort-ascending" /> : null}     
                  {((col.dataField === this.state.sortBy) && (this.state.sortDirection === 'DESC')) ? <Icon type="sort-descending" /> : null}     
                 </div>
			)	
return (
    <div>
    {headCols}
    </div>
)
};

actionCellRenderer = ({rowData, rowIndex}) => {
 return (
        <div className={'vtCellValue'}>
        {(this.props.deleteRow) && <Icon type="delete" onClick={() => { this.props.deleteRow(rowData)}}/>} 
		{(this.props.editRow) && <Icon type="edit" onClick={() => {   this.props.editRow(rowData)}}/>}  
       {(this.props.detailRow) && <Icon type={"search"} onClick={() => {this.props.detailRow(rowData)}}/>}  
       	{(this.props.pinRow) && <Icon  type={"pushpin"} theme={(rowData[this.props.pinField]) ? "filled" : "outlined" } onClick={() => { this.props.pinRow(rowData)}}/>}  
      
       {(this.props.saveRow) && <Icon type={"save"} onClick={() => { this.props.saveRow(rowData, rowIndex)}}/>}  
       {(this.props.ordiniRow) && (this.props.ordiniRow(rowData)) && <Icon type="team" onClick={() => { this.props.ordiniRow(rowData,true)}}/>}  
       {(this.props.bollaRow) && (this.props.bollaRow(rowData)) && <Icon type="shopping-cart" onClick={() => { this.props.bollaRow(rowData,true)}}/>}  
       {(this.props.scontrinoRow) && (this.props.scontrinoRow(rowData)) && <Icon type="smile" onClick={() => { this.props.scontrinoRow(rowData,true)}}/>}  
       
        </div>
        );
 }


onRowClick = ({event, index, rowData, column}) => {
	//Eseguo se l'utente non ha fatto click su una icona
	if ((column !== this.actIdx) && this.props.selectRow) this.props.selectRow(rowData);	
};

onMouseOver = ({event, index, rowData}) => {
	//Aggiorno lo stato
	if (rowData)
		{
		let newState = {...this.state}
		newState.hoverKey = rowData.key;
		this.setState(newState);
		}
};
onMouseOut = () => {
		let newState = {...this.state}
		newState.hoverKey = null;
		this.setState(newState);
	
}

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
  <div className={classNames({'vtCell': true, 
							  'vtCellHover': (this.state.hoverKey===data[rowIndex].key),
                             
                              'vtCellSelected': (this.props.highlightedRowKey===data[rowIndex].key),
                              
                              'vtCellPinned': (this.props.pinField && data[rowIndex][this.props.pinField])})} 
                              style={style} 
                              onClick={(e) => {this.onRowClick({event: e, index: rowIndex, rowData: data[rowIndex], column: columnIndex})} }
                              onMouseOver={(e) => {this.onMouseOver({event: e, index: rowIndex, rowData: data[rowIndex]})} }
                              onMouseOut={this.onMouseOut} >
    {this.cellRenderer(rowIndex, columnIndex, data)}
  </div>
);

 
	

render ()
     {
   let dataCpy = [...this.props.data]; //Shallow copy utile per il sort...
   let itemData = (this.props.filters) ? 
  		dataCpy.map((record) => 
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
  			dataCpy;
  	//Se devo sortare... applico una funzione di sort... altrimenti ritornoa sortedData... data...
  	let sortedData = (this.state.sortBy) ? 
  					  itemData.sort((a, b) => 
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
  					  : itemData;
  			
  	let sort = ({defaultSortDirection, event, sortBy, sortDirection}) => {
		let newState = {...this.state, sortBy: sortBy, sortDirection: sortDirection};
		this.setState(newState);
	} 
	
this.header2 = [...this.props.header];
	(this.props.actionFirst) ? this.header2.unshift({label: 'Sel', width: this.props.actionWidth || '60px'}) : this.header2.push({label: 'Sel', width: this.props.actionWidth || '60px'})
	  
let columnWidths = (() => 
		{
		let cW = this.header2.map(h => h.width);
		return cW;
		})()
		
   return(
  <div >
  <Row >
   {this.Header(this.header2)}	
 
  </Row>
  <Grid 
    columnCount={this.columnCount}
    columnWidth={index => columnWidths[index]}
    height={this.props.height - 30}
    rowCount={itemData ? itemData.length : 0}
    rowHeight={index => 40}
    width={this.props.width}
    itemData={sortedData}
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









