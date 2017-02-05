import Firebase from 'firebase';
import {prefissoNegozio} from './index';
import {calcolaTotaliSafe as calcolaTotaliScontrinoSafe} from './scontrini';
import {calcolaTotaliSafe as calcolaTotaliBollaSafe} from './bolle';
//Funzioni primitive
//Hanno in input un segmento di magazzino con un EAN
//e in output il medesimo segmento di magazzino modificato
//Sempre saggio ricontare i totali prima di salvare...

//Elimino uno stato per un certo item
//Se è uno stato "neutro" lo elimino e basta
//Se è positivo e ha un negativo... lo passo a orfano
//Se è negativo... lo elimino e basta
//Se non rimangono altri stati... elimino tutto l'item...

function elimina(magEntry, itemKey, statusKey)
{
var magEntryNew;
		if (magEntry === null) magEntryNew =  {};
    	else magEntryNew = {...magEntry};
        //Ho lo stato a disposizione?...
        if (magEntryNew['oggetti'] && magEntryNew['oggetti'][itemKey]['history'][statusKey]) 
            {
            //Raccolgo alcune info per capire in che situazione mi trovo...
            	
            var latestPos = magEntryNew['oggetti'][itemKey]['historyKeys'].length - 1;
            var latestKey = magEntryNew['oggetti'][itemKey]['historyKeys'][latestPos];
            var isOrfano = false;
            var isMagazzino = false; 
            var isLatest = false;
            var segno = magEntryNew['oggetti'][itemKey]['history'][statusKey]['segno'];
            var stato = magEntryNew['oggetti'][itemKey]['history'][statusKey]['stato'];
            var tobeDeleted = []; //Elenco di elementi dell'array historyKeys da cancellare...
            var tobeChanged = []; //Elenco di oggetti... posizione in historyKeys e modifica da apportare allo stato... prima cambio e poi cancello...
            var addMagazzino = null; //una riga da aggiungere a magazzino
            var removeMagazzino = null; //una riga da rimuovere da magazzino
            var addOrfano = null; //una riga da aggiungere a orfani
            var removeOrfano = null; //una riga da rimuovere da orfani
            var orfanoKey = null; //La riga orfano
	    var uscitaOrfanaKey = null; //La riga che genera l'orfano
            
            
            var newLatest = {}; //Ci metto il nuovo latest...
             if (statusKey == latestKey) isLatest = true;
             if (magEntryNew['oggetti'][itemKey]['history'][statusKey]['orfano']) isOrfano = true;
             if (magEntryNew['oggetti'][itemKey]['history'][statusKey]['inMagazzino']) isMagazzino = true;
             
             //Caso 1 Ingresso magazzino (segno +) in ultima posizione (non può essere orfano)
             if (isLatest && (segno == '+')) 
            	{
            		tobeDeleted.push({'pos': latestPos, 'key': latestKey});
            		//Il nuovo latest è quello che era in penultima posizione...se c'e' una penultima posizione...
            		if (latestPos > 0) 
            			newLatest = {...magEntryNew['oggetti'][itemKey]['history'][magEntryNew['oggetti'][itemKey]['historyKeys'][latestPos-1]]};
            		else newLatest = null; //Cancello tutto l'oggetto!
            		removeMagazzino = itemKey; //Scompare dal magazzino
          
            	}
            	
             if (isLatest && (segno == '-') && (isOrfano == false))
            	{
            		tobeDeleted.push({'pos': latestPos, 'key': latestKey});
            		//Il nuovo latest è quello che era in penultima posizione...se c'e' una penultima posizione...
            		if (latestPos > 0) newLatest = {...magEntryNew['oggetti'][itemKey]['history'][magEntryNew['oggetti'][itemKey]['historyKeys'][latestPos-1]]};
            		else newLatest = null; //Cancello tutto l'oggetto!
            		addMagazzino = itemKey; //Scompare dal magazzino
            	}	
            	
             if (isLatest && segno == '-' && (isOrfano == true))
            	{
            		tobeDeleted.push({'pos': latestPos, 'key': latestKey});
			orfanoKey = magEntryNew['oggetti'][itemKey]['historyKeys'][latestPos-1];
            		tobeDeleted.push({'pos': latestPos-1, 'key': orfanoKey});
            		//Il nuovo latest è quello che era in terzultima posizione...
            		if (latestPos > 1) newLatest = {...magEntryNew['oggetti'][itemKey]['history'][magEntryNew['oggetti'][itemKey]['historyKeys'][latestPos-2]]};
            		else newLatest = null; //Cancello tutto l'oggetto!
            		removeOrfano = {'statoOrfano': itemKey}; //Scompare dagli orfani...
            	}
            //Adesso mi gestisco i casi...
            
            //Rimozione da magazzino...
            	if(removeMagazzino) 
            		  {
            		  		for (var i = 0; i< magEntryNew['inMagazzino'].length; i++)
    	    				    	{
    	    				        if (magEntryNew['inMagazzino'][i] === removeMagazzino) 
    	    				        	{
    	    				        	  	magEntryNew['inMagazzino'].splice(i,1);
    	    				        	  	break;
    	    				        	}
    	    				    	}
            		  	    if ( magEntryNew['inMagazzino'].length == 0) delete(magEntryNew['inMagazzino']) ;
            		  }	
            		  
            //Aggiunta in magazzino...
               if(addMagazzino) 
            		{
            		if (!magEntryNew['inMagazzino']) magEntryNew['inMagazzino'] = [];
            		magEntryNew['inMagazzino'].push(addMagazzino);
            		}
            	
            //Rimozione da orfani...
            if(removeOrfano) 
            		  {
            		  		for (var i = 0; i< magEntryNew['orfani'].length; i++)
    	    				    	{
    	    				        if (magEntryNew['orfani'][i]['statoOrfano'] === removeOrfano['statoOrfano']) 
    	    				        	{
    	    				        	  	magEntryNew['orfani'].splice(i,1);
    	    				        	  	break;
    	    				        	}
    	    				    	}
            		  	    if (magEntryNew['orfani'].length) delete(magEntryNew['orfani']) ;
            		  }	
            	
            //Aggiunta in orfani...
            if(addOrfano) 
            		{
            		if (!magEntryNew['orfani']) magEntryNew['orfani'] = [];
            		magEntryNew['orfani'].push(addOrfano);
            		}
            
            //Modifico le righe che devono essere modificate...
            //DA IMPLEMENTARE...  				
            
            //Cancello le righe che devono essere cancellate...
            for (var i = 0; i< tobeDeleted.length; i++)
    	    {
    	    	delete (magEntryNew['oggetti'][itemKey]['history'][tobeDeleted[i]['kry']]); //Cancello gli stati che devo cancellare... 
		magEntryNew['oggetti'][itemKey]['historyKeys'].splice(tobeDeleted[i]['pos'],1); //Elimino dall'elenco
    	    }				
            
            //Se ho un nuovo stato lo applico...
            if (newLatest) 
            	{
            	magEntryNew['oggetti'][itemKey]['latest'] = {...newLatest};
                 // e aggiorno i totali
                 magEntryNew['totali'] = {'inMagazzino' : 0, 'orfani': 0}
    			if (magEntryNew['inMagazzino']) magEntryNew['totali']['inMagazzino'] = magEntryNew['inMagazzino'].length
    			if (magEntryNew['orfani']) magEntryNew['totali']['orfani'] = magEntryNew['orfani'].length
            	}
            //Altrimenti cancello tutto l'oggetto...
            else
            	{
            	 	delete magEntryNew['oggetti'][itemKey];
            	 	//e se non sono rimasti... cancello l'intero oggetto...
            	 	if (() => {for (var key in  magEntryNew['oggetti']) {return false;} return true}) magEntryNew = {} ;
            	}
         }
            
             
       else magEntryNew['anomalia'] =  true; //Forzo una modifica qualunque
            
 
    	   
    	   return(magEntryNew);
}

