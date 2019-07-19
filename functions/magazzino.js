

//dato un pezzo di registroEAN e la sequenza di tutte le date... rende un elenco di date coi totali e le info...
const calcolaStoricoMagazzino = (registro, allDates) =>
{
	 var totalePezzi = 0;
	 var totalePezziDate = []; //Qui metto la data in prima posizione e il valore in seconda...
	 let righePerData = Object.entries(registro); //In posizione 0 la data, in posizione 1 le righe...
	 let numDate = righePerData.length; 
	 for (let i=0; i<numDate;i++) righePerData[i][1] = Object.values(righePerData[i][1]); //Trasformo oggetto righe in data in array...
	 let lastRowPos = righePerData[numDate-1][1].length - 1;
	 let values = {...righePerData[numDate-1][1][lastRowPos]} //Ultima riga utile... con info sicuramente aggiornate
     delete values.pezzi;
     delete values.gratis;
     let numAllDates = allDates.length;
     let posDate=0;
     let pnt=-1;
     for (let posAllDates=0; posAllDates<numAllDates;posAllDates++)
        {
        //tre casi... data del loop minore della data da cui parte la sequenza... non devo fare nulla..
        let eanDate = righePerData[posDate][0];
        if (allDates[posAllDates] >= eanDate) {
        	                                let newValues = {ean: values.ean, 
        														 titolo: values.titolo, 
        														 autore: values.autore, 
        														 editore: values.editore, 
        														 prezzoListino: values.prezzoListino,
        	                                				}
        									if (values.categoria !== undefined) newValues.categoria = values.categoria;				 
        	                                if (values.iva !== undefined) newValues.iva = values.iva;				 
        	                               
        									totalePezziDate.push([allDates[posAllDates],
        														 newValues]);
        									pnt++;
        									}
        if (allDates[posAllDates] === eanDate)
        	{
	        let numRows = righePerData[posDate][1].length;
	       	for (let j=0; j<numRows;j++)
	    	   {let riga = righePerData[posDate][1][j];
	            
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
	    	if (allDates[posAllDates] >= eanDate) totalePezziDate[pnt][1].pezzi = totalePezzi; //Progressivo pezzi alla fine di una data...  
	    	if ((allDates[posAllDates] === eanDate) && (posDate < numDate-1)) posDate++;;
        }
     	
	return(totalePezziDate);
}

const aggiornaMagazzinoEANFull = (admin, ean, refRadix, registro) => 
{
	
	//dato EAN leggo tutta la parte di registro che lo riguarda...
	return(refRadix.child('dateStoricoMagazzino').once("value").then(
		function(snapshot) 
			    	{
				    let updates={};
				    let allDates = Object.keys(snapshot.val());
				    let totalePezziDate = calcolaStoricoMagazzino(registro, allDates);
				    	let last = totalePezziDate.length - 1;
				    updates['magazzino/'+ean] = totalePezziDate[last][1];
				    updates['magazzino/'+ean].createdAt = admin.database.ServerValue.TIMESTAMP;
				    
				    for (let i = 0; i < totalePezziDate.length; i++)
				    	{
				    		updates['storicoMagazzino/'+totalePezziDate[i][0]+'/'+ean] = totalePezziDate[i][1];
				    		updates['storicoMagazzino/'+totalePezziDate[i][0]+'/'+ean].createdAt = admin.database.ServerValue.TIMESTAMP;
				    		//Aggiungo a prescindere la data
				    		updates['dateStoricoMagazzino/'+totalePezziDate[i][0]] = admin.database.ServerValue.TIMESTAMP;
				    	}
				        refRadix.update(updates).then(console.log("Aggiornato magazzino: "+ean));
			    	}    
			)												)
	
}

const aggiornaMagazzinoFull = (admin, refRadix) =>
{
	return(refRadix.child('registroEAN').once("value").then(
			    function(snapshot) 
			    	{
			    	//Solita storia in 0 gli EAN in 1 il pezzo di registro...	
			    	let registroEAN = Object.entries(snapshot.val());
			        let promises = [];
			        for (let i=0; i<registroEAN.length; i++) 
			        	{
			        	promises.push(aggiornaMagazzinoEANFull(admin, registroEAN[i][0], refRadix, registroEAN[i][1]));
			        	}
			        Promise.all(promises).then(console.log("aggiornamento Completato per tutti gli EAN"));
			        	
			    	}
				)
		   )	
}




module.exports = {
aggiornaMagazzinoEANFull : aggiornaMagazzinoEANFull,
aggiornaMagazzinoFull : aggiornaMagazzinoFull,
}