import React from 'react'


const TotaliScontrino = (props) => 
    { 
    	const totali = (props.testataScontrino && !props.staleTotali) ? props.testataScontrino.totali : props.totaliScontrino; //Uso la copia calcolata in locale finchè non arriva quella calcolata al centro...
    	 if (totali) return(
	
			<div>
			<div> Copie: {totali.pezzi} </div>
				<div> Totale: {totali.prezzoTotale} </div>
			</div>
			
			)
    }		
	
export default TotaliScontrino;

