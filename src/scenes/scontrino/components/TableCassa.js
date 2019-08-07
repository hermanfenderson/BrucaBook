import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Icon, Table} from 'antd';
import {period2month} from '../../../helpers/form'
import {withRouter} from 'react-router-dom'
import classNames from 'classnames'


import {Modal} from 'antd';
var lastRowClicked = null; //Non posso aspettare che ritorni la modifica dallo stato...

class WrappedTable extends React.Component {
componentDidMount()
  {  this.node = ReactDOM.findDOMNode(this.refs.antTable).getElementsByClassName('ant-table-body')[0];
    
    }
  
  

  componentDidUpdate = (oldProps) => {
  	this.node = ReactDOM.findDOMNode(this.refs.antTable).getElementsByClassName('ant-table-body')[0];
    
	   if (this.props.tableScroll)
			{
	        this.node.scrollTop = this.node.scrollHeight;
			this.props.toggleTableScroll(false); //Resetto lo scroll...
			}
	  if (this.props.tableScrollByKey)
			{
			this.nodeKey = 	ReactDOM.findDOMNode(this.refs.antTable).getElementsByClassName('tabella-cassa-record-'+this.props.tableScrollByKey)[0];
		    if (this.nodeKey) 
		    	{this.node.scrollTop = this.nodeKey.offsetTop; 
		    	}//Mi sposto nel padre della distanza tra la riga figlio e il padre!
			this.props.setTableScrollByKey(null); //Resetto lo scroll...
			
			}
	 //Se entro qui... è perchè ho fatto refresh in mezzo....	
	 if (this.props.index.chiavi && (this.props.match.params.scontrino !== null) && (this.props.selectedItem === null) && (this.props.index.chiavi[this.props.match.params.scontrino] >=0) )
		{
			let row = this.props.data[this.props.index.chiavi[this.props.match.params.scontrino]];
			this.props.setSelectedRigaCassa(row);
		}	
 }
	
selectRow = (row) => {
 	if(this.props.selectRow  && (row.tipo === 'scontrino')) {this.props.selectRow(row)};
 }
 
 
actionRowRender = (cell, row) => {
   return (
        <div>
        {(this.props.deleteRow) && <Icon type="delete" onClick={() => { lastRowClicked = row.key; this.props.deleteRow(row)}}/>} 
		{(this.props.editRow) && (row.tipo === 'scontrino') && <Icon type="edit" onClick={() => { lastRowClicked = row.key; this.props.editRow(row)}}/>}  
        </div>
        );
 }
 
