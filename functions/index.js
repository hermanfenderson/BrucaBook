
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

//Da catalogo generale a catalogo locale...

exports.aggiornaDaCatalogo = functions.database.ref('/catalogo/{ean}')
   .onUpdate(event =>
			{
			const ean = event.params.ean;
			let newCatalogEntry = event.data.val();
			//
			let elencoLibrerieRef = event.data.ref.parent.parent.child('librerie').child('elencoLibrerie');
			
			elencoLibrerieRef.once("value").then(function(snapshot)
				{
				let elencoLibrerie = snapshot.val();
				for (var catena in elencoLibrerie)
					{
						for (var libreria in elencoLibrerie[catena].librerie)
							{
								//Per ciascuna libreria vedo se ho nel catalogo la riga... e se esiste la aggiorno...
								let catalogoLocaleRef = event.data.ref.parent.parent.child(catena).child(libreria).child('catalogo').child(ean);
								catalogoLocaleRef.once("value").then(function(snapshot)
								{
									if (snapshot.val()) catalogoLocaleRef.update(newCatalogEntry);	
								});
							}
					}
				});
			return true;	
			}
			);
//Da catalogo locale alle righe di bolle, scontrini, ecc...
exports.aggiornaDaCatalogoLocale = functions.database.ref('{catena}/{negozio}/catalogo/{ean}')
   .onUpdate(event =>
			{
			const ean = event.params.ean;
			const eanDetailsRef =  event.data.ref.parent.parent.child('registroEAN').child(ean);
			const catena = event.params.catena;
			const negozio = event.params.negozio;
			let newCatalogEntry = event.data.val();
			//Non aggiorno il prezzo di listino!
			newCatalogEntry.prezzoListinoUltimo = newCatalogEntry.prezzoListino;
			delete newCatalogEntry.prezzoListino;
			eanDetailsRef.once("value").then(function(snapshot)
				{
				let dettagliEAN = snapshot.val();
				console.log(dettagliEAN);
				for (var date in dettagliEAN)
					{
						for (var riga in dettagliEAN[date])
							{
								let path =  dettagliEAN[date][riga].tipo + '/' +   dettagliEAN[date][riga].id + '/' + riga;
								let refRiga = event.data.ref.parent.parent.child(path);
								refRiga.update(newCatalogEntry);
							}
					}
				});
			return true;	
			}
			);
			
exports.calcolaTotaleCassa = functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{idCassa}/{idScontrino}/totali')
    .onWrite(event => 
            {
             const cassa = event.params.idCassa;
             const anno = event.params.anno;
             const mese = event.params.mese;
			 var key = event.params.idScontrino;	
			 if (event.data.val()) key = event.data.val().lastActionKey;
		  //Come prima cosa determino cosa è cambiato...
           //POi calcolo i totali...
            const righeRef = event.data.ref.parent.parent;
            righeRef.once("value").then(function(snapshot) 
						      {
						      var totalePezzi = 0.0;
							  var totaleImporto = 0.0;
							  var scontrini = 0;
							  elencoScontrini = snapshot.val();
							  for(var propt in elencoScontrini)
		  							{
		  							scontrini++;	
		  							if (elencoScontrini[propt].totali)
		  								{
		  								totalePezzi = parseInt(elencoScontrini[propt].totali.pezzi) + totalePezzi;
		                    			totaleImporto = parseFloat(elencoScontrini[propt].totali.prezzoTotale) + totaleImporto;
		  								}
		  							}
		  					  const totali = {'pezzi' : totalePezzi, 
		  					                  'scontrini' : scontrini,
											  'prezzoTotale' : totaleImporto.toFixed(2), 'lastActionKey' : key}; 
											  
							 const ref = event.data.ref.parent.parent.parent.parent.parent.parent.child('elencoCasse').child(anno).child(mese).child(cassa);
							 if (totalePezzi > 0) ref.child('totali').set(totali); //Per non perdere tempo...
							//Se sono a zero pezzi ... aggiorno i totali... se non è vuoto elencoBolle...
							 else 
								{
									ref.once("value")
										.then(function(snapshot) {
											var notEmpty = snapshot.hasChildren(); 
						    				if (notEmpty) ref.child('totali').set(totali);
											 });
						    	}
            				   });  
             return true;					   
        	 }
           );

