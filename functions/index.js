
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

//Modo "paraculo"... devo ragionare se crea problemi in transazione    
exports.calcolaTotaleBolla = functions.database.ref('{catena}/{negozio}/bolle/{idBolla}/righe')
    .onWrite(event => 
            {
            const righe = event.data.val();
        	var totalePezzi = 0.0;
			var totaleGratis = 0.0;
			var totaleImporto = 0.0;
		  	for(var propt in righe)
		  		{
			    totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
			    totaleGratis =  parseInt(righe[propt].gratis) + totaleGratis;
			    totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
				}
			const totali = {'pezzi' : totalePezzi, 'gratis' : totaleGratis, 'prezzoTotale' : totaleImporto.toFixed(2)}; 
			console.info("Aggiornati totali");
			return event.data.ref.parent.child('totali').set(totali);	
			
    		}
           ); 
           
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
//Il registro è organizzato per catena -> Negozio -> EAN -> keyDocumento che origina il valore...

//Nel caso delle bolle...  

exports.aggiornaRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{idBolla}/righe/{keyRiga}')
    .onWrite(event => 
            {
            const key = event.params.keyRiga;	
            //Caso riga cancellata....recupero dal passato valore EAN e chiave... e cancello la entry corrispondente 
         
            if (!event.data.exists()) 
                  {
                  const ean = event.data.previous.val().ean;
                  return event.data.ref.parent.parent.parent.parent.child('registro/'+ean+'/'+key).remove();	
                  }
            else 
            	  {
            	  const ean = event.data.val().ean;	
            	  const newVal = Object.assign(event.data.val(), {tipo: 'bolla', id: event.params.idBolla});
            	  return event.data.ref.parent.parent.parent.parent.child('registro/'+ean+'/'+key).set(newVal);
            	  }
               
            //Caso riga inserita o modificata... la sostituisco integralmente. A condizione che non mi cambi EAN.... 
            //Questa è una regola generale...
            
            }
           ); 
//Nel caso delle vendite...

exports.aggiornaRegistroDaVendite = functions.database.ref('{catena}/{negozio}/vendite/{idCassa}/{idScontrino}/righe/{keyRiga}')
    .onWrite(event => 
            {
            const key = event.params.keyRiga;	
            //Caso riga cancellata....recupero dal passato valore EAN e chiave... e cancello la entry corrispondente 
         
            if (!event.data.exists()) 
                  {
                  const ean = event.data.previous.val().ean;
                  return event.data.ref.parent.parent.parent.parent.parent.child('registro/'+ean+'/'+key).remove();	
                  }
            else 
            	  {
            	  const ean = event.data.val().ean;	
            	  const cassa_scontrino = event.params.idCassa + "/" + event.params.idScontrino;
            	  const newVal = Object.assign(event.data.val(), {tipo: 'vendita', id: cassa_scontrino});
            	  return event.data.ref.parent.parent.parent.parent.parent.child('registro/'+ean+'/'+key).set(newVal);
            	  }
               
            //Caso riga inserita o modificata... la sostituisco integralmente. 
            
            }
           ); 


exports.aggiornaMagazzino = functions.database.ref('{catena}/{negozio}/registro/{ean}')
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
    
//Questa resta una traccia per utilizzare adminSDK e scrivere con una transazione... come dire TUTTO IL CUCUZZARO...
/*
exports.calcolaTotaleBollaCorreggere = functions.database.ref('{catena}/{negozio}/bolle/{idBolla}/righe')
    .onWrite(event => {
    	const righe = event.data.val();
    	const bollaRefPath = event.params.catena + "/" + event.params.negozio + "/bolle/" + event.params.idBolla; 
        var bollaRef = admin.database().ref(bollaRefPath);
        bollaRef.transaction(function(bolla) {
 			if (bolla)
			{
			var totalePezzi = 0.0;
			var totaleGratis = 0.0;
			var totaleImporto = 0.0;
		  	var righe = bolla['righe'];
		  	for(var propt in righe)
		  		{
			    totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
			    totaleGratis =  parseInt(righe[propt].gratis) + totaleGratis;
			    totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
				}
			bolla['totali']  = {'pezzi' : totalePezzi, 'gratis' : totaleGratis, 'prezzoTotale' : totaleImporto.toFixed(2)}; 
			console.log(bolla['totali']);
    		return (bolla);
			}
    		else 
    		{
		        var bollaReset = {'totali' : {'pezzi' : 0, 'gratis' : 0, 'prezzoTotale' : 0}};
		        return (bollaReset);
	    	} 
		  },function(){},false);
		  
    	return event.data.ref; //Nessuna modifica
    }); 
    
    */
   
