import React, {Component} from 'react'
import {Row} from 'antd'

var currentListenedIdBolla = null;

class TotaliBolla extends Component 
    {
    componentDidMount() {
    	//Ascolto modifiche sui totali della bolla
    	
    	if (currentListenedIdBolla !== this.props.idBolla)
    	   {
    	   	if (currentListenedIdBolla) 
    	   		{this.props.offListenTotaliChanged({'bollaId':this.props.idBolla}); 
    	   		}
    	   	//Prendo qui il mio oggetto... mi ritorna null se non ha trovato il prefissoNegozio	
    	   	let objectUrl = this.props.listenTotaliChanged({'bollaId':this.props.idBolla}); 
    	   	if (objectUrl) currentListenedIdBolla = objectUrl['bollaId']; 
    	   	}
	}
	

    
    	render() { 
    	const props = this.props;	
    	  return(
			<div>
			<Row> Copie: {props.totali.pezzi} </Row>
			<Row> Gratis:  {props.totali.gratis} </Row>
			<Row> Totale: {props.totali.prezzoTotale} </Row>
			</div>
			)}
    }		
	
export default TotaliBolla;

