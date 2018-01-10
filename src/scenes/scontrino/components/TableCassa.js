import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Icon, Table} from 'antd';
import {period2month} from '../../../helpers/form'
import {withRouter} from 'react-router-dom'



import {Modal} from 'antd';
var lastRowClicked = null; //Non posso aspettare che ritorni la modifica dallo stato...

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
		if ((this.props.scontrino && !this.props.selectedItem) || (this.props.scontrino && this.props.selectedItem && (this.props.scontrino !== this.props.selectedItem.key))) {
     	 	if (this.props.index.chiavi && (this.props.index.chiavi[this.props.scontrino]>=0) && this.props.data[this.props.index.chiavi[this.props.scontrino]]) 
    			{this.props.selectRow(this.props.data[this.props.index.chiavi[this.props.scontrino]]);
    			}
     	
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
	return((record.key === this.props.highlightedRowKey) ? 'ant-table-row ant-table-row-highlight tabella-cassa-row' : 'ant-table-row tabella-cassa-row');
} 
 
ordinaryRowRender = (cell,row) => {
 if (row.key === this.props.highlightedRowKey) return(<div style={{'color':'#108ee9','fontWeight':'bold'}} onClick={() => { this.selectRow(row)}}>{cell}</div>);
 else  return(<div onClick={() => { this.selectRow(row)}}>{cell}</div>);
 
} 

onRow=(record, other) => ({
  onClick: () => {if (lastRowClicked!== record.key) {console.log("sono qui"); lastRowClicked = record.key; this.selectRow(record);}}
})

  
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
    	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaScontrino']; //Non la passo liscia...
    	delete props['setSelectedRigaScontrino']; //Idem
    	  return(
    	  
    	  
			<WrappedTable {...props} actionWidth={'30px'} actionFirst={true} size={'small'} highlightedRowKey={selectedItemKey} editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			
			)}
    }		
	
export default withRouter(TableCassa);

