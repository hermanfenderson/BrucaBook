const getDiff = (value,oldValue) =>{
let tipo = value ? value.tipo : oldValue.tipo;
let pezzi = value ? value.pezzi : 0;
let oldPezzi = oldValue ? oldValue.pezzi : 0;
let gratis = (value && value.gratis) ? value.gratis : 0;
let oldGratis = (oldValue && oldValue.gratis) ? oldValue.gratis : 0;
let diff = pezzi - oldPezzi + gratis - oldGratis;
if (tipo==='scontrini' || tipo==='rese') diff = -1 * diff;
return diff;
}

const getValues = (value,oldValue) =>{
let autore = value ? value.autore : oldValue.autore;
let titolo = value ? value.titolo : oldValue.titolo;
let editore = value ? value.editore : oldValue.editore;

let imgFirebaseUrl = value ? value.imgFirebaseUrl : oldValue.imgFirebaseUrl;
let prezzoListino = value ? value.prezzoListino : oldValue.prezzoListino;
let nomeCategoria = value ? value.nomeCategoria : oldValue.nomeCategoria;
return {autore: autore, titolo: titolo, editore: editore, imgFirebaseUrl: imgFirebaseUrl, prezzoListino: prezzoListino, nomeCategoria: nomeCategoria};
} 

const calcolaPezzi = (registro,data) =>
{
	 var totalePezzi = 0;
     var righe;
     for(var propt2 in registro)
		  		   	{
		  		   	if (!data || (data && propt2 <= data))	
		  		   	righe = registro[propt2];
		  		   
		  			   	for (var propt in righe)	
		  				{
		  				 if (righe[propt].tipo == "bolle")
		  					{
			    			totalePezzi = parseInt(righe[propt].pezzi) + parseInt(righe[propt].gratis)+ totalePezzi;
			    			}
					    if (righe[propt].tipo == "rese")
		  					{
			    			totalePezzi = totalePezzi - (parseInt(righe[propt].pezzi) + parseInt(righe[propt].gratis));
			    			}	
						if (righe[propt].tipo == "scontrini")
		  					{
		  					totalePezzi = totalePezzi - parseInt(righe[propt].pezzi);
			    			}
							
						if (righe[propt].tipo == "inventari")
		  					{
		  					totalePezzi = totalePezzi + parseInt(righe[propt].pezzi);
			    			}
						}
		  		   	}	
	return(totalePezzi);
}


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



const aggiornaMagazzinoEANDiff = (admin, ean, refRadix, values, diff) =>
{
	return(refRadix.child('magazzino').child(ean).transaction(function(stockEAN) {
		if (!stockEAN) stockEAN={};
		let pezzi = stockEAN.pezzi ? stockEAN.pezzi : 0;
		stockEAN.pezzi = pezzi + diff;
		stockEAN.titolo = values.titolo;
		stockEAN.autore = values.autore;
	    stockEAN.editore = values.editore;
	    
	    if (values.categoria) stockEAN.categoria = values.categoria;
	     stockEAN.nomeCategoria = (values.nomeCategoria) ? values.nomeCategoria : null;
	    
		stockEAN.imgFirebaseUrl = values.imgFirebaseUrl;
		stockEAN.prezzoListino = values.prezzoListino;
		stockEAN.createdAt = admin.database.ServerValue.TIMESTAMP;
		return(stockEAN);    
		}).then(()=>{console.info('aggiornato EAN '+ean);}));
};

const aggiornaStoricoMagazzinoEANDiff = (admin, ean, refRadix, dataChange, values, diff) =>
{
return(refRadix.child('storicoMagazzino').transaction(function(storicoMagazzino) {
	    //Faccio loop su tutte le date...
	    if (!storicoMagazzino) storicoMagazzino = {};
	    let stockEAN = {};
	     stockEAN.titolo = values.titolo;
	    stockEAN.autore = values.autore;
	    stockEAN.editore = values.editore;
	    
		stockEAN.imgFirebaseUrl = values.imgFirebaseUrl;
		stockEAN.prezzoListino = values.prezzoListino;
		stockEAN.createdAt = admin.database.ServerValue.TIMESTAMP;
		let lastPezzi = 0;
	    for (let data in storicoMagazzino)
	    	{
	    	//Questa if era nel posto sbagliato (due righe sotto) e non consentiva a storicoMagazzino di crearsi in prima istanza!	
	    	if (!storicoMagazzino[dataChange]) storicoMagazzino[dataChange] = {};
	            	
	    	if (data >= dataChange)
	    		{
	    			//if (!storicoMagazzino[data]) storicoMagazzino[data] = {};
	                if (!storicoMagazzino[data][ean]) storicoMagazzino[data][ean] = {};
	  
	    			storicoMagazzino[data][ean].autore = values.autore;
	    			storicoMagazzino[data][ean].titolo = values.titolo;
	    		//	storicoMagazzino[data][ean].editore = values.editore;
	    			
				
					storicoMagazzino[data][ean].imgFirebaseUrl = values.imgFirebaseUrl;
					storicoMagazzino[data][ean].prezzoListino = values.prezzoListino;
					storicoMagazzino[data][ean].createdAt = admin.database.ServerValue.TIMESTAMP;
					//trascino ultima quantità nota...
					lastPezzi = (storicoMagazzino[data][ean] && storicoMagazzino[data][ean].pezzi) ? storicoMagazzino[data][ean].pezzi : lastPezzi;
	    			storicoMagazzino[data][ean].pezzi = lastPezzi + diff;
	    		}
	    	}
		return(storicoMagazzino);    
		}).then(()=>{console.info('aggiornato storico magazzino EAN '+ean);}));
};		

module.exports = {
calcolaPezzi : calcolaPezzi,
getValues : getValues,
getDiff : getDiff,
aggiornaMagazzinoEANDiff : aggiornaMagazzinoEANDiff,
aggiornaStoricoMagazzinoEANDiff : aggiornaStoricoMagazzinoEANDiff ,
aggiornaMagazzinoEANFull : aggiornaMagazzinoEANFull,
aggiornaMagazzinoFull : aggiornaMagazzinoFull,
}