
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.calcolaTotaleCassa = functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{idCassa}/{idScontrino}/totali')
    .onWrite(event => 
            {
             const cassa = event.params.idCassa;
             const anno = event.params.anno;
             const mese = event.params.mese;
			 var key = event.params.idScontrino;	
            //Come prima cosa determino cosa è cambiato...
            key = event.data.val().lastActionKey;
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
											  'prezzoTotale' : totaleImporto.toFixed(2), lastActionKey : key}; 
											  
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
				for (var propt in oldRighe) 
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
		  	for(var propt in righe)
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
				for (var propt in oldRighe) 
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
							console.log(snapshot.val());
		    				var notEmpty = snapshot.hasChildren(); 
		    				if (notEmpty) ref.child('totali').set(totali);
							 });
		    		}
                }	
        	   
           );
           
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


//Salvo la nuova data nelle righe già presenti...
exports.updateBolla =  functions.database.ref('{catena}/{negozio}/elencoBolle/{anno}/{mese}/{idBolla}')
    .onUpdate(event => 
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
    		);
           
 exports.updateScontrino =  functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{idCassa}/{idScontrino}')
    .onUpdate(event => 
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
            	const newVal = Object.assign(event.data.val(), {tipo: 'bolla', id: event.params.anno + '/'+ event.params.mese + '/'+event.params.idBolla});
                event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+key).set(newVal);
                 event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		}
          ); 

exports.modificaRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{idBolla}/{keyRiga}')
    .onUpdate(event =>
    		{
    			const key =event.params.keyRiga;
    			const ean = event.data.val().ean;	
    			const oldData = event.data.previous.val().data;
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'bolla', id:  event.params.anno + '/'+ event.params.mese + '/'+ event.params.idBolla});
                event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+key).set(newVal);
                //Se è cambiata la data devo cancellare la vecchia riga...
                if (oldData !== data) event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+oldData+'/'+key).remove();
                event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		}
          ); 

exports.eliminaRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{idBolla}/{keyRiga}')
    .onDelete(event =>
    		{
    			const key = event.params.keyRiga;
    			const ean = event.data.previous.val().ean;	
    			const data = event.data.previous.val().data;
    			event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+key).remove();
                event.data.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).remove();
    		}
          ); 

//Nel caso delle bolle...  

exports.inserisciRegistroDaScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}/{keyRiga}')
    .onCreate(event =>
    		{
    			const key =  event.params.keyRiga;
    			const ean = event.data.val().ean;	
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'scontrino', id: event.params.anno + '/'+ event.params.mese + '/'+event.params.idCassa + '/'+event.params.idScontrino});
                event.data.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+key).set(newVal);
                 event.data.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		}
          ); 

exports.modificaRegistroDaScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}/{keyRiga}')
    .onUpdate(event =>
    		{
    			const key =event.params.keyRiga;
    			const ean = event.data.val().ean;	
    			const oldData = event.data.previous.val().data;
    			const data = event.data.val().data;
            	const newVal = Object.assign(event.data.val(), {tipo: 'scontrino', id:  event.params.anno + '/'+ event.params.mese + '/'+ +event.params.idCassa + '/'+event.params.idScontrino});
                event.data.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+key).set(newVal);
                //Se è cambiata la data devo cancellare la vecchia riga...
                if (oldData !== data) event.data.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+oldData+'/'+key).remove();
                event.data.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		}
          ); 

exports.eliminaRegistroDaScontrini = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}/{keyRiga}')
    .onDelete(event =>
    		{
    			const key = event.params.keyRiga;
    			const ean = event.data.previous.val().ean;	
    			const data = event.data.previous.val().data;
    			event.data.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+key).remove();
                event.data.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).remove();
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
        		  var titolo;
                  var autore;
          	      
            	  righe = event.data.val();	
            	  for(var propt in righe)
		  				{
		  				 if (righe[propt].tipo == "bolla")
		  					{
			    			totalePezzi = parseInt(righe[propt].pezzi) + parseInt(righe[propt].gratis)+ totalePezzi;
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}
						if (righe[propt].tipo == "scontrino")
		  					{
		  					totalePezzi = totalePezzi - parseInt(righe[propt].pezzi);
			    		
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}	
		  				}	
			      const totali = {'pezzi' : totalePezzi, 'titolo' : righe[propt].titolo, 'autore' : righe[propt].autore}; 
            	  return event.data.ref.parent.parent.child('magazzino/'+ean).set(totali);
            	  }
               
            //Caso riga inserita o modificata... la sostituisco integralmente. 
            
            }
           ); 
    
