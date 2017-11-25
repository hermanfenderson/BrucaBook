
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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
           

//Salvo la nuova data nelle righe già presenti...
exports.updateBolla =  functions.database.ref('{catena}/{negozio}/elencoBolle/{anno}/{mese}/{idBolla}')
    .onUpdate(event => 
            {
            const key = event.params.idBolla;	
                 const anno = event.params.anno;
             const mese = event.params.mese;
		
			console.info("Aggiorno bolla "+key);
			const ref = event.data.ref.parent.parent.parent.parent.child('bolle').child(anno).child(mese).child(key);
			ref.once('value', function(snapshot) {
				snapshot.forEach(function(childSnapshot) 
					{
			    	childSnapshot.ref.update({'data': event.data.val().dataCarico});
    				})
				})
			}	
    		);
           
           
//Da coompletare...           
exports.calcolaTotaleScontrino = functions.database.ref('{catena}/{negozio}/vendite/{idCassa}/{idScontrino}/righe')
    .onWrite(event => 
            {
            const righe = event.data.val();	
            var totalePezzi = 0.0;
			var totaleImporto = 0.0;
		    for(var propt in righe){
				 totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
	    		 totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
				}
			const totali  = {'pezzi' : totalePezzi, 'prezzoTotale' : totaleImporto.toFixed(2)}; 	
        	console.info("Aggiornati totali");
			return event.data.ref.parent.child('totali').set(totali);		
        	
			
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
/*          
exports.aggiornaRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{idBolla}/righe/{keyRiga}')
    .onWrite(event => 
            {
            const key = event.params.keyRiga;	
            //Caso riga cancellata....recupero dal passato valore EAN e chiave... e cancello la entry corrispondente 
         
            if (!event.data.exists()) 
                  {
                  const ean = event.data.previous.val().ean;
                  return event.data.ref.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+key).remove();	
                  }
            else 
            	  {
            	  const ean = event.data.val().ean;	
            	  const newVal = Object.assign(event.data.val(), {tipo: 'bolla', id: event.params.idBolla});
            	  return event.data.ref.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+key).set(newVal);
            	  }
               
            //Caso riga inserita o modificata... la sostituisco integralmente. A condizione che non mi cambi EAN.... 
            //Questa è una regola generale...
            
            }
           ); 
*/

//Nel caso delle vendite... TUTTO DA RISCRIVERE!!!!

exports.aggiornaRegistroDaVendite = functions.database.ref('{catena}/{negozio}/vendite/{idCassa}/{idScontrino}/righe/{keyRiga}')
    .onWrite(event => 
            {
            const key = event.params.keyRiga;	
            //Caso riga cancellata....recupero dal passato valore EAN e chiave... e cancello la entry corrispondente 
         
            if (!event.data.exists()) 
                  {
                  const ean = event.data.previous.val().ean;
                  return event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+key).remove();	
                  }
            else 
            	  {
            	  const ean = event.data.val().ean;	
            	  const cassa_scontrino = event.params.idCassa + "/" + event.params.idScontrino;
            	  const newVal = Object.assign(event.data.val(), {tipo: 'vendita', id: cassa_scontrino});
            	  return event.data.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+key).set(newVal);
            	  }
               
            //Caso riga inserita o modificata... la sostituisco integralmente. 
            
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
						if (righe[propt].tipo == "vendita")
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
    
