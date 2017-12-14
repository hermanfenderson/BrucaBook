import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Icon, Table } from 'antd';

import {Modal} from 'antd';

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
 	if(this.props.selectRow  && (row.tipo === 'scontrino')) {console.log(row); this.props.selectRow(row)};
 }
 
 
actionRowRender = (cell, row) => {
   return (
        <div>
        {(this.props.deleteRow) && <Icon type="delete" onClick={() => { this.props.deleteRow(row)}}/>} 
		{(this.props.editRow) && (row.tipo === 'scontrino') && <Icon type="edit" onClick={() => { this.props.editRow(row)}}/>}  
        </div>
        );
 }
 
 
 
ordinaryRowRender = (cell,row) => {
 if (row.key === this.props.highlightedRowKey) return(<div style={{'color':'#108ee9','fontWeight':'bold'}} onClick={() => { this.selectRow(row)}}>{cell}</div>);
 else  return(<div onClick={() => { this.selectRow(row)}}>{cell}</div>);
 
} 


render ()
     {
   
    let columns = this.props.header.map((header) => 
  	            	{
  	            	var rigaScontrinoSpan = 0;
  	            	if (header.label === '#') rigaScontrinoSpan = 3;
  	            	if (header.label === 'Q.tà') rigaScontrinoSpan = 1;
  	            	if (header.label === 'Tot.') rigaScontrinoSpan = 1;
  	            	
  	            		return({
  	            	'key': header.dataField,		
  	             	'title':  header.label,
  	             	'dataIndex': header.dataField,
  	             	 'width': header.width,
  	             	'render': (text, record) => {return {children: this.ordinaryRowRender(text,record),
  	             					                     props: {colSpan: (record.tipo === 'scontrino' ? 1 : rigaScontrinoSpan)}}}
  	            		})
  	            	}
  				);
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
    return(
        	 <Table ref='antTable' scroll={{ y: this.props.height}} size={'middle'}  loading={this.props.loading} pagination={false} columns={columns} dataSource={this.props.data}/>
       		);	
     }	
} 


//E' un dato.... che passo come costante...
const header = [{dataField: 'numero', label: '#', width: '30px'},
				{dataField: 'oraScontrino', label: 'Ora', width: '45px'},		
                {dataField: 'totali.pezzi', label: 'Q.tà', width: '35px'},
			     {dataField: 'totali.prezzoTotale', label: 'Tot.', width: '55px'}
			   ];

var currentListenedIdCassa = null;
   
//Per gestire in modo smmooth il ricaricamento!

class TableCassa extends Component 
    {
    componentDidMount() {
     	if (this.props.listeningItemCassa) currentListenedIdCassa = this.props.listeningItemCassa[2];   
    		//Ascolto modifiche sulle righe della bolla
    	if (currentListenedIdCassa !== this.props.cassa)
    	   {
    	   	if (currentListenedIdCassa) 
    	   		{
    	   		let params = [...this.props.period];
    	   		params.push(currentListenedIdCassa);
    
    	   			this.props.offListenRigaCassa(params); 
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	let params = [...this.props.period];
    	   	params.push(this.props.cassa);
    	   	this.props.listenRigaCassa(params); 
    	   	}
    	   	
	}
	
	
	deleteRow = (row) => {
	   const deleteRigaCassa = () => {
	   	    let params = [...this.props.period];
    		params.push(this.props.cassa);
	   		this.props.deleteRigaCassa(params, row.key);
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
    	this.props.setRedirect(true);
	}

    
    	render() { 
    
    	let props = {...this.props};
    	let selectedItemKey = null;
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaScontrino']; //Non la passo liscia...
    	delete props['setSelectedRigaScontrino']; //Idem
    	  return(
			<WrappedTable {...props} actionWidth={'30px'} actionFirst={true} size={'small'} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			)}
    }		
	
export default TableCassa;