exports.calcolaTotaleScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}')
    .onWrite(event => 
            {
             const key = event.params.idScontrino;	
             const cassa = event.params.idCassa;
             const anno = event.params.anno;
             const mese = event.params.mese;
			
            var righeSnapshot = event.data;
            var idItem = null;	
           	
            const righe = event.data.val();
            
        	var totalePezzi = 0.0;
			var totaleImporto = 0.0;
		  	for(var propt in righe)
		  		{
		  		if (righeSnapshot.child(propt).changed()) idItem = propt; //Prendo la riga cambiata...	
			    totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
			    totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
				}
			//Se non la ho....  è una riga cancellata...
			if (!idItem)
				{
				var oldRighe=righeSnapshot.previous.val();
				for (let propt in oldRighe) 
							{
							if (righe) 
								{if (!righe[propt]) 
									{idItem = propt; //prendo la riga cancellata
									break;
									}
								}	
							else	
								{
									idItem = propt; //prendo l'ultima rimasta nel passato
									break;
								}
							}		
				}
			const totali = {'pezzi' : totalePezzi, 
			'prezzoTotale' : totaleImporto.toFixed(2), lastActionKey : idItem}; 
			const ref = event.data.ref.parent.parent.parent.parent.parent.child('elencoScontrini').child(anno).child(mese).child(cassa).child(key);
			if (totalePezzi > 0) ref.child('totali').set(totali); //Per non perdere tempo...
			//Se sono a zero pezzi ... aggiorno i totali... se non è vuoto elencoBolle...
			else 
				{
					ref.once("value")
						.then(function(snapshot) {
							console.log(snapshot.val());
		    				var notEmpty = snapshot.hasChildren(); 
		    				if (notEmpty) ref.child('totali').set(totali);
							 });
		    		}
           return true;	      
                }	
        	   
           );

//Modo "paraculo"... devo ragionare se crea problemi in transazione    
//Aggiungo una info ai totali per determinare se ho un valore aggiornato da far vedere all'utente...

exports.calcolaTotaleBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{idBolla}')
    .onWrite(event => 
            {
             const key = event.params.idBolla;	
             const anno = event.params.anno;
             const mese = event.params.mese;
			
            var righeSnapshot = event.data;
            var idItem = null;	
           	
            const righe = event.data.val();
            
        	var totalePezzi = 0.0;
			var totaleGratis = 0.0;
			var totaleImporto = 0.0;
		  	for(let propt in righe)
		  		{
		  		if (righeSnapshot.child(propt).changed()) idItem = propt; //Prendo la riga cambiata...	
			    totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
			    totaleGratis =  parseInt(righe[propt].gratis) + totaleGratis;
			    totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
				}
			//Se non la ho....  è una riga cancellata...
			if (!idItem)
				{
				var oldRighe=righeSnapshot.previous.val();
				for (let propt in oldRighe) 
							{
							if (righe) 
								{if (!righe[propt]) 
									{idItem = propt; //prendo la riga cancellata
									break;
									}
								}	
							else	
								{
									idItem = propt; //prendo l'ultima rimasta nel passato
									break;
								}
							}		
				}
			const totali = {'pezzi' : totalePezzi, 'gratis' : totaleGratis, 
			'prezzoTotale' : totaleImporto.toFixed(2), lastActionKey : idItem}; 
			const ref = event.data.ref.parent.parent.parent.parent.child('elencoBolle').child(anno).child(mese).child(key);
			if (totalePezzi + totaleGratis > 0) ref.child('totali').set(totali); //Per non perdere tempo...
			//Se sono a zero pezzi ... aggiorno i totali... se non è vuoto elencoBolle...
			else 
				{
					ref.once("value")
						.then(function(snapshot) {
							var notEmpty = snapshot.hasChildren(); 
		    				if (notEmpty) ref.child('totali').set(totali);
							 });
		    		}
            return true;	
                }	
        	   
           );
           
