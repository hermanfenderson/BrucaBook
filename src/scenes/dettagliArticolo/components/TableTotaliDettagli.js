import React, {Component} from 'react'
import WrappedTable from '../../../components/WrappedTable'
import TableDettagliArticolo from '../components/TableDettagliArticolo';


//E' un dato.... che passo come costante...
const headerFunc = (anno, mese) => {
	           let labelPeriodo = 'Anno';
	           if (anno && mese) labelPeriodo = mese+'/'+anno;
	           if (anno && !mese) labelPeriodo = anno;
	           
	           let header = [{dataField: 'key', label: labelPeriodo, width: '200px'},
			    {dataField: 'bolla', label: 'Acquisti', width: '200px'},
			    {dataField: 'scontrino', label: 'Vendite', width: '200px'},
			    
			    {dataField: 'resa', label: 'Rese', width: '200px'},
			    {dataField: 'inventario', label: 'Rettifiche', width: '200px'},
			    {dataField: 'delta', label: 'Variazione', width: '200px'},
			    {dataField: 'stock', label: 'Stock', width: '200px'},
			    ];
	           
	           return header;
}

const extractTotals = (matrix, anno, mese) =>
{
	let data = [];
	//Tutti gli anni
	if ((!anno) && (!mese))
		{
			Object.keys(matrix.anno).sort().forEach(
			  function(propt) 
				{
				let obj = {key: propt, nextPeriod: {anno: propt, mese: null}, ...matrix.anno[propt].totali};
				data.push(obj);	
				}
				);
			data.push({key: 'Totale', ...matrix.totale.totali});	
		}
    if ((anno) && (!mese))
		{if (matrix.anno[anno])
			{
			Object.keys(matrix.anno[anno].mese).sort().forEach(
			  function(propt) 
				{
				let obj = {key: propt, nextPeriod: {anno: anno, mese: propt}, ...matrix.anno[anno].mese[propt].totali};
				data.push(obj);	
				}
				);
			data.push({key: 'Totale', nextPeriod: {anno: null, mese: null}, ...matrix.anno[anno].totali});
			}
		}
	if ((anno) && (mese))
		{if (matrix.anno[anno] && matrix.anno[anno].mese[mese])
			{
			Object.keys(matrix.anno[anno].mese[mese].giorno).sort().forEach(
					function(propt) 
						{
							let obj = {key: propt,  ...matrix.anno[anno].mese[mese].giorno[propt].totali};
							data.push(obj);	
							
						}
						);
							
			data.push({key: 'Totale', nextPeriod: {anno: anno, mese: null}, ...matrix.anno[anno].mese[mese].totali});
			}
		}		
	return data;	
}


class TableTotaleDettagli extends Component 
    {

	expandedRowRender = (record) => {let dettagli = {}
									if (record.key === 'Totale')
										{
										if (!this.props.anno && !this.props.mese) dettagli = this.props.matrix.totale.righe;
										if (this.props.anno && !this.props.mese) dettagli = this.props.matrix.anno[this.props.anno].righe;
										if (this.props.anno && this.props.mese) dettagli = this.props.matrix.anno[this.props.anno].mese[this.props.mese].righe;
										}
									else 
										{
										if (!this.props.anno && !this.props.mese) dettagli = this.props.matrix.anno[record.key].righe;
										if (this.props.anno && !this.props.mese) dettagli = this.props.matrix.anno[this.props.anno].mese[record.key].righe;
										if (this.props.anno && this.props.mese) dettagli = this.props.matrix.anno[this.props.anno].mese[this.props.mese].giorno[record.key].righe;
										}
									return(<TableDettagliArticolo dettagli={dettagli} />)
		
									}
    detailRow = (row) => {
    	if (row.nextPeriod) this.props.setPeriod(row.nextPeriod);
    }
    
    	render() { 
    	let props = {...this.props};
    	let header = headerFunc(this.props.anno, this.props.mese);
    	  return(
			<WrappedTable {...props} header={header} data={extractTotals(this.props.matrix, this.props.anno, this.props.mese)} expandedRowRender={this.expandedRowRender}  detailRow={this.detailRow} selectRow={this.detailRow}/>
			)}
    }		
	
export default TableTotaleDettagli;

