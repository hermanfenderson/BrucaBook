

//dato un pezzo di registroEAN e la sequenza di tutte le date... rende un elenco di date coi totali e le info...
const calcolaMagazzino = (registro) =>
{
	 if (registro) 
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
		            			if (riga.tipo === "bolle")
				  					{
					    			totalePezzi = parseInt(riga.pezzi,10) + parseInt(riga.gratis,10)+ totalePezzi;
					    			}
							    if (riga.tipo === "rese")
				  					{
					    			totalePezzi = totalePezzi - (parseInt(riga.pezzi,10) + parseInt(riga.gratis,10));
					    			}	
								if (riga.tipo === "scontrini")
				  					{
				  					totalePezzi = totalePezzi - parseInt(riga.pezzi,10);
					    			}
									
								if (riga.tipo === "inventari")
				  					{
				  					totalePezzi = totalePezzi + parseInt(riga.pezzi,10);
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
        													 imgFirebaseUrl: (values.imgFirebaseUrl) ? values.imgFirebaseUrl : null,
        													 pezzi: totalePezzi
        	                                				}
        	return({totaleEAN: newValues, isNew: isNew});
		}	
		else return({totaleEAN: {pezzi: 0}, isNew: false}); //Ripristino a zero se registro era vuoto...
}


const aggiornaMagazzinoEANFull = (admin, ean, refRadix, registro) => 
{
					console.log("aggiorno magazzino per ean: "+ean);
				    //let allDates = Object.keys(snapshot.val());
				    let result = calcolaMagazzino(registro);
				    let totaleEAN = result.totaleEAN;
				    let isNew = result.isNew;
				    if (isNew) totaleEAN.createdAt = admin.database.ServerValue.TIMESTAMP;
				    else totaleEAN.changedAt = admin.database.ServerValue.TIMESTAMP;
				    return(refRadix.child('magazzino').child(ean).update(totaleEAN).then(console.log("Aggiornato magazzino: "+ean)));
	
}

const creaMagazzinoDaCatalogo = (admin, ean, refRadix, totaleEAN) => 
{
	
					console.log("creo magazzino per ean: "+ean);
				    //let allDates = Object.keys(snapshot.val());
				    totaleEAN.pezzi = 0;
				    totaleEAN.createdAt = admin.database.ServerValue.TIMESTAMP;
				    	
				    return(refRadix.child('magazzino').child(ean).update(totaleEAN).then(console.log("Aggiornato magazzino: "+ean)));			
	
}

module.exports = {
aggiornaMagazzinoEANFull : aggiornaMagazzinoEANFull,
creaMagazzinoDaCatalogo: creaMagazzinoDaCatalogo
}