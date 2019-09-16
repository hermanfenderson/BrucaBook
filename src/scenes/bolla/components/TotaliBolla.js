import React from 'react'

const TotaliBolla = (props) => 
    {
    	const totali = (props.testataBolla) ? props.testataBolla.totali : props.totaliBolla; //Uso la copia calcolata in locale finchè non arriva quella calcolata al centro...
    	return(
    	<div>
		<div> Copie: {totali.pezzi} </div>
			<div> Gratis:  {totali.gratis} </div>
			<div> Totale: {totali.prezzoTotale} </div>
			</div>
		)	
				
    }		
	
export default TotaliBolla;

