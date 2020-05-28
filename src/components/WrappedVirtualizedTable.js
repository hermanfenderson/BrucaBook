import React from 'react';

import { VariableSizeGrid as Grid } from 'react-window';
import {SEL_W, COL_H, COL_H_S, ICO, ICO_S} from '../helpers/geometry';
import {Icon} from 'antd'; 
import Empty from './Empty';
import classNames from 'classnames';
import memoizeOne from 'memoize-one';

// These item sizes are arbitrary.
// Yours should be based on the content of the item.
//Aggiunt funzione per visualizzare su base condizione la sel

//Aggiunto il concetto di subtable tutto legato alle chiavi della tabellea principale

const SUB_W = 30;

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
				{if (this.gridRef.current) this.gridRef.current.scrollToItem({rowIndex:last}); //Vado alla fine...
				this.props.toggleTableScroll(false); //Resetto lo scroll...
				}
			}

  if (this.props.tableScrollByKey)
			{
			let rowToGo = -1;
			if (rowToGo !== this.dataIndex[this.props.tableScrollByKey]) rowToGo = this.dataIndex[this.props.tableScrollByKey];
		    else rowToGo = -1;
					
					
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
    subTableOpen: {},  //Una lista delle righe aperte...
  }
	
    this.gridRef = React.createRef();
    this.dataIndex = {};
    this.header2 = [];
	//Indice della action
	this.actIdx = this.props.actionFirst ? 0 : this.props.header.length;
	if (this.props.subTables) this.actIdx++; //Tutspostato di 1...
	this.columnCount = this.props.header.length+1;
    if (this.props.subTables) this.columnCount++;
    this.col_h =(this.props.size==='small'? COL_H_S : COL_H);

	
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

i_size  = (this.props.size==='small') ? ICO_S : ICO;

SortSvg = () => (
  <svg width={this.i_size} height={this.i_size} >       
     <image href="/sort.svg"   width={this.i_size} height={this.i_size}/>    
</svg>
);
SortAlphaAscSvg = () => (
  <svg width={this.i_size} height={this.i_size}>       
     <image href="/sort-alpha-asc.svg"  width={this.i_size} height={this.i_size}/>    
</svg>
);
SortAlphaDescSvg = () => (
  <svg width={this.i_size} height={this.i_size}>       
     <image href="/sort-alpha-desc.svg"  width={this.i_size} height={this.i_size}/>    
</svg>
);
SortNumericAscSvg = () => (
  <svg width={this.i_size} height={this.i_size}>       
     <image href="/sort-numeric-asc.svg"  width={this.i_size} height={this.i_size}/>    
</svg>
);

SortNumericDescSvg = () => (
  <svg width={this.i_size} height={this.i_size}>       
     <image href="/sort-numeric-desc.svg"  width={this.i_size} height={this.i_size}/>    
</svg>
);


calcHeader2 = (header) =>
	{
	let header2= [...header];
	if (!this.props.noSel) (this.props.actionFirst) ? header2.unshift({label: 'Sel', width: this.props.actionWidth || SEL_W}) : header2.push({label: 'Sel', width: this.props.actionWidth || SEL_W})
	if (this.props.subTables) header2.unshift({label: '', width:  SUB_W})
	
	return(header2);	
	};
	
memoizedCalcHeader2 = memoizeOne(this.calcHeader2);	

calcColumnWidth = (header) => 
		{
		let cW = header.map(h => h.width);
		return cW;
		};
		
memoizedCalcColumnWidth = memoizeOne(this.calcColumnWidth);	

filterData = (data, filters) =>
{
   let dataCpy = [...data]; //Shallow copy utile per il sort...
   let itemData = (filters) ? 
  		dataCpy.map((record) => 
  			{
  			//Il record è buono... se non esiste quel campo nel record oppure esiste e la regex è rispettata	
  			//Ma posso passare una funzione filtro alternativa...
  			
  			if (this.props.customFilterFunc) return (this.props.customFilterFunc(record, filters))
  			else
  				{
  				let good = true;	
	  			for (var prop in filters)
	  					
	  				{  let regex = new RegExp(filters[prop],'i');
	  				
	  					if (filters[prop] && (record[prop]!==undefined) && (!record[prop].match(regex))) good = false;
	  					if (filters[prop] && ((record[prop]===undefined) || record[prop].length===0)) good = false;
	  				}
	  			return (good ? {...record} : null) 
	  			}
  			}).filter((record => !!record)) :
  			dataCpy;
   return(itemData);
}

memoizedFilterData = memoizeOne(this.filterData);