//Se il segno è +... cerco un orfano e lo copro
//Altrimenti aggiungo a un neutro
//Infine aggiungo un item
//Se il segno è -... cerco un segno + 
//Altrimenti creo un orfano + e appendo (anche qui... prima cerco un neutro)
//Tutto ciò che ho in valori lo aggiungo nello stato... 
//E' saggio non mettere nulla in testata...tranne le cose ovvie...
//Ritorno il magRef modificato e la chiave aggiunta (se ho generato orfani li gestirò diversamente)

function aggiungi(magRef, magEntry, segno, status, valoriTestata, valoriOggetto)
{
//Fai riferimento al wiki su github per l'analisi...
//In testata ho tre elenchi in forma di array
//"inMagazzino" che elenca gli oggetti in magazzino
//"Orfani" che elenca gli orfani
//"ordiniCliente" che elenca gli ordini cliente aperti
//"ordini" che elenca gli ordini aperti
//In generale uno stato appende allo stato precedente e viene memorizzata una copia dello stato nuovo col suo timestamp.
//Nello stato ci va... dataRef, timestamp e ref.
//valoriOggetto DEVE contenere
//riferimento, data, timestamp e poi i dati specifici p.es. riferimentoIngresso dataIngresso timestampIngresso, prezzoIngresso
//Lavoro sempre in update

//Questi tre devono esistere sempre...
var oggettoKey;
var statoKey;
var magEntryNew;
       
		if (magEntry === null) magEntryNew =  {...valoriTestata};
    	else magEntryNew = {...magEntry, ...valoriTestata};
    	if (!magEntryNew['oggetti']) magEntryNew['oggetti'] = {}; //Se non ho oggetti... a prescindere mi serviranno.
    	        		
	            		    	
	    
	         switch (segno)
	         {
	         //E' il caso di ordini cliente e ordini fornitore... 	
	         //Genera una riga nuova... senza utilizzare un oggetto già presente a magazzino (altrimenti lo darei direttamente...
	         //A meno che non ci sia un ordine cliente presente... in quel caso appendo l'ordine o viceversa...
	         case '':   
	         	        //Se è un ordine... cerco se ho un ordine cliente non impegnato... e lo impegno... 
	         	        if (status == "ORDINE") 
	         	        	{
	         	        		
	         	        	}
	         	        else if (status == "ORDINE_CLIENTE")	
	         	            {
	         	            	
	         	            	
	         	            	
	         	            }
	         	        
	         	        break;	
	         case '+':
	            		//Cerco un orfano...
	            		console.log(magEntryNew);
	            		if (magEntryNew['orfani'])
	            			{
	            		//Se trovo un orfano...lo rimpiazzo...
	            		    console.log("Trovato un orfano");
	            		    console.log(magEntryNew);
	            			 var oggettoKey = magEntryNew['orfani'][0]['oggettoOrfano'];
	            			 var statoKey = magEntryNew['orfani'][0]['statoOrfano'];
	            			 var statoUscita = magEntryNew['orfani'][0]['statoUscita'];
	            		     //E' un ex orfano...questa info la metto nello stato...
	            		     //Eseguo se ho abbastanza info dal database... altrimenti mando in vacca...
	            		     if ((magEntryNew.oggetti[oggettoKey]['history'][statoKey]) && (magEntryNew.oggetti[oggettoKey]['history'][statoUscita])) 
	            		    	{
	            		    		  console.log("Gestione corretta...");
	            		        delete (magEntryNew.oggetti[oggettoKey]['history'][statoKey]['orfano']);
	            		        delete (magEntryNew.oggetti[oggettoKey]['history'][statoUscita]['orfano']);
	            		    
	            		    	magEntryNew.oggetti[oggettoKey]['history'][statoKey]['eraOrfano'] = true;
	            		    	 //Aggiorno la riga che era a stato orfano...con tutte le info dell'ingresso
	            		        magEntryNew.oggetti[oggettoKey]['history'][statoKey] = {...magEntryNew.oggetti[oggettoKey]['history'][statoKey], 'segno': segno, 'stato': status, ...valoriOggetto};
	            		    	//Aggiorno la riga che aveva causato l'orfano...con un set di valori puntuali dell'ingresso
	            		    	magEntryNew.oggetti[oggettoKey]['history'][statoUscita]['prezzoListino'] = valoriOggetto['prezzoListino'];
	            		    	magEntryNew.oggetti[oggettoKey]['history'][statoUscita]['prezzoIngresso'] = valoriOggetto['prezzoIngresso'];
	            		    	magEntryNew.oggetti[oggettoKey]['history'][statoUscita]['riferimentoIngresso'] = valoriOggetto['riferimentoIngresso'];
	            		    	magEntryNew.oggetti[oggettoKey]['history'][statoUscita]['timestampIngresso'] = valoriOggetto['timestampIngresso'];
	            		    	magEntryNew.oggetti[oggettoKey]['history'][statoUscita]['dataIngresso'] = valoriOggetto['dataIngresso'];
	            		         
	            		    	//La "latest" è quest'ultima...
	            		    	magEntryNew.oggetti[oggettoKey]['latest'] = {...magEntryNew.oggetti[oggettoKey]['history'][statoUscita]};
	            		     
	            		    	//Elimino l'orfano dalla lista degli orfani e se è rimasto l'ultimo cancello l'array...
	            				if (magEntryNew['orfani'].length == 1) delete magEntryNew['orfani'];
	            				else  magEntryNew['orfani'].shift();
	            			
	            		    	}
	            		    else magEntryNew['anomalia'] =  true; //Forzo una modifica qualunque
	            			}	            			
	            	   else if (magEntryNew['ordiniCliente'])
	            	        {
	            	        //Da Implementare	
	            	        }
	            	   else if (magEntryNew['ordini'])
	            	        {
	            	        //Da implementare
	            	        }
	            	     else 
	            	        //Se arrivo qui devo creare un oggetto ex-novo
	            			{
	            				console.log("Nuovo ingresso");
	            			console.log(magEntryNew);	
	            			oggettoKey = magRef.push().key;
	            			statoKey = magRef.push().key; //Impuro ma me ne fotto
	            			if (!magEntryNew['inMagazzino']) magEntryNew['inMagazzino'] = []; 
	            			magEntryNew['inMagazzino'].push(oggettoKey);
	            			magEntryNew.oggetti[oggettoKey] = {'latest': {'inMagazzino': true, 'segno': segno, 'stato': status, ...valoriOggetto}};
	            			//Creo l'archivio...
	            			magEntryNew.oggetti[oggettoKey]['history'] = {};
	            			//Creo una copia dello stato attuale per archivio...
	            		       
    		    			magEntryNew.oggetti[oggettoKey]['history'][statoKey] = {...magEntryNew.oggetti[oggettoKey]['latest']};
    		    			//Salvo la chiave dell'ultimo stato in chiaro...
    		    			if (!magEntryNew.oggetti[oggettoKey]['historyKeys']) magEntryNew.oggetti[oggettoKey]['historyKeys'] = [];
    		    			magEntryNew.oggetti[oggettoKey]['historyKeys'].push(statoKey);
	            			}
	          break;
	          case '-':
	            	   //Cerco un oggetto a magazzino...
	            		if (magEntryNew['inMagazzino'])
	            		    {
	            		    	//Da inserire qui la gestione del libro ordinato che nom deve essere venduto... 
	            		    	oggettoKey = magEntryNew['inMagazzino'][0];
	            		    	statoKey = magRef.push().key; //Impuro ma me ne fotto
	            		        magEntryNew.oggetti[oggettoKey]['latest'] = {...magEntryNew.oggetti[oggettoKey]['latest'],  'segno': segno, 'stato': status, ...valoriOggetto};
	            		        delete magEntryNew.oggetti[oggettoKey]['latest']['inMagazzino'];
	            		        //L'oggetto non è più in magazzino
	            		        if (magEntryNew['inMagazzino'].length == 1) delete magEntryNew['inMagazzino'];
	            		        //Non ne ho più per quell EAN
	            			    else  magEntryNew['inMagazzino'].shift();
	            			  
	            		        //Creo una copia dello stato attuale per archivio...
	            		        magEntryNew.oggetti[oggettoKey]['history'][statoKey] = {...magEntryNew.oggetti[oggettoKey]['latest']};
	            				//Salvo la chiave dell'ultimo stato in chiaro...
    		    				if (!magEntryNew.oggetti[oggettoKey]['historyKeys']) magEntryNew.oggetti[oggettoKey]['historyKeys'] = [];
    		    		
    		    				magEntryNew.oggetti[oggettoKey]['historyKeys'].push(statoKey);
	            			
	            		    	
	            		    }
	            		//Altrimenti devo gestire un orfano...
				//Genero due righe in rapida sequenza... una per l'ingresso simulato e una per l'uscita...
	            		else {
	            		    
	            			oggettoKey = magRef.push().key;
	            			var orfanoKey = magRef.push().key; //Riga fittizia

					statoKey = magRef.push().key; //Riga corrispondente all'uscita
					if (!magEntryNew['orfani']) magEntryNew['orfani'] = []; 
	            //Salvo in un array le info sull'orfano per tornarci in seguito
				//Salvo sia lo stato orfano che quello che ha causato l'orfananza...
	            			magEntryNew['orfani'].push({'oggettoOrfano': oggettoKey, 'statoOrfano': orfanoKey, 'statoUscita': statoKey}); 
	            //Una riga sintetica per l'orfano...	
					magEntryNew.oggetti[oggettoKey]={'history': {}};
					magEntryNew.oggetti[oggettoKey]['latest'] = {...magEntryNew.oggetti[oggettoKey]['latest'],  'segno': '+', 'stato': 'ORFANO', 'orfano': true, 'timestamp': valoriOggetto['timestamp']};
	            		//Che storicizzo...
	        			magEntryNew.oggetti[oggettoKey]['history'][orfanoKey] = {...magEntryNew.oggetti[oggettoKey]['latest']};
	            		
				//Mi riporto al caso base...	 
					magEntryNew.oggetti[oggettoKey]['latest'] = {...magEntryNew.oggetti[oggettoKey]['latest'],  'segno': segno, 'stato': status, ...valoriOggetto};
	            		//Storicizzo anche questo...        
		            		 magEntryNew.oggetti[oggettoKey]['history'][statoKey] = {...magEntryNew.oggetti[oggettoKey]['latest']};
						//Salvo la chiave dell'ultimo stato in chiaro...
    		    			if (!magEntryNew.oggetti[oggettoKey]['historyKeys']) magEntryNew.oggetti[oggettoKey]['historyKeys'] = [];
    		    		
    		    			magEntryNew.oggetti[oggettoKey]['historyKeys'].push(statoKey);
	            			
	            		    }
	           
	         break;
	         default:
	         //Per il momento non gestisco righe relative a ordini e ordini cliente...
	         }
            
    		magEntryNew['totali'] = {'inMagazzino' : 0, 'orfani': 0}
    		if (magEntryNew['inMagazzino']) magEntryNew['totali']['inMagazzino'] = magEntryNew['inMagazzino'].length
    		if (magEntryNew['orfani']) magEntryNew['totali']['orfani'] = magEntryNew['orfani'].length
      	return ({'magEntry': magEntryNew, 'oggettoKey': oggettoKey, 'statoKey': statoKey});
}

