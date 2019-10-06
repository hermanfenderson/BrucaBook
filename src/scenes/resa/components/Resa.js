import TableResa from '../containers/TableResa';
import TableOpenResa from '../containers/TableOpenResa';

import TotaliResa from '../components/TotaliResa';
import MessageQueue from '../../../components/MessageQueue'

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/it';
import {Redirect} from 'react-router-dom';

import { Spin} from 'antd'

import FixBlock from '../../../components/FixBlock'


class Resa extends Component {


 
 componentDidMount() {
 	if(ReactDOM.findDOMNode(this.refs.formRigaResa)) 
   		{var node = ReactDOM.findDOMNode(this.refs.formRigaResa);
   		this.props.storeMeasure('formRigaResaHeight', node.clientHeight);
   		}
   	this.props.listenTestataResa([this.props.match.params.anno, this.props.match.params.mese], this.props.match.params.id); //In modo da acoltare il valore giusto...
	let params = [this.props.match.params.anno, this.props.match.params.mese];
    params.push(this.props.match.params.id);
    this.props.listenRigaResa(params);	
 }
 	   	
 componentWillUnmount() {
 	let currentIdResa = this.props.match.params.id;
 	this.props.resetResa(currentIdResa);
			 this.props.unlistenTestataResa([this.props.match.params.anno, this.props.match.params.mese], currentIdResa);
			 let params = [this.props.match.params.anno, this.props.match.params.mese];
    	   			params.push(currentIdResa);
    	   			this.props.offListenRigaResa(params); 
    	   			this.props.resetResa([this.props.match.params.anno, this.props.match.params.mese],currentIdResa);
    	   	if (this.props.testataResa && this.props.testataResa.fornitore) this.props.unlistenBollePerFornitore(this.props.testataResa.fornitore);		
 }
 
componentDidUpdate(oldProps) {
	if (this.props.testataResa && (this.props.testataResa !== oldProps.testataResa))
		{
		if (this.props.testataResa && (!oldProps.testataResa || (this.props.testataResa.fornitore!==oldProps.testataResa.fornitore))) this.props.listenBollePerFornitore(this.props.testataResa.fornitore, this.props.testataResa.dataScarico);

		let riga = this.props.testataResa;
		this.props.setHeaderInfo("Rese - Doc. " + riga.riferimento + ' ' 
					          						+ riga.nomeFornitore + ' del ' + moment(riga.dataDocumento).format("L"));
				 
		}	 
		let dataInventarioNew = this.props.testataResa ? this.props.testataResa.dataScarico : null;
	let dataInventarioOld = oldProps.testataResa ? oldProps.testataResa.dataScarico : null;
	//Ho ricevuto una data resa nuova oppure la ho per la prima volta... mi prendo il valore dello storico magazzino
	if (dataInventarioNew !== dataInventarioOld)
		{
	//	this.props.searchDataMagazzino(dataInventarioNew);	
		this.props.datiStoricoMagazzino(dataInventarioNew);
		}
		 	
}   





render()
{

  	
  const isOpen = (this.props.testataResa && (this.props.testataResa.stato === 'aperta')) ? true : false;   
  const period = [this.props.match.params.anno, this.props.match.params.mese];
  if (this.props.testataResa && this.props.testataResa.stato ==='libera' ) 
{
const url = '/resaLibera/'+this.props.match.params.anno+'/'+this.props.match.params.mese+'/'+this.props.match.params.id;	
 return(<Redirect to={url} />)
}
else return (

 
  <Spin spinning={!this.props.testataResa}>
  <MessageQueue messageBuffer={this.props.messageBuffer} shiftMessage={this.props.shiftMessage} />
  <div>
 <FixBlock coors={this.props.geometry.totaliCoors}>
  
    	 <TotaliResa setFilter={this.props.setFilter}  filters={this.props.filters} staleTotali={this.props.staleTotali} testataResa={this.props.testataResa} listeningTestataResa={this.props.listeningTestataResa} setStato={this.props.setStato}/>
 </FixBlock>
  
 <FixBlock coors={this.props.geometry.tableCoors}>
       
    {isOpen ? <TableOpenResa filters={this.props.filters} getRigaBolla={this.props.getRigaBolla} getMagazzinoItem={this.props.getMagazzinoItem} geometry={this.props.geometry} testataResa={this.props.testataResa} period={period} idResa={this.props.match.params.id}/> :  <TableResa  filters={this.props.filters} getRigaBolla={this.props.getRigaBolla} getMagazzinoItem={this.props.getMagazzinoItem} geometry={this.props.geometry} testataResa={this.props.testataResa} period={period} idResa={this.props.match.params.id}/> }
   
   	 	 </FixBlock>
  
    
     
   
  </div>
  </Spin>
 
 
)
}

}
export default Resa;
