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
let imgFirebaseUrl = value ? value.imgFirebaseUrl : oldValue.imgFirebaseUrl;
let prezzoListino = value ? value.prezzoListino : oldValue.prezzoListino;
return {autore: autore, titolo: titolo, imgFirebaseUrl: imgFirebaseUrl, prezzoListino: prezzoListino};
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

const aggiornaMagazzinoEANDiff = (admin, ean, refRadix, values, diff) =>
{
	return(refRadix.child('magazzino').child(ean).transaction(function(stockEAN) {
		if (!stockEAN) stockEAN={};
		let pezzi = stockEAN.pezzi ? stockEAN.pezzi : 0;
		stockEAN.pezzi = pezzi + diff;
		stockEAN.autore = values.autore;
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
	    stockEAN.autore = values.autore;
		stockEAN.imgFirebaseUrl = values.imgFirebaseUrl;
		stockEAN.prezzoListino = values.prezzoListino;
		stockEAN.createdAt = admin.database.ServerValue.TIMESTAMP;
		let lastPezzi = 0;
	    for (let data in storicoMagazzino)
	    	{
	    	if (data >= dataChange)
	    		{
	    			if (!storicoMagazzino[data]) storicoMagazzino[data] = {};
	                if (!storicoMagazzino[data][ean]) storicoMagazzino[data][ean] = {};
	  
	    			storicoMagazzino[data][ean].autore = values.autore;
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
aggiornaStoricoMagazzinoEANDiff : aggiornaStoricoMagazzinoEANDiff 
}