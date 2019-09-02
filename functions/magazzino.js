

//dato un pezzo di registroEAN e la sequenza di tutte le date... rende un elenco di date coi totali e le info...
const calcolaMagazzino = (registro) =>
{
	 let righePerData = Object.entries(registro); //In posizione 0 la data, in posizione 1 le righe...
	 let numDate = righePerData.length; 
	 for (let i=0; i<numDate;i++) righePerData[i][1] = Object.values(righePerData[i][1]); //Trasformo oggetto righe in data in array...
	 let lastRowPos = righePerData[numDate-1][1].length - 1;
	 let values = {...righePerData[numDate-1][1][lastRowPos]} //Ultima riga utile... con info sicuramente aggiornate
     let isNew = true;
     if (numDate > 1) isNew = false;
     let totalePezzi =0;
     for (let i=0; i<numDate; i++)
    	{
    	let numRows = righePerData[i][1].length;
    	if (i===0 && numRows > 1) isNew = false;
	       	for (let j=0; j<numRows;j++)
	    	   {let riga = righePerData[i][1][j];
	            			if (riga.tipo == "bolle")
			  					{
				    			totalePezzi = parseInt(riga.pezzi) + parseInt(riga.gratis)+ totalePezzi;
				    			}
						    if (riga.tipo == "rese")
			  					{
				    			totalePezzi = totalePezzi - (parseInt(riga.pezzi) + parseInt(riga.gratis));
				    			}	
							if (riga.tipo == "scontrini")
			  					{
			  					totalePezzi = totalePezzi - parseInt(riga.pezzi);
				    			}
								
							if (riga.tipo == "inventari")
			  					{
			  					totalePezzi = totalePezzi + parseInt(riga.pezzi);
				    			}
	    	   }
         }
         
	    	
     
     let newValues = {ean: (values.ean) ? values.ean : '', 
        													 titolo: (values.titolo) ? values.titolo : '',
        													 autore: (values.autore) ? values.autore : '',
        													 editore: (values.editore) ? values.editore : '',
        													 prezzoListino: (values.prezzoListino) ? values.prezzoListino : 0.00,
        													 categoria: (values.categoria) ? values.categoria : '',
        													 iva: (values.iva) ? values.iva : 'a0',
        													 pezzi: totalePezzi
        	                                				}
        								   
       
	return({totaleEAN: newValues, isNew: isNew});
}

const aggiornaMagazzinoEANFull = (admin, ean, refRadix, registro) => 
{
	
	//dato EAN leggo tutta la parte di registro che lo riguarda...
	return(refRadix.child('dateStoricoMagazzino').once("value").then(
		function(snapshot) 
			    	{
			    	if (ean)
			    	{
			    	console.log("aggiorno magazzino per ean: "+ean);
				    let updates={};
				    //let allDates = Object.keys(snapshot.val());
				    let result = calcolaMagazzino(registro);
				    let totaleEAN = result.totaleEAN;
				    let isNew = result.isNew;
				    if (isNew) totaleEAN.createdAt = admin.database.ServerValue.TIMESTAMP;
				    else totaleEAN.changedAt = admin.database.ServerValue.TIMESTAMP;
				    
				    	
				    refRadix.child('magazzino').child(ean).update(totaleEAN).then(console.log("Aggiornato magazzino: "+ean));
				        
			    	}
			    	else (console.log("ean non definito"));
			    	}    
			)												)
	
}

module.exports = {
aggiornaMagazzinoEANFull : aggiornaMagazzinoEANFull,
}