export function aggiungiRigheScontrinoMagazzino(cassaId, scontrinoId,valori, rigaScontrinoRef, update) {
	  var infoTestata = {'titolo': valori.titolo, 'autore': valori.autore, 'prezzoListino': valori.prezzoListino};
      return function(dispatch,getState) {
      var magCodRef = Firebase.database().ref(prefissoNegozio(getState) +'magazzino/' + valori.ean );
     var magOggettiArray = [];
     var result;
      var magEntryUpdated;
     magCodRef.transaction((magEntry) => 
    	{
    	 magOggettiArray = [];
    	 magEntryUpdated = {...magEntry};
    	 		//Devo appendere a magEntry tutte le righe che mi servono...
    		var totEntry = parseInt(valori.pezzi);
    		if (totEntry > 0) //Vendita
    		{   
    	    var date = new Date(); //Per ora...
    		
    		var infoOggetto = {'prezzoListino': valori.prezzoListino, 
    						   'prezzoUscita': valori.prezzoUnitario, 
    			                'riferimento': 'vendite/' + cassaId + '/' + scontrinoId + '/'+ rigaScontrinoRef.key,
    			                'riferimentoUscita': 'vendite/' + cassaId + '/' + scontrinoId + '/'+ rigaScontrinoRef.key,
    			                'timestamp': Firebase.database.ServerValue.TIMESTAMP,
    			                'timestampUscita': Firebase.database.ServerValue.TIMESTAMP,
    			                'data': date.getTime(),//Per ora...
    			                'dataUscita': date.getTime() //Per ora
    						   }; 
    	  		for (var i=0; i<totEntry; i++)
	    		{ 	
	    		
	    		  	result = aggiungi(magCodRef, magEntryUpdated, '-', 'VENDITA', infoTestata, infoOggetto);
	    		  	magEntryUpdated = result['magEntry'];
	    		  	magOggettiArray.push({'oggettoKey': result['oggettoKey'], 'statoKey': result['statoKey']});
	    		  	
	    		}	
    			
    		}
    		else //Resa cliente
    		{
	    		var infoOggetto = {'prezzoListino': valori.prezzoListino, 'prezzoAcquisto': valori.prezzoUnitario};
	    		for (var i=0; i<totEntry; i++)
	    		{ 	
	    			
	    		  	result = aggiungi(magCodRef, magEntryUpdated, '+', 'RESO_CLIENTE', infoTestata, infoOggetto);
	    		  		magEntryUpdated = result['magEntry'];
	    		  	magOggettiArray.push({'oggettoKey': result['oggettoKey'], 'statoKey': result['statoKey']});
	    		}
    		}
       	return (magEntryUpdated);	
    	},
     //Qui inserisco la funzione di callback che viene chiamata quando la transazione finisce
     (error, completed) => 
        {
        //Eseguo solo se la transazione viene eseguita
	if (completed)
		{
	        var nuovaRigaScontrino = {...valori};
	        nuovaRigaScontrino['listaOggetti'] = magOggettiArray;
	        //nuovaRigaScontrino['listaOggetti'] = magazzinoList;
            if (update)
            	{
            	rigaScontrinoRef.update(nuovaRigaScontrino).then(
		    	response => 
					{
                		dispatch(calcolaTotaliScontrinoSafe(cassaId, scontrinoId));	  
					})		
            	}
            else 
            	{
            	rigaScontrinoRef.set(nuovaRigaScontrino).then(
		    	response => 
					{
                		dispatch(calcolaTotaliScontrinoSafe(cassaId, scontrinoId));	  
					})
            	}	
        	}
        }	
        );
  
   }
}