exports.calcolaTotaleResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{idResa}')
    .onWrite(event => 
            {
             const key = event.params.idResa;	
             const anno = event.params.anno;
             const mese = event.params.mese;
			
            var righeSnapshot = event.data;
            var idItem = null;	
           	
            const righe = event.data.val();
            
        	var totalePezzi = 0.0;
			var totaleGratis = 0.0;
			var totaleImporto = 0.0;
		  	for(let propt in righe)
		  		{
		  		if (righeSnapshot.child(propt).changed()) idItem = propt; //Prendo la riga cambiata...	
			    totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
			    totaleGratis =  parseInt(righe[propt].gratis) + totaleGratis;
			    totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
				}
			//Se non la ho....  è una riga cancellata...
			if (!idItem)
				{
				var oldRighe=righeSnapshot.previous.val();
				for (let propt in oldRighe) 
							{
							if (righe) 
								{if (!righe[propt]) 
									{idItem = propt; //prendo la riga cancellata
									break;
									}
								}	
							else	
								{
									idItem = propt; //prendo l'ultima rimasta nel passato
									break;
								}
							}		
				}
			const totali = {'pezzi' : totalePezzi, 'gratis' : totaleGratis, 
			'prezzoTotale' : totaleImporto.toFixed(2), lastActionKey : idItem}; 
			const ref = event.data.ref.parent.parent.parent.parent.child('elencoRese').child(anno).child(mese).child(key);
			if (totalePezzi + totaleGratis > 0) ref.child('totali').set(totali); //Per non perdere tempo...
			//Se sono a zero pezzi ... aggiorno i totali... se non è vuoto elencoRese...
			else 
				{
					ref.once("value")
						.then(function(snapshot) {
							var notEmpty = snapshot.hasChildren(); 
		    				if (notEmpty) ref.child('totali').set(totali);
							 });
		    		}
            return true;	
                }	
        	   
           );
                      
/* CAMBIO STRATEGIA... QUESTA FUNZIONE NON SERVE PIU'           
exports.calcolaTotaleInventario = functions.database.ref('{catena}/{negozio}/inventari/{idInventario}')
    .onWrite(event => 
            {
             const key = event.params.idInventario;	
           	
            var righeSnapshot = event.data;
            var idItem = null;	
           	
            const righe = event.data.val();
            
        	var totale = 0;
			for(let propt in righe)
		  		{
		  		if (righeSnapshot.child(propt).changed()) idItem = propt; //Prendo la riga cambiata...	
			    totale++;
				}
			//Se non la ho....  è una riga cancellata...
			if (!idItem)
				{
				var oldRighe=righeSnapshot.previous.val();
				for (let propt in oldRighe) 
							{
							if (righe) 
								{if (!righe[propt]) 
									{idItem = propt; //prendo la riga cancellata
									break;
									}
								}	
							else	
								{
									idItem = propt; //prendo l'ultima rimasta nel passato
									break;
								}
							}		
				}
			const totali = {'righe' : totale, lastActionKey : idItem}; 
			const ref = event.data.ref.parent.parent.child('elencoInventari').child(key);
			if (totale > 0) ref.child('totali').update(totali);
			else 
				{
					ref.once("value")
						.then(function(snapshot) {
							var notEmpty = snapshot.hasChildren(); 
		    				if (notEmpty) ref.child('totali').update(totali);
							 });
                }	
            }   
           );
       

*/

//Cancello tutti i figli di una bolla...se l'ho cancellata dall'elenco. Chiedo prima conferma ovviamente...

exports.purgeBolla =  functions.database.ref('{catena}/{negozio}/elencoBolle/{anno}/{mese}/{idBolla}')
    .onDelete(event => 
            {
            const key = event.params.idBolla;
                const anno = event.params.anno;
             const mese = event.params.mese;
		
            
			console.info("Cancello bolla "+key);
			return event.data.ref.parent.parent.parent.parent.child('bolle').child(anno).child(mese).child(key).remove();
    		}
           );
           
exports.purgeResa =  functions.database.ref('{catena}/{negozio}/elencoRese/{anno}/{mese}/{idResa}')
    .onDelete(event => 
            {
            const key = event.params.idResa;
                const anno = event.params.anno;
             const mese = event.params.mese;
		
            
			console.info("Cancello resa "+key);
			return event.data.ref.parent.parent.parent.parent.child('rese').child(anno).child(mese).child(key).remove();
    		}
           );      
           
//Idem per gli scontrini...

