import React from 'react'


const TotaliResaLibera = (props) => 
    {
    	const totali = props.testataResa ? props.testataResa.totali : props.totaliResa;
    	 return(
		
			<div>
			<div> Copie: {totali.pezzi} </div>
			<div> Gratis:  {totali.gratis} </div>
			<div> Totale: {totali.prezzoTotale} </div>
		</div>
			
			)
    	 		
    }		
	
export default TotaliResaLibera;