sortData = (data, sortBy, sortDirection) =>
{
	let sortedData = (sortBy) ? 
  					  data.sort((a, b) => 
  							{
  							let sortBool = false;	
  							if (this.state.sortType === 'string') 
  								{
  									if ((a[sortBy] !== undefined) && (b[sortBy] !== undefined)) sortBool = a[sortBy].localeCompare(b[sortBy]);
  									
  								}
  							else if ((a[sortBy] !== undefined) && (b[sortBy] !== undefined))  sortBool = a[sortBy] - b[sortBy];
  							if (sortDirection==='DESC') sortBool = -sortBool;
  							return sortBool;
  							}) 
  					  : data;
  	return(sortedData);
}

memoizedSortData = memoizeOne(this.sortData);
	
Header = (header) => 
{
let leftPos = [];
leftPos.push(0);
for (let i=0; i<header.length; i++) leftPos.push(header[i].width+leftPos[i]); //Posizioni degli header...
let headCols = header.map((col, idx) => 
				  {
				  return(<div className={classNames({ 'vtHeadCell': true, 'vtHeadCellSmall': (this.props.size==='small')})} 
				  key={idx} 
				  onClick={(e) => {this.onHeaderClick({event: e, col:col })} }
                             
				  style={{ height: this.col_h, position: 'absolute', left: leftPos[idx], width: col.width}}>
                       {col.label} 
                    {((col.dataField === this.state.sortBy) && (this.state.sortDirection === 'ASC') && (col.sort === 'string')) ? <Icon component={this.SortAlphaAscSvg} /> : null}     
                
                  {((col.dataField === this.state.sortBy) && (this.state.sortDirection === 'DESC') && (col.sort === 'string')) ? <Icon component={this.SortAlphaDescSvg} /> : null}     
                   {((col.dataField === this.state.sortBy) && (this.state.sortDirection === 'ASC') && (col.sort === 'number')) ? <Icon component={this.SortNumericAscSvg} /> : null}     
                
                  {((col.dataField === this.state.sortBy) && (this.state.sortDirection === 'DESC') && (col.sort === 'number')) ? <Icon component={this.SortNumericDescSvg} /> : null}     
                 {((col.sort) && (col.dataField  !== this.state.sortBy)) ? <Icon component={this.SortSvg} /> : null}     
               
                 </div>
                 )
				  }
                 
			)	
return (
    <div style={{ width: this.props.width, height: (this.props.size==='small'? COL_H_S : COL_H)}}>
    {headCols}
    </div>
)
};