exports.purgeScontrino =  functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{idCassa}/{idScontrino}')
    .onDelete(event => 
            {
            const key = event.params.idScontrino;
            const cassa = event.params.idCassa;
                const anno = event.params.anno;
             const mese = event.params.mese;
		
            
			console.info("Cancello scontrino "+key);
			return event.data.ref.parent.parent.parent.parent.parent.child('scontrini').child(anno).child(mese).child(cassa).child(key).remove();
    		}
           );

//Idem per le casse... cancello solo elencoScontrini che propaga l'effetto...
exports.purgeCassa =  functions.database.ref('{catena}/{negozio}/elencoCasse/{anno}/{mese}/{idCassa}')
    .onDelete(event => 
            {
            const cassa = event.params.idCassa;
                const anno = event.params.anno;
             const mese = event.params.mese;
		
            
			console.info("Cancello cassa "+cassa);
			return event.data.ref.parent.parent.parent.parent.child('elencoScontrini').child(anno).child(mese).child(cassa).remove();
    		}
           );

exports.purgeInventario =  functions.database.ref('{catena}/{negozio}/elencoInventari/{idInventario}')
    .onDelete(event => 
            {
            const inventario = event.params.idInventario;
            
			console.info("Cancello inventario "+inventario);
			return event.data.ref.parent.parent.child('inventari').child(inventario).remove();
    		}
           );


//Salvo la nuova data nelle righe già presenti...
exports.updateBolla =  functions.database.ref('{catena}/{negozio}/elencoBolle/{anno}/{mese}/{idBolla}')
    .onUpdate(event => 
            {
            if (!event.data.child('totali').changed()) //Per discernere cambiamenti genuini in testata
              {
	            const key = event.params.idBolla;	
	            const anno = event.params.anno;
	            const mese = event.params.mese;
	            var values = Object.assign({}, event.data.val());
			    delete values.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
			    delete values.createdBy;
			    delete values.createdAt;
			    delete values.changedBy;
			    delete values.changedAt;
			    delete values.key;
			    values.data = values.dataCarico;
				console.info("Aggiorno bolla "+key);
				const ref = event.data.ref.parent.parent.parent.parent.child('bolle').child(anno).child(mese).child(key);
				ref.once('value', function(snapshot) {
					snapshot.forEach(function(childSnapshot) 
						{
				    	childSnapshot.ref.update(values);
	    				})
					})
				}
			  
            	return true;	
            }	
    		);
 //Salvo la nuova data nelle righe già presenti...
exports.updateResa =  functions.database.ref('{catena}/{negozio}/elencoRese/{anno}/{mese}/{idResa}')
    .onUpdate(event => 
            {
            if (!event.data.child('totali').changed()) //Per discernere cambiamenti genuini in testata
              {
	            const key = event.params.idResa;	
	            const anno = event.params.anno;
	            const mese = event.params.mese;
	            var values = Object.assign({}, event.data.val());
			    delete values.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
			    delete values.createdBy;
			    delete values.createdAt;
			    delete values.changedBy;
			    delete values.changedAt;
			    delete values.key;
			    values.data = values.dataCarico;
				console.info("Aggiorno bolla "+key);
				const ref = event.data.ref.parent.parent.parent.parent.child('rese').child(anno).child(mese).child(key);
				ref.once('value', function(snapshot) {
					snapshot.forEach(function(childSnapshot) 
						{
				    	childSnapshot.ref.update(values);
	    				})
					})
				}
			 return true;	
			  }	
    		);   		
           
 exports.updateScontrino =  functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{idCassa}/{idScontrino}')
    .onUpdate(event => 
            {
            if (!event.data.child('totali').changed()) //Per discernere cambiamenti genuini in testata
              {	
	            const key = event.params.idScontrino;	
	            const anno = event.params.anno;
	            const mese = event.params.mese;
	            const cassa = event.params.idCassa;
			    var values = Object.assign({}, event.data.val());
			    delete values.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
			    delete values.createdBy;
			    delete values.createdAt;
			    delete values.changedBy;
			    delete values.changedAt;
			    delete values.key;
			    values.data = values.dataCassa;
				console.info("Aggiorno scontrino "+key);
				const ref = event.data.ref.parent.parent.parent.parent.parent.child('scontrini').child(anno).child(mese).child(cassa).child(key);
				ref.once('value', function(snapshot) {
					snapshot.forEach(function(childSnapshot) 
						{
				    	childSnapshot.ref.update(values);
	    				})
					})
              }	
			return true;	
            	
            }	
    		);
              
     
