import React, {Component} from 'react'
import {period2month} from '../../../helpers/form'
import {withRouter} from 'react-router-dom'
import classNames from 'classnames'
import WrappedTable2 from '../../../components/WrappedVirtualizedTable'
import moment from 'moment'

import {Modal} from 'antd';

class TableCassa extends Component 
    {
    componentDidMount() {
     
     	
     		   	
	}
	
  componentWillUnmount() {
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
		if (row.tipo==='scontrino')
			{
			let params = [...this.props.period];
    		params.push(this.props.cassa);
    		this.props.setSelectedRigaCassa(row);
    		this.props.history.push('/scontrino/'+ period2month(this.props.period) + '/' +this.props.cassa + '/'+row.scontrinoKey  );
    		this.props.setScontrinoId(row.scontrinoKey); 
			}
	}
    
    customRenderFunc = (text, record, pos) => {
    	let isScontrino=(record.tipo==='scontrino');
    	let width=this.props.geometry.header[pos].width;
    	if (pos===0 && !isScontrino) width=width+30+this.props.geometry.header[1]; //Tre colonne per il titolo
    	let value=text;
    	if (isScontrino && pos===1) value=moment(text).format("HH:mm");
    	if (!isScontrino && pos===1) value='';
    	let isTitolo = (!isScontrino && pos===0);
    	if (isTitolo) value=record.titolo;
    	if (isScontrino && pos===2) value=record.totali.pezzi;
    	if (isScontrino && pos===3) value=record.totali.prezzoTotale;
    	
    	let style={width: width};
    	if (isTitolo) style.marginLeft=-30;
    	return(<div style={style} className={classNames({'vtCellCassaScontrino': isScontrino, 'vtCellCassaRiga': !isScontrino, 'vtCellValue': true, 'vtCellSmall': true,'vtCellEllipsis': isTitolo })} >{value}</div>)
       
    	
    }
   customRowRender=
				{
				'numero': (text, record, index) => {return(this.customRenderFunc(text,record,0))},
				'oraScontrino': (text, record, index) => {return(this.customRenderFunc(text,record,1))},
				'pezzi': (text, record, index) => {return(this.customRenderFunc(text,record,2))},
				'prezzoTotale': (text, record, index) => {return(this.customRenderFunc(text,record,3))},
					
				}
   noAction = (rowData, rowIndex) => {if (rowData.tipo ==='rigaScontrino') return true; else return false;};  			
	
    	render() { 
        let props = {...this.props};
    	let selectedItemKey = null;
    //	let colsW = this.props.geometry.tableCassaCols;
    	let header=props.geometry.header;
    		let height = props.geometry.tableCoors.height;
    	let width = props.geometry.tableCoors.width;
       	if (props.selectedItem) selectedItemKey = props.selectedItem.key;
    	
    	delete props['deleteRigaScontrino']; //Non la passo liscia...
    	delete props['setSelectedRigaScontrino']; //Idem
    	  return(
    	  
    	  
			<WrappedTable2 {...props} 	
			height={height} 
			width={width} 
			noAction={this.noAction}
		
		 titoloWidth={this.props.geometry.tableCassaTitoloWidth} 
		 actionWidth={30} 
		 actionFirst={true} 
		 selClass={'vtCellCassaScontrino'}
		 size={'small'} 
		 highlightedRowKey={selectedItemKey} 
		 	customRowRender={this.customRowRender}
		
		 editRow={this.editRow} deleteRow={this.deleteRow} selectRow={this.editRow} header={header}/>
			
			)}
    }		
	
export default withRouter(TableCassa);

