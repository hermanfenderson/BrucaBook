import React, {Component} from 'react'
import {Row} from 'antd'

class TotaliBolla extends Component 
    {
    componentDidMount() {
    	//Ascolto modifiche sui totali della bolla
    	this.props.listenTotaliChanged({'bollaId':this.props.idBolla}); 
	}
	
	componentWillUnmount() {
		//Smetto di ascoltare...
		this.props.offListenTotaliChanged({'bollaId':this.props.idBolla}); 
		
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