//Il registroEAN è organizzato per catena -> Negozio -> EAN -> keyDocumento che origina il valore...
//Caso insert o modify si limita a creare una copia dell'oggetto nel registro. 
//Caso delete cerca nel passato quello che era...
//Il registroData è organizzato per catena -> Negozio -> Data -> keyDocumento...
//Per la insert vado liscio...
//Per modify e delete: 
//In preambolo devo cercare due info... la data com'era (old_date) e la data com'è (new_date)
//qui il caso della modify è se non è cambiata la data... di puro insert
//Nel caso di data cambiata... devo cancellare e reinserire
//Caso delete... ho solo il valore attuale...

//Nel caso delle bolle...  

exports.inserisciRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{idBolla}/{keyRiga}')
    .onCreate(event =>
    		{
    			const key =  event.params.keyRiga;
    			const ean = event.data.val().ean;	
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'bolle', id: event.params.anno + '/'+ event.params.mese + '/'+event.params.idBolla});
                event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
                 event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		
    		 return true;		
    		}
         
          ); 

exports.modificaRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{idBolla}/{keyRiga}')
    .onUpdate(event =>
    		{
    			const key =event.params.keyRiga;
    			const ean = event.data.val().ean;	
    			const oldData = event.data.previous.val().data;
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'bolle', id:  event.params.anno + '/'+ event.params.mese + '/'+ event.params.idBolla});
//Se è cambiata la data devo cancellare la vecchia riga...
                if (oldData !== data) 
                	{
                	event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+oldData+'/'+key).remove();
                	event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+oldData+'/'+key).remove();
                		
                	}
                event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
      
                event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    	  return true;	
    		}
          ); 

exports.eliminaRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{idBolla}/{keyRiga}')
    .onDelete(event =>
    		{
    			const key = event.params.keyRiga;
    			const ean = event.data.previous.val().ean;	
    			const data = event.data.previous.val().data;
    			event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).remove();
                event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).remove();
    	  return true;	
    		}
          ); 

//Nel caso delle rese...  

exports.inserisciRegistroDaResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{idResa}/{keyRiga}')
    .onCreate(event =>
    		{
    			const key =  event.params.keyRiga;
    			const ean = event.data.val().ean;	
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'rese', id: event.params.anno + '/'+ event.params.mese + '/'+event.params.idResa});
                event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
                 event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		return true;	
    			
    		}
          ); 

exports.modificaRegistroDaResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{idResa}/{keyRiga}')
    .onUpdate(event =>
    		{
    			const key =event.params.keyRiga;
    			const ean = event.data.val().ean;	
    			const oldData = event.data.previous.val().data;
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'rese', id:  event.params.anno + '/'+ event.params.mese + '/'+ event.params.idResa});
//Se è cambiata la data devo cancellare la vecchia riga...
                if (oldData !== data) 
                	{
                	event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+oldData+'/'+key).remove();
                	event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+oldData+'/'+key).remove();
                		
                	}
                event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
      
                event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		return true;	
    			
    		}
          ); 

exports.eliminaRegistroDaResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{idResa}/{keyRiga}')
    .onDelete(event =>
    		{
    			const key = event.params.keyRiga;
    			const ean = event.data.previous.val().ean;	
    			const data = event.data.previous.val().data;
    			event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).remove();
                event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).remove();
    	return true;	
    		}
          ); 

//Nel caso degli scontrini...  

exports.inserisciRegistroDaScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}/{keyRiga}')
    .onCreate(event =>
    		{
    			const key =  event.params.keyRiga;
    			const ean = event.data.val().ean;	
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'scontrini', id: event.params.anno + '/'+ event.params.mese + '/'+event.params.idCassa + '/'+event.params.idScontrino});
                event.data.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
                 event.data.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    	return true;	
    		}
          ); 

exports.modificaRegistroDaScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}/{keyRiga}')
    .onUpdate(event =>
    		{
    			const key =event.params.keyRiga;
    			const ean = event.data.val().ean;	
    			const oldData = event.data.previous.val().data;
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'scontrini', id:  event.params.anno + '/'+ event.params.mese + '/'+event.params.idCassa + '/'+event.params.idScontrino});
                //Se è cambiata la data devo cancellare la vecchia riga...
                console.log(newVal);
                if (oldData !== data) 
                	{
                	event.data.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+oldData+'/'+key).remove();
                	event.data.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+oldData+'/'+key).remove();
                		
                	}
                event.data.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
      
                event.data.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		return true;	
    			
    		}
          ); 

