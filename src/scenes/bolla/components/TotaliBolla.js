import React, {Component} from 'react'
import { Grid } from 'semantic-ui-react'

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
			<Grid.Row> Copie: {props.totali.pezzi} </Grid.Row>
			<Grid.Row> Gratis:  {props.totali.gratis} </Grid.Row>
			<Grid.Row> Totale: {props.totali.prezzoTotale} </Grid.Row>
			</div>
			)}
    }		
	
export default TotaliBolla;