export function aggiungiRigheBollaMagazzino(bolla,valori, rigaBollaRef, update) {
	  var infoTestata = {'titolo': valori.titolo, 'autore': valori.autore, 'prezzoListino': valori.prezzoListino};
      return function(dispatch,getState) {
     var magCodRef = Firebase.database().ref(prefissoNegozio(getState) +'magazzino/' + valori.ean );
     var magOggettiArray = [];
     var result;
     var magEntryUpdated;
     magCodRef.transaction((magEntry) => 
    	{
    	 magOggettiArray = [];
    	 magEntryUpdated = {...magEntry};	
    		//Devo appendere a magEntry tutte le righe che mi servono...
    		var totEntry = parseInt(valori.pezzi) + parseInt(valori.gratis);
    		var date = new Date(); //Per ora...
    		
    		var infoOggetto = {'prezzoListino': valori.prezzoListino, 
    						   'prezzoIngresso': valori.prezzoUnitario, 
    			                'riferimento': 'bolle/' + bolla + '/' + rigaBollaRef.key,
    			                'riferimentoIngresso': 'bolle/' + bolla + '/' + rigaBollaRef.key,
    			                'timestamp': Firebase.database.ServerValue.TIMESTAMP,
    			                'timestampIngresso': Firebase.database.ServerValue.TIMESTAMP,
    			                'data': date.getTime(),//Per ora...
    			                'dataIngresso': date.getTime() //Per ora
    						   }; 
    		
    		for (var i=0; i<totEntry; i++)
    		{ 	
    			if (i>=valori.pezzi) infoOggetto['prezzoIngresso'] = 0.00;
    		  	result = aggiungi(magCodRef, magEntryUpdated, '+', 'BOLLA', infoTestata, infoOggetto);
    		  	magEntryUpdated = result['magEntry'];
    		  	magOggettiArray.push({'oggettoKey': result['oggettoKey'], 'statoKey': result['statoKey']});
    		}
    		
       	return (magEntryUpdated);	
    	},
     //Qui inserisco la funzione di callback che viene chiamata quando la transazione finisce
     (error, completed) => 
        {
        //Eseguo solo se la transazione viene eseguita
	if (completed)
		{
	        var nuovaRigaBolla = {...valori};
	        nuovaRigaBolla['listaOggetti'] = magOggettiArray;
	        //nuovaRigaScontrino['listaOggetti'] = magazzinoList;
	        if (update)
            	{
            	rigaBollaRef.update(nuovaRigaBolla).then(
				  response => 
					{
                		dispatch(calcolaTotaliBollaSafe(bolla));	  
					})
            	}
            else	
        		{
                rigaBollaRef.set(nuovaRigaBolla).then(
				  response => 
					{
                		dispatch(calcolaTotaliBollaSafe(bolla));	  
					})
        		}	
        	}
        }	
        );
  

      }     
}

