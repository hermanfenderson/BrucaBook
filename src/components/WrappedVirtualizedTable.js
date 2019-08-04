import React from 'react';

import { VariableSizeGrid as Grid } from 'react-window';
import {Row, Icon} from 'antd'; 
import Empty from './Empty';
import classNames from 'classnames';

// These item sizes are arbitrary.
// Yours should be based on the content of the item.
const SortSvg = () => (
  <svg width="12" height="12" >       
     <image href="/sort.svg"   width="12" height="12"/>    
</svg>
);
const SortAlphaAscSvg = () => (
  <svg width="12" height="12">       
     <image href="/sort-alpha-asc.svg"  width="12" height="12"/>    
</svg>
);
const SortAlphaDescSvg = () => (
  <svg width="12" height="12">       
     <image href="/sort-alpha-desc.svg"  width="12" height="12"/>    
</svg>
);
const SortNumericAscSvg = () => (
  <svg width="12" height="12">       
     <image href="/sort-numeric-asc.svg"  width="12" height="12"/>    
</svg>
);
const SortNumericDescSvg = () => (
  <svg width="12" height="12">       
     <image href="/sort-numeric-desc.svg"  width="12" height="12"/>    
</svg>
);

function itemKey({ columnIndex, data, rowIndex }) {
   const item = data[rowIndex];
   return `${item.key}-${columnIndex}`;
}




class WrappedVirtualizedTable extends React.PureComponent {
//if (this.props.actionFirst)


componentDidUpdate(prevProps, prevState) {
	 let last = Object.keys(this.dataIndex).length - 1;
  // only update chart if the data has changed
  if (prevProps.header !== this.props.header && this.gridRef.current) {
    this.gridRef.current.resetAfterColumnIndex(0,true);
  }
  
  if (this.props.tableScroll)
			{
			if (last>=0) 
				{this.gridRef.current.scrollToItem({rowIndex:last}); //Vado alla fine...
				this.props.toggleTableScroll(false); //Resetto lo scroll...
				}
			}

  if (this.props.tableScrollByKey)
			{
			let rowToGo = -1;
			if (this.props.tableScrollByKey)
					{
					 if (rowToGo !== this.dataIndex[this.props.tableScrollByKey]) rowToGo = this.dataIndex[this.props.tableScrollByKey];
					 else rowToGo = -1;
					}
					
			if (rowToGo >= 0) this.gridRef.current.scrollToItem({align: 'center', rowIndex: rowToGo}); //Vado alla riga richiesta...
		    this.props.setTableScrollByKey(null); //Resetto lo scroll...
			
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
	
    this.gridRef = React.createRef();
    this.dataIndex = {};

	//Indice della action
	this.actIdx = this.props.actionFirst ? 0 : this.props.header.length;
	
	
}

onHeaderClick = ({event, col}) => {
		//loop su tre stati...sortBy null, sortDirection ASC sortDirection DESC
if (col.sort)
	{
	let sortBy = col.dataField;
	let sortDirection = 'ASC';
	if (this.state.sortBy === col.dataField)
		{
		if (this.state.sortDirection==='ASC') sortDirection = 'DESC';
	    if (this.state.sortDirection==='DESC') {sortBy = null; sortDirection = null} 	
		}
	let newState = {...this.state, sortBy: sortBy, sortDirection: sortDirection, sortType: col.sort };
	this.setState(newState);
	}
};

Header = (header) => 
{
let leftPos = [];
leftPos.push(0);
for (let i=0; i<header.length; i++) leftPos.push(header[i].width+leftPos[i]); //Posizioni degli header...
let headCols = header.map((col, idx) => 
				  {
				  return(<div className={'vtHeadCell'} 
				  key={idx} 
				  onClick={(e) => {this.onHeaderClick({event: e, col:col })} }
                             
				  style={{ height: 30, position: 'absolute', left: leftPos[idx], width: col.width}}>
                       {col.label} 
                    {((col.dataField === this.state.sortBy) && (this.state.sortDirection === 'ASC') && (col.sort === 'string')) ? <Icon component={SortAlphaAscSvg} /> : null}     
                
                  {((col.dataField === this.state.sortBy) && (this.state.sortDirection === 'DESC') && (col.sort === 'string')) ? <Icon component={SortAlphaDescSvg} /> : null}     
                   {((col.dataField === this.state.sortBy) && (this.state.sortDirection === 'ASC') && (col.sort === 'number')) ? <Icon component={SortNumericAscSvg} /> : null}     
                
                  {((col.dataField === this.state.sortBy) && (this.state.sortDirection === 'DESC') && (col.sort === 'number')) ? <Icon component={SortNumericDescSvg} /> : null}     
                 {((col.sort) && (col.dataField  !== this.state.sortBy)) ? <Icon component={SortSvg} /> : null}     
               
                 </div>
                 )
				  }
                 
			)	
return (
    <div style={{ height: 30}}>
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

		    let customRender = (this.props.customRowRender) ? this.props.customRowRender[cellName] : null;
		    //Se ho un render specifico per questa colonna....
		    if (customRender) {
		    		        return customRender(cellValue, data[rowIndex], rowIndex);
		    				}
			else return(<div className={classNames({'vtCellValue': true, 'vtCellEllipsis': this.props.header[cIdx].ellipsis})} style={{width: this.props.header[cIdx].width}}>{cellValue}</div>);
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
  							if (this.state.sortType === 'string') 
  								{
  									if ((a[this.state.sortBy] !== undefined) && (b[this.state.sortBy] !== undefined)) sortBool = a[this.state.sortBy].localeCompare(b[this.state.sortBy]);
  									
  								}
  							else if ((a[this.state.sortBy] !== undefined) && (b[this.state.sortBy] !== undefined))  sortBool = a[this.state.sortBy] - b[this.state.sortBy];
  							if (this.state.sortDirection==='DESC') sortBool = -sortBool;
  							return sortBool;
  							}) 
  					  : itemData;
  			
  	 
//Genero un indice che associa aalla chiave la sua posizione nell'array sortato e filtrato. Mi serve per saltare a una riga	
const reducer = (acc, curr, idx) => {
	acc[curr.key] = idx;
	return(acc);
};
if (sortedData.length > 0) this.dataIndex = sortedData.reduce(reducer, this.dataIndex);

	
this.header2 = [...this.props.header];
	(this.props.actionFirst) ? this.header2.unshift({label: 'Sel', width: this.props.actionWidth || 60}) : this.header2.push({label: 'Sel', width: this.props.actionWidth || 60})
	  
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
  {
  (itemData && itemData.length > 0) ?
  <Grid 
    columnCount={this.columnCount}
    columnWidth={index => columnWidths[index]}
    height={this.props.height - 30 -10} //La testata e un minimo di spazio per gli oggetti sotto...
    rowCount={itemData.length}
    rowHeight={index => 30}
    width={this.props.width+20}
    itemData={sortedData}
    itemKey={itemKey}
    ref={this.gridRef}
          
  >
    {this.Cell}
  </Grid>	
  :
    <Empty width={this.props.width+20} height={this.props.height -30 -10}/>

  }
  </div> 
)
     	
     };

}

export default WrappedVirtualizedTable