 rowClassName = (record,index) => {
 	return(classNames('ant-table-row', 
 					  'tabella-cassa-row',
 					  'tabella-cassa-record-'+record.key, 
 					  {'ant-table-row-cassa-highlight': (record.key === this.props.highlightedRowKey)}, 
 					  {'ant-table-row-totale-cassa': (record.tipo === 'scontrino')}
 					  )
	     )

 } 
 
ordinaryRowRender = (cell,row, index) => {
//Il titolo lo tronco... se serve...
 if (row.titolo === cell)
	{
if (row.key === this.props.highlightedRowKey) return(<div style={{'color':'#108ee9','fontWeight':'bold'}} onClick={() => { this.selectRow(row)}}>{cell}</div>);
 else  return(<div style={{width: this.props.titoloWidth+10, whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis'}}  onClick={() => { this.selectRow(row)}}>{cell}</div>);
	}
 else {
 if (row.key === this.props.highlightedRowKey) return(<div style={{'color':'#108ee9','fontWeight':'bold'}} onClick={() => { this.selectRow(row)}}>{cell}</div>);
 else  return(<div onClick={() => { this.selectRow(row)}}>{cell}</div>);
 	
 }	
 
} 

onRow=(record, other) => ({
  onClick: () => {if (lastRowClicked!== record.key) { lastRowClicked = record.key; this.selectRow(record);}}
})

  
render ()
     {
   
    let columns = this.props.header.map((header) => 
  	            	{
  	            	var rigaScontrinoSpan = 0;
  	            	if (header.label === '#') rigaScontrinoSpan = 3;
  	            	if (header.label === 'Qtà') rigaScontrinoSpan = 1;
  	            	if (header.label === 'Tot.') rigaScontrinoSpan = 1;
  	            	
  	            		return({
  	            	'key': header.dataField,		
  	             	'title':  header.label,
  	             	'dataIndex': header.dataField,
  	             	 'width': header.width,
  	             	'render': (text, record, index) => {return {children: this.ordinaryRowRender(text,record, index),
  	             					                     props: {colSpan: (record.tipo === 'scontrino' ? 1 : rigaScontrinoSpan)}}}
  	            		})
  	            	}
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
  			
  	let actionColumn = {
  		            'key': 'Selezione',
  					'render': (text, record) => {return {children: this.actionRowRender(text,record), 
  												         props: {colSpan: (record.tipo === 'scontrino' ? 1 : 0)}}},
  					'width': this.props.actionWidth || '60px',
  					'title': 'Sel.'
  	            	};
  	if (this.props.deleteRow || this.props.editRow) 
  		{if (this.props.actionFirst)
  		    columns.unshift(actionColumn);
			else columns.push(actionColumn);
  		}
    return(//Ho inserito Menu per poterlo infilare in un dropdown...
    		 <Table size='small' onRow={this.onRow} rowClassName={this.rowClassName} ref='antTable' scroll={{ y: this.props.height}}  loading={this.props.loading} pagination={false} columns={columns} dataSource={data}/>
       		);	
     }	
} 


//E' un dato.... che passo come costante...


//Per gestire in modo smmooth il ricaricamento!

class TableCassa extends Component 
    {
    componentDidMount() {
     
    let params = [...this.props.period];
   	params.push(this.props.cassa);
   	this.props.listenRigaCassa(params); 
   	
     //Non ho la minima idea di cosa faccia questa if!!!
       if ((this.props.scontrino && !this.props.selectedItem) || (this.props.scontrino && this.props.selectedItem && (this.props.scontrino !== this.props.selectedItem.key))) {
     	 	if (this.props.index.chiavi && (this.props.index.chiavi[this.props.scontrino]>=0) && this.props.data[this.props.index.chiavi[this.props.scontrino]]) 
    			{this.editRow(this.props.data[this.props.index.chiavi[this.props.scontrino]]);
    			}
       }	
     	
     		   	
	}
	
  componentWillUnmount() {
  if (this.props.listeningItemCassa[2]) 
    	   		{
    	   		let params = [...this.props.period];
    	   		params.push(this.props.listeningItemCassa[2]);
    
    	   		this.props.offListenRigaCassa(params, this.props.listenersItemCassa ); 
    	   		}
  }	
  
	deleteRow = (row) => {
	   const deleteRigaCassa = () => {
	   	    let params = [...this.props.period];
    		params.push(this.props.cassa);
	   		this.props.deleteRigaCassa(params, row.key);
	   		this.props.history.push('/scontrino/'+ period2month(this.props.period) + '/' +this.props.cassa);
	   };
	   
	   if(row.totali && row.totali.pezzi > 0)	Modal.confirm({
    		title: 'Lo scontrino non è vuoto. Vuoi elminarlo?',
    		content: 'Lo scontrino non è vuota: se premi OK cancelli anche tutti i libri che contiene.',
    		okText: 'Si',
    		okType: 'danger',
    		cancelText: 'No',
    		onOk() {deleteRigaCassa()
    			
    		},
    		onCancel() {
    		},});
    		
		//Gestisco la situazione che non sia vuota la bolla...
		else deleteRigaCassa();
	}
	
	

	
	editRow = (row) => {
		let params = [...this.props.period];
    	params.push(this.props.cassa);
    	this.props.setSelectedRigaCassa(row);
    	this.props.history.push('/scontrino/'+ period2month(this.props.period) + '/' +this.props.cassa + '/'+row.key  );
	}

   
    	render() { 
        let props = {...this.props};
    	let selectedItemKey = null;
    //	let colsW = this.props.geometry.tableCassaCols;
    	let header=this.props.geometry.header;
    	/*
    	let header = [{dataField: 'numero', label: '#', width: colsW.numero},
				{dataField: 'oraScontrino', label: 'Ora', width: colsW.oraScontrino},		
                {dataField: 'totali.pezzi', label: 'Qtà', width: colsW.pezzi},
			     {dataField: 'totali.prezzoTotale', label: 'Tot.', width: colsW.prezzoTotale}
			   ];
)   */
       	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaScontrino']; //Non la passo liscia...
    	delete props['setSelectedRigaScontrino']; //Idem
    	  return(
    	  
    	  
			<WrappedTable {...props} titoloWidth={this.props.geometry.tableCassaTitoloWidth} actionWidth={'30px'} actionFirst={true} size={'small'} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			
			)}
    }		
	
export default withRouter(TableCassa);