exports.eliminaRegistroDaScontrini = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}/{keyRiga}')
    .onDelete(event =>
    		{
    			const key = event.params.keyRiga;
    			const ean = event.data.previous.val().ean;	
    			const data = event.data.previous.val().data;
    			event.data.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).remove();
                event.data.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).remove();
    		
    		return true;		
    		}
          ); 
          

//Nel caso dell'inventario
exports.inserisciRegistroDaInventario = functions.database.ref('{catena}/{negozio}/inventari/{idInventario}/{keyRiga}')
    .onCreate(event =>
    		{
    			const key =  event.params.keyRiga; //Corrisponde a EAN...
    			const ean = event.data.val().ean;	
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'inventari', id: event.params.idInventario});
                event.data.ref.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
                event.data.ref.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		
    		return true;		
    		}
          ); 

exports.modificaRegistroDaInventario = functions.database.ref('{catena}/{negozio}/inventari/{idInventario}/{keyRiga}')
    .onUpdate(event =>
    		{
    			const key = event.params.keyRiga;
    			const ean = event.data.val().ean;	
    			const oldData = event.data.previous.val().data;
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'inventari', id:  event.params.idInventario});
                 //Se è cambiata la data devo cancellare la vecchia riga...
                if (oldData !== data) 
                	{
                	event.data.ref.parent.parent.parent.child('registroData/'+oldData+'/'+key).remove();
                	event.data.ref.parent.parent.parent.child('registroEAN/'+ean+'/'+oldData+'/'+key).remove();
          		
                	}
                event.data.ref.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
      
                event.data.ref.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
            return true;	
    		}
          ); 

exports.eliminaRegistroDaInventario = functions.database.ref('{catena}/{negozio}/inventari/{idInventario}/{keyRiga}')
    .onDelete(event =>
    		{
    			const key = event.params.keyRiga;
    			const ean = event.data.previous.val().ean;	
    			const data = event.data.previous.val().data;
    			event.data.ref.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).remove();
                event.data.ref.parent.parent.parent.child('registroData/'+data+'/'+key).remove();
    		
    		return true;		
    		}
          ); 

exports.aggiornaMagazzino = functions.database.ref('{catena}/{negozio}/registroEAN/{ean}')
    .onWrite(event => 
            {
            const ean = event.params.ean;	
            //Caso riga cancellata....cancello semplicemente EAN ... e cancello la entry corrispondente 
         
            if (!event.data.exists()) 
                  {
                  return event.data.ref.parent.parent.child('magazzino/'+ean).remove();	
                  }
            else 
            	  {
            	  var totalePezzi = 0;
        		  var righe;
            	  date = event.data.val();	
            	  for(var propt2 in date)
		  			{righe = date[propt2];
		  				for (var propt in righe)	
		  				{
		  				 if (righe[propt].tipo == "bolle")
		  					{
			    			totalePezzi = parseInt(righe[propt].pezzi) + parseInt(righe[propt].gratis)+ totalePezzi;
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}
					    if (righe[propt].tipo == "rese")
		  					{
			    			totalePezzi = totalePezzi - (parseInt(righe[propt].pezzi) + parseInt(righe[propt].gratis));
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}	
						if (righe[propt].tipo == "scontrini")
		  					{
		  					totalePezzi = totalePezzi - parseInt(righe[propt].pezzi);
			    		
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}
							
						if (righe[propt].tipo == "inventari")
		  					{
		  					totalePezzi = totalePezzi + parseInt(righe[propt].pezzi);
			    		
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}		
		  				}
		  		     }	
			      const totali = {'pezzi' : totalePezzi, 'titolo' : righe[propt].titolo, 'autore' : righe[propt].autore, 'prezzoListino' : righe[propt].prezzoListino, 'imgFirebaseUrl': righe[propt].imgFirebaseUrl } ; 
            	  return event.data.ref.parent.parent.child('magazzino/'+ean).set(totali);
            	  }
               
            //Caso riga inserita o modificata... la sostituisco integralmente. 
            return true;	
            }
           ); 
    