//Cancello tutti gli oggetti che corrispondono alla riga della bolla che sto cancellando
//Va implementata pesantemente...METTERE A POSTO...

export function eliminaRigheMagazzino(ean,oggettiDaCancellare, rigaDaCancellare, tipoDoc, refDoc) {
  	console.log("uccidi!");
			console.log(rigaDaCancellare);
			
  return function(dispatch,getState) {
     var magCodRef = Firebase.database().ref(prefissoNegozio(getState) +'magazzino/' + ean );
     magCodRef.transaction((magEntry) => 
    	{ 
    		if (magEntry)  
    		
    		{
    	  	
    		var magEntryNew = {...magEntry}
    		for  (var i=0; i < oggettiDaCancellare.length; i++)
    			{
    		    magEntryNew = elimina(magEntryNew, oggettiDaCancellare[i]['oggettoKey'], oggettiDaCancellare[i]['statoKey']);
      			}	
    		}	
    	   else var magEntryNew = {};
       	return (magEntryNew);	
    	},
     //Qui inserisco la funzione di callback che viene chiamata quando la transazione finisce
     (error, completed) => 
        {
        //Eseguo solo se la transazione viene eseguita e se ho qualcosa da cancellare...
		if (completed && rigaDaCancellare)
			{
			Firebase.database().ref(rigaDaCancellare).remove().then(response => {
				if (tipoDoc == 'bolla')
				{
				dispatch(calcolaTotaliBollaSafe(refDoc['bolla']));
				}
				if (tipoDoc == 'scontrino')
				{
				dispatch(calcolaTotaliScontrinoSafe(refDoc['cassa'],refDoc['scontrino']));
				}
				
				
			})	
			}
    	}
    	)
  }
} 