actionCellRenderer = ({rowData, rowIndex}) => {
 if (this.props.noAction && this.props.noAction(rowData, rowIndex)) 
 return (<div></div>)
 else
   {
   let classes = {'vtCellValue': true,'vtCellSmall': (this.props.size==='small')};
   if (this.props.selClass) classes[this.props.selClass] = true;
   return (
 	    <div className={classNames(classes)}>
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
 }

//In questa cella avviene la magia che porta alle sottotabelle...
expandCellRenderer = ({rowKey, rowIndex}) => {
const onClick=() => {
	let newState = {...this.state};
	newState.subTableOpen = {...this.state.subTableOpen};
	if (newState.subTableOpen[rowKey]) delete newState.subTableOpen[rowKey];
	else newState.subTableOpen[rowKey] = true;
	this.setState(newState);
	this.gridRef.current.resetAfterRowIndex(rowIndex,true);

    	
};
let subTableRender = (this.props.subTables && this.props.subTables[rowKey] && this.state.subTableOpen[rowKey]) 
? 
<div style={{position: 'absolute', top: this.col_h, left: SUB_W, height: this.props.subTablesHeight(rowKey)-this.col_h, width: this.props.width - SUB_W }}>
	{this.props.subTablesRender(rowKey)}
</div>
: null;
return(
	<div>
	<Icon style={{marginLeft: 5}} type={(this.state.subTableOpen[rowKey])? "minus-square" : "plus-square"} onClick={onClick}/>
       
      {subTableRender}
      </div>
      )	
};


onRowClick = ({event, index, rowData, column}) => {
	//Eseguo se l'utente non ha fatto click su una icona
	if ((column !== this.actIdx) && !(this.props.subTables && (column ===0)) && this.props.selectRow) this.props.selectRow(rowData);	
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


cellRenderer = (rowIndex, columnIndex, data) => {
	let cIdx = this.props.actionFirst ? columnIndex - 1 : columnIndex;
	if (this.props.subTables) cIdx = cIdx - 1;
	if (columnIndex === this.actIdx) return data[rowIndex] ? this.actionCellRenderer({rowData: data[rowIndex], rowIndex: rowIndex}) : '';
	//Se ho una subtable definita all'indirizzo dell'indice...
	//if (this.props.subTables && columnIndex===0) return((data[rowIndex] && this.props.subTables[data[rowIndex].key]) ? this.expandCellRenderer({rowKey: data[rowIndex].key}) : ''); //Qui metto il testo per  espandere...
	else 
		{
		if (this.props.subTables && columnIndex===0) return((data[rowIndex] && this.props.subTables[data[rowIndex].key]) ? this.expandCellRenderer({rowKey: data[rowIndex].key, rowIndex: rowIndex}) : ''); //Qui metto il testo per  espandere...
			
			let cellName = this.props.header[cIdx].dataField;
		
			//let cellValue = data[rowIndex] ? data[rowIndex][cellName] : '';
            let cellValue = data[rowIndex] ? cellName.split('.').reduce((o,i)=>(o[i]!==undefined) ? o[i] : '', data[rowIndex]) : '';
            
             
		    let customRender = (this.props.customRowRender) ? this.props.customRowRender[cellName] : null;
		    //Se ho un render specifico per questa colonna....
		    let stdRender = <div className={classNames({'vtCellValue': true, 'vtCellSmall': (this.props.size==='small'),'vtCellEllipsis': this.props.header[cIdx].ellipsis, })} style={{width: this.props.header[cIdx].width}}>{cellValue}</div>;
		
		    if (customRender) {
		    		        return customRender(cellValue, data[rowIndex], rowIndex, stdRender);
		    				}
			//else return(<div className={classNames({'vtCellValue': true, 'vtCellSmall': (this.props.size==='small'),'vtCellEllipsis': this.props.header[cIdx].ellipsis, })} style={{width: this.props.header[cIdx].width}}>{cellValue}</div>);
		
			else return(stdRender);
		}	
}


Cell = ({ columnIndex, data, rowIndex, style }) => (
  <div className={classNames({'vtCell': true, 
							  'vtCellHover': (this.state.hoverKey===data[rowIndex].key),
                             
                              'vtCellSelected': (this.props.highlightedRowKey===data[rowIndex].key),
                              
                              'vtCellPinned': (this.props.pinField && data[rowIndex][this.props.pinField])})} 
                              style={{...style, height: (this.props.size==='small'? COL_H_S : COL_H)}} 
                              onClick={(e) => {this.onRowClick({event: e, index: rowIndex, rowData: data[rowIndex], column: columnIndex})} }
                              onMouseOver={(e) => {this.onMouseOver({event: e, index: rowIndex, rowData: data[rowIndex]})} }
                              onMouseOut={this.onMouseOut} >
    {this.cellRenderer(rowIndex, columnIndex, data)}
  </div>
);

 
	

render ()
     {
   //let itemData = this.memoizedFilterData(this.props.data, this.props.filters);
   let itemData = this.filterData(this.props.data, this.props.filters);
   /*
   
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
  	*/		
  	//Se devo sortare... applico una funzione di sort... altrimenti ritornoa sortedData... data...
    let sortedData = this.sortData(itemData, this.state.sortBy, this.state.sortDirection)
 /*
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
  			*/
  	 
//Genero un indice che associa aalla chiave la sua posizione nell'array sortato e filtrato. Mi serve per saltare a una riga	
const reducer = (acc, curr, idx) => {
	acc[curr.key] = idx;
	return(acc);
};
if (sortedData.length > 0) this.dataIndex = sortedData.reduce(reducer, this.dataIndex);


this.header2 = this.memoizedCalcHeader2(this.props.header);
/*
[...this.props.header];
	(this.props.actionFirst) ? this.header2.unshift({label: 'Sel', width: this.props.actionWidth || SEL_W}) : this.header2.push({label: 'Sel', width: this.props.actionWidth || SEL_W})
	if (this.props.subTables) this.header2.unshift({label: '', width:  SUB_W})
*/

let columnWidths = this.memoizedCalcColumnWidth(this.header2);

/*
((header) => 
		{
		let cW = header.map(h => h.width);
		return cW;
		})(this.header2)
*/
  return(
  <div >
 
      {this.Header(this.header2)}	
  
  {
  (itemData!==null && itemData.length > 0) ?
  <Grid 
    columnCount={this.columnCount}
    columnWidth={index => columnWidths[index]}
    height={this.props.height - this.col_h -10} //La testata e un minimo di spazio per gli oggetti sotto...
    rowCount={itemData.length}
    rowHeight={(index) => {let rowKey = sortedData[index].key; let h= (this.state.subTableOpen[rowKey]) ? this.col_h + this.props.subTablesHeight(rowKey): this.col_h; return(h)}}
    width={this.props.width}
    itemData={sortedData}
    itemKey={itemKey}
    ref={this.gridRef}
  >
    {this.Cell}
  </Grid>	
  :
    <Empty width={this.props.width+20} height={this.props.height -this.col_h -10}/>

  }
  </div> 
)
     	
     };

}

export default WrappedVirtualizedTable









