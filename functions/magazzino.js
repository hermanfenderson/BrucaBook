

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
     let numAllDates = allDates.length;
     let posDate=0;
     let pnt=-1;
     let firstEanDate = righePerData[0][0];
        
     for (let posAllDates=0; posAllDates<numAllDates;posAllDates++)
        {
        //tre casi... data del loop minore della data da cui parte la sequenza... non devo fare nulla..
        let eanDate = righePerData[posDate][0];
        if (allDates[posAllDates] >= firstEanDate) {
        	                                let newValues = {ean: (values.ean) ? values.ean : '', 
        													 titolo: (values.titolo) ? values.titolo : '',
        													 autore: (values.autore) ? values.autore : '',
        													 editore: (values.editore) ? values.editore : '',
        													 prezzoListino: (values.prezzoListino) ? values.prezzoListino : 0.00,
        													 categoria: (values.categoria) ? values.categoria : '',
        													 iva: (values.iva) ? values.iva : 'a0',
        	                                				}
        								   
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
	    	if (allDates[posAllDates] >= firstEanDate) totalePezziDate[pnt][1].pezzi = totalePezzi; //Progressivo pezzi alla fine di una data...  
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
			    	if (ean)
			    	{
			    	console.log("aggiorno magazzino per ean: "+ean);
				    let updates={};
				    let storicoDates = Object.keys(snapshot.val());
				    let eanDates = Object.keys(registro);
				    let allDates = Array.from(new Set(storicoDates.concat(eanDates))).sort();
				    //let allDates = Object.keys(snapshot.val());
				    console.log(allDates);
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
				    	console.log(updates);
				    	
				        refRadix.update(updates).then(console.log("Aggiornato magazzino: "+ean));
				        
			    	}
			    	else (console.log("ean non definito"));
			    	}    
			)												)
	
}

const aggiornaMagazzinoFull = (admin, refRadix) =>
{   //Prima di tutto pulisco magazzino e storicoMagazzino
/*
    refRadix.child('registroEAN').once("value").then(
			    function(snapshot) 
			    	{
   					let registroEAN = Object.entries(snapshot.val());
			    	
			    	return(registroEAN.reduce( async (previousPromise, nextID) => {
					await previousPromise;
					return aggiornaMagazzinoEANFull(admin, nextID[0], refRadix, nextID[1]);
					}, Promise.resolve().then(console.log("aggiornamento completato per tutti gli EAN"))))
			    	})
	*/		    	
					
   
    let clearAll = {};
    clearAll['magazzino'] = {};
    clearAll['storicoMagazzino'] = {};
   
   return(refRadix.update(clearAll).then(
				()=>{refRadix.child('registroEAN').once("value").then(
			    function(snapshot) 
			    	{
			    	//Solita storia in 0 gli EAN in 1 il pezzo di registro...	
			    	
			    	let registroEAN = Object.entries(snapshot.val());
			    	
			    	/*
			    	registroEAN.reduce( async (previousPromise, nextID) => {
					await previousPromise;
					return aggiornaMagazzinoEANFull(admin, nextID[0], refRadix, nextID[1]);
					}, Promise.resolve().then(console.log("aggiornamento completato per tutti gli EAN")));
					*/


			        let promises = [];
			        for (let i=0; i<registroEAN.length; i++) 
			        	{
			        	promises.push(aggiornaMagazzinoEANFull(admin, registroEAN[i][0], refRadix, registroEAN[i][1]));
			        	}
			        Promise.all(promises).then(console.log("aggiornamento completatoooo per tutti gli EAN"));
		        
            
			    	}
				)
			   }
		     )
		   )	
}


const aggiornaMagazzinoFullNew = (admin, refRadix) =>
{ 	
	return(refRadix.child('registroData').once("value").then(
			    function(snapshot) 
			    	{
			    	//Solita storia in 0 gli EAN in 1 il pezzo di registro...	
			    	
			    	let registroData = Object.entries(snapshot.val());
			    	let eanInfo = {};
			    	let updates = {};
			        let promises = [];
			     
			    	//Update a chunk di date...
			    	 for (let i=0; i<registroData.length; i++) 
			        	{
			        	 let rowsData = Object.values(registroData[i][1]);
			        		for (let j=0; j<rowsData.length; j++) 
			        			{
			        	 
			        			let values = rowsData[j]; 
			        			let ean = values.ean;
			        			let pezzi =  (eanInfo[ean]) ? eanInfo[ean].pezzi : 0;
			        			if (values.tipo == "bolle")
				  					{
					    			pezzi = parseInt(values.pezzi) + parseInt(values.gratis)+ pezzi;
					    			}
								 if (values.tipo == "rese")
				  					{
					    			pezzi = pezzi - (parseInt(values.pezzi) + parseInt(values.gratis));
					    			}	
								if (values.tipo == "scontrini")
				  					{
				  					pezzi = pezzi - parseInt(values.pezzi);
					    			}
									
								if (values.tipo == "inventari")
				  					{
				  					pezzi = pezzi + parseInt(values.pezzi);
					    			}
				        		eanInfo[ean] = {ean: (values.ean) ? values.ean : '', 
        													 titolo: (values.titolo) ? values.titolo : '',
        													 autore: (values.autore) ? values.autore : '',
        													 editore: (values.editore) ? values.editore : '',
        													 prezzoListino: (values.prezzoListino) ? values.prezzoListino : 0.00,
        													 categoria: (values.categoria) ? values.categoria : '',
        													 iva: (values.iva) ? values.iva : 'a0',
        													 pezzi: pezzi
        	                                				}
			        			}            				
        				//Qui preparo gli updates specifici della giornata...
			        	let currentData = registroData[i][0];
			        	promises.push(refRadix.child('storicoMagazzino/'+currentData).update({...eanInfo}));
			        //	updates['storicoMagazzino/'+currentData] = {...eanInfo};				   	
			        	}
			        	promises.push(refRadix.child('magazzino').update({...eanInfo}));
			            Promise.all(promises).then(console.log("aggiornamento completatoooo per tutti gli EAN"));
		        
			        //	
			       // updates['magazzino'] = {...eanInfo};				   	
			   
					//refRadix.update(updates).then(console.log("Aggiornamento complessivo magazzino"));
			    	}
				)
		   )
}

const aggiornaMagazzinoDataFull = (data, refRadix, registro) => 
{
	
	//dato EAN leggo tutta la parte di registro che lo riguarda...
	return(refRadix.child('dateStoricoMagazzino').once("value").then(
		function(snapshot) 
			    	{
			    	if (ean)
			    	{
			    	console.log("aggiorno magazzino per ean: "+ean);
				    let updates={};
				    let storicoDates = Object.keys(snapshot.val());
				    let eanDates = Object.keys(registro);
				    let allDates = Array.from(new Set(storicoDates.concat(eanDates))).sort();
				    //let allDates = Object.keys(snapshot.val());
				    console.log(allDates);
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
				    	console.log(updates);
				    	
				        refRadix.update(updates).then(console.log("Aggiornato magazzino: "+ean));
				        
			    	}
			    	else (console.log("ean non definito"));
			    	}    
			)												)
	
}


module.exports = {
aggiornaMagazzinoEANFull : aggiornaMagazzinoEANFull,
aggiornaMagazzinoFull : aggiornaMagazzinoFull,
}