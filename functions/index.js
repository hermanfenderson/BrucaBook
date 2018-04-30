
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const {purge, aggiornaRegistro, update, calcolaTotali} = require('./generic');
const {generateTop5thisYear, generateTop5lastYear, generateTop5lastMonth, getMatrixVenditeFromRegistroData,generateSerieIncassi, generateSerieIncassiMesi,generateSerieIncassiAnni } = require('./report');
const equal = require('deep-equal');
const cors = require('cors')({origin: true});

admin.initializeApp();

exports.report = functions.https.onRequest((req, res) => {
cors(req, res, () => {
let catena = req.query.catena;
let libreria = req.query.libreria;
let urlSource = catena + '/' + libreria + '/registroData'
let urlDest = catena + '/' + libreria + '/report/bulk';
res.send('Passed.');    							 
admin.database().ref(urlSource).once("value").then(function(snapshot)
								{ 	let year = moment().format('YYYY');
    								let lastYear = (parseInt(year,10) -1).toString(10);
    								let lastMonthArray = moment().subtract(1, 'months').format('YYYY/MM').split('/');
      								let matrixVendite = getMatrixVenditeFromRegistroData(snapshot.val());
									let serieIncassi = generateSerieIncassi(matrixVendite);
    								let serieIncassiMesi = generateSerieIncassiMesi(matrixVendite);
    								let serieIncassiAnni = generateSerieIncassiAnni(matrixVendite);
    								let top5thisYear = generateTop5thisYear(matrixVendite, year);
    								let top5lastYear = generateTop5lastYear(matrixVendite, lastYear);
    								let top5lastMonth = generateTop5lastMonth(matrixVendite, lastMonthArray);
    								admin.database().ref(urlDest).update({'serieIncassi': serieIncassi, 'serieIncassiMesi': serieIncassiMesi, 'serieIncassiAnni': serieIncassiAnni, 'top5thisYear': top5thisYear, 'top5lastYear': top5lastYear,  'top5lastMonth': top5lastMonth, 'createdAt': admin.database.ServerValue.TIMESTAMP });	
								})
	});
});

exports.aggiornaDaCatalogo = functions.database.ref('/catalogo/{ean}')
//DA MODIFICARE 
   .onUpdate((change, context) =>
			{
			const ean = context.params.ean;
			let newCatalogEntry = change.after.val();
			//
			let elencoLibrerieRef = change.after.ref.parent.parent.child('librerie').child('elencoLibrerie');
			elencoLibrerieRef.once("value").then(function(snapshot)
				{
				let elencoLibrerie = snapshot.val();
				for (var catena in elencoLibrerie)
					{
						for (var libreria in elencoLibrerie[catena].librerie)
							{
								//Per ciascuna libreria vedo se ho nel catalogo la riga... e se esiste la aggiorno...
								let catalogoLocaleRef = change.after.ref.parent.parent.child(catena).child(libreria).child('catalogo').child(ean);
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

   .onUpdate((change,context) =>
			{
			const ean = context.params.ean;
			const eanDetailsRef =  change.after.ref.parent.parent.child('registroEAN').child(ean);
			const catena = context.params.catena;
			const negozio = context.params.negozio;
			let newCatalogEntry = change.after.val();
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
								let refRiga = change.after.ref.parent.parent.child(path);
								refRiga.update(newCatalogEntry);
							}
					}
				});
			return true;	
			}
			);
			
exports.calcolaTotaleCassa = functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{prefixId}/{id}/totali')
    .onWrite((change, context) => {return(calcolaTotali(change, context, 'elencoCasse'))});
   /*
            {
             const cassa = context.params.idCassa;
             const anno = context.params.anno;
             const mese = context.params.mese;
			 var key = context.params.idScontrino;	
			 if (change.after.val() && change.after.val().lastActionKey) key = change.after.val().lastActionKey;
		  //Come prima cosa determino cosa è cambiato...
           //POi calcolo i totali...
            const righeRef = change.after.ref.parent.parent;
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
											  
							 const ref = change.after.ref.parent.parent.parent.parent.parent.parent.child('elencoCasse').child(anno).child(mese).child(cassa);
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
*/

exports.calcolaTotaleScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{prefixId}/{id}/{idItem}')
    .onWrite((change, context) =>  {return(calcolaTotali(change, context, 'elencoScontrini'))});
           /*
            {
             //Da riscrivere....
             const key = context.params.idScontrino;	
             const cassa = context.params.idCassa;
             const anno = context.params.anno;
             const mese = context.params.mese;
			 const idItem = context.params.idItem;
            var righeSnapshot = change;
            
            const refScontrino = change.after.ref.parent;
              	
            refScontrino.transaction(function(righe) {
            	    var totalePezzi = 0.0;
					var totaleImporto = 0.0;
	
            	   	for(var propt in righe)
		    			{
		    			totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
	    				totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
		    			}
		    		const totali = {'pezzi' : totalePezzi, 
						'prezzoTotale' : totaleImporto.toFixed(2), lastActionKey : idItem}; 
					const ref = change.after.ref.parent.parent.parent.parent.parent.parent.child('elencoScontrini').child(anno).child(mese).child(cassa).child(key);
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
		    		return righe;
					});
            
        
           return true;	      
                }	
        	   
           );
          */ 

//Modo "paraculo"... devo ragionare se crea problemi in transazione    
//Aggiungo una info ai totali per determinare se ho un valore aggiornato da far vedere all'utente...

exports.calcolaTotaleBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{id}/{idItem}')
    .onWrite((change, context) =>  {return(calcolaTotali(change, context, 'elencoBolle'))});
      /*   
            {
             const key = context.params.idBolla;	
             const anno = context.params.anno;
             const mese = context.params.mese;
			
            var righeSnapshot = change;
            var idItem = null;	
           	
            const righe = change.after.val();
            
        	var totalePezzi = 0.0;
			var totaleGratis = 0.0;
			var totaleImporto = 0.0;
		  	for(let propt in righe)
		  		{
		  		let newObj = righeSnapshot.after.child(propt).val();
		  		let oldObj = righeSnapshot.before.child(propt).val();
		  		if (!equal(newObj, oldObj)) idItem = propt; //Prendo la riga cambiata...	
		  		totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
			    totaleGratis =  parseInt(righe[propt].gratis) + totaleGratis;
			    totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
				}
			//Se non la ho....  è una riga cancellata...
			if (!idItem)
				{
				var oldRighe=righeSnapshot.before.val();
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
			const ref = change.after.ref.parent.parent.parent.parent.child('elencoBolle').child(anno).child(mese).child(key);
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
           */
exports.calcolaTotaleResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{id}/{idItem}')
    .onWrite((change, context) =>  {return(calcolaTotali(change, context, 'elencoRese'))});
       /*
            {
             const key = context.params.idResa;	
             const anno = context.params.anno;
             const mese = context.params.mese;
			
            var righeSnapshot = change;
            var idItem = null;	
           	
            const righe = change.after.val();
            
        	var totalePezzi = 0.0;
			var totaleGratis = 0.0;
			var totaleImporto = 0.0;
		  	for(let propt in righe)
		  		{
		  		let newObj = righeSnapshot.after.child(propt).val();
		  		let oldObj = righeSnapshot.before.child(propt).val();
		  		if (!equal(newObj, oldObj)) idItem = propt; //Prendo la riga cambiata...	
		  			
		  		totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
			    totaleGratis =  parseInt(righe[propt].gratis) + totaleGratis;
			    totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
				}
			//Se non la ho....  è una riga cancellata...
			if (!idItem)
				{
				var oldRighe=righeSnapshot.before.val();
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
			const ref = change.after.ref.parent.parent.parent.parent.child('elencoRese').child(anno).child(mese).child(key);
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
  */
  

//Cancello tutti i figli di una bolla...se l'ho cancellata dall'elenco. Chiedo prima conferma ovviamente...

exports.purgeBolla =  functions.database.ref('{catena}/{negozio}/elencoBolle/{anno}/{mese}/{id}')
    .onDelete((snap, context) => {return(purge(snap,context,'bolle'))});
           
exports.purgeResa =  functions.database.ref('{catena}/{negozio}/elencoRese/{anno}/{mese}/{id}')
    .onDelete((snap, context) => {return(purge(snap,context,'rese'))});
           
exports.purgeScontrino =  functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{prefixId}/{id}')
    .onDelete((snap, context) => {return(purge(snap,context,'scontrini'))});  
  
exports.purgeCassa =  functions.database.ref('{catena}/{negozio}/elencoCasse/{anno}/{mese}/{id}')
    .onDelete((snap, context) => {return(purge(snap,context,'elencoscontrini'))});  
  
exports.purgeInventario =  functions.database.ref('{catena}/{negozio}/elencoInventari/{id}')
	.onDelete((snap, context) => {return(purge(snap,context,'inventari'))}); 


//Salvo la nuova data nelle righe già presenti...
exports.updateBolla =  functions.database.ref('{catena}/{negozio}/elencoBolle/{anno}/{mese}/{id}')
    .onUpdate((change, context) => {return(update(change,context,'bolle'))});
          
 //Salvo la nuova data nelle righe già presenti...
exports.updateResa =  functions.database.ref('{catena}/{negozio}/elencoRese/{anno}/{mese}/{id}')
    .onUpdate((change, context) => {return(update(change,context,'rese'))});
           
 exports.updateScontrino =  functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{prefixId}/{id}')
    .onUpdate((change, context) => {return(update(change,context,'scontrini'))});
           
              
     
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

exports.inserisciRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{id}/{keyRiga}')
    .onCreate((snap, context) => {return(aggiornaRegistro(snap,context,'inserisci','bolle'))});

exports.modificaRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{id}/{keyRiga}')
    .onUpdate((change, context) => {return(aggiornaRegistro(change,context,'modifica','bolle'))});

exports.eliminaRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{id}/{keyRiga}')
    .onDelete((snap, context) => {return(aggiornaRegistro(snap,context,'elimina','bolle'))});

//Nel caso delle rese...  

exports.inserisciRegistroDaResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{id}/{keyRiga}')
    .onCreate((snap, context) => {return(aggiornaRegistro(snap,context,'inserisci','rese'))});

exports.modificaRegistroDaResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{id}/{keyRiga}')
    .onUpdate((change,context) => {return(aggiornaRegistro(change,context,'modifica','rese'))});
    		

exports.eliminaRegistroDaResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{id}/{keyRiga}')
    .onDelete((snap, context) => {return(aggiornaRegistro(snap,context,'elimina','rese'))});

//Nel caso degli scontrini...  

exports.inserisciRegistroDaScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{prefixId}/{id}/{keyRiga}')
    .onCreate((snap, context) => {return(aggiornaRegistro(snap,context,'inserisci','scontrini'))});

exports.modificaRegistroDaScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{prefixId}/{id}/{keyRiga}')
    .onUpdate((change, context) => {return(aggiornaRegistro(change,context,'modifica','scontrini'))});

exports.eliminaRegistroDaScontrini = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{prefixId}/{id}/{keyRiga}')
    .onDelete((snap, context) => {return(aggiornaRegistro(snap,context,'elimina','scontrini'))});
          

//Nel caso dell'inventario
exports.inserisciRegistroDaInventario = functions.database.ref('{catena}/{negozio}/inventari/{id}/{keyRiga}')
    .onCreate((snap, context) => {return(aggiornaRegistro(snap,context,'inserisci','inventari'))});

exports.modificaRegistroDaInventario = functions.database.ref('{catena}/{negozio}/inventari/{id}/{keyRiga}')
    .onUpdate((change, context) => {return(aggiornaRegistro(change,context,'modifica','inventari'))});
    
exports.eliminaRegistroDaInventario = functions.database.ref('{catena}/{negozio}/inventari/{id}/{keyRiga}')
    .onDelete((snap, context) => {return(aggiornaRegistro(snap,context,'elimina','inventari'))});

//Da modificare per storicizzarla e prevedere una full... 
exports.aggiornaMagazzino = functions.database.ref('{catena}/{negozio}/registroEAN/{ean}')
    .onWrite((change, context) => 
            {
            const ean = context.params.ean;	
            const refBookStoreRadix = change.after.ref.parent.parent;
            const date = change.after.val();	//Loop dalla prima all'ultima data...
            const oldDate = change.before.val(); //Prendo il dato precedente
            const emptyAfter = !change.after.exists();
            return (aggiornaMagazzinoEAN(ean, refBookStoreRadix, date, oldDate, emptyAfter));
            });
            
exports.forzaAggiornaMagazzino = functions.https.onRequest((req, res) => {

cors(req, res, () => {
let catena = req.query.catena;
let libreria = req.query.libreria;
let refBookStoreRadix = admin.database().ref(catena + '/' + libreria);
res.send('Passed.');    							 
refBookStoreRadix.child('registroEAN').once("value").then(function(snapshot)
								{
								if (snapshot.val())
									{
									for (let ean in snapshot.val()) 
										{
											aggiornaMagazzinoEAN(ean, refBookStoreRadix, snapshot.val()[ean], null, false); //forzo l'aggiornamento massivo...
									
											
										}		
									}
								})
  
});
});          

const aggiornaMagazzinoEAN = (ean, refBookStoreRadix, date, oldDate, emptyAfter) =>
{

            //Caso riga cancellata....cancello semplicemente EAN ... e cancello la entry corrispondente 
            if (emptyAfter) 
                  {
                  let lastDate = Object.keys(change.before.val())[0]; //L'ultima data
                  //refBookStoreRadix.child('storicoMagazzino/'+lastDate+'/'+ean).remove();
                  //Qui aggiungere cancellazione per righe successive....
                  refBookStoreRadix.child('dateStoricoMagazzino/').orderByKey().startAt(lastDate).once("value").then(function(snapshot)
            				{
            				 for (let dateLoop in snapshot.val()) refBookStoreRadix.child('storicoMagazzino/'+dateLoop+'/'+ean).remove();
 
            				})
                  return refBookStoreRadix.child('magazzino/'+ean).remove();	
                  }
            else 
            	  {
            	  var totalePezzi = 0;
        		  var righe;
        		 // date = change.after.val();	//Loop dalla prima all'ultima data...
            	 // oldDate = change.before.val(); //Prendo il dato precedente
            	  var changed = false; //Da quando scopro che e' cambiato...mi va sempre bene...
            	  for(var propt2 in date)
		  		   	{
		  		   	righe = date[propt2];
		  		   	oldRighe = oldDate ? oldDate[propt2] : null
		  		   	changed = (changed || !equal(oldRighe, righe));
		  		   
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
						 //Se e' cambiato per una specifica data aggiorno il suo storico	
				
		  			 if (changed )
		  				{
		  				
		  				let totali = {'pezzi' : totalePezzi, 'titolo' : righe[propt].titolo, 'autore' : righe[propt].autore, 'prezzoListino' : righe[propt].prezzoListino, 'imgFirebaseUrl': righe[propt].imgFirebaseUrl, 'createdAt' : admin.database.ServerValue.TIMESTAMP } ; 
            			refBookStoreRadix.child('storicoMagazzino/'+propt2+'/'+ean).set(totali);
            			let dataStorico = {};
            			dataStorico = {'createdAt': admin.database.ServerValue.TIMESTAMP};
            			refBookStoreRadix.child('dateStoricoMagazzino/'+propt2).set(dataStorico);
            			// Qui ci va qualcosa di complicato....una copia di tutti gli ean fino a questa data...non ho altra strada...
            			let date2 = propt2;
            			refBookStoreRadix.child('storicoMagazzino/').orderByKey().endAt(date2).once("value").then(function(snapshot)
            				{
            					let eans = {};
            					let storico = snapshot.val();
            					for (date in storico)
            						for (ean in storico[date])
            							{
            								eans[ean] = storico[date][ean];
            								eans[ean].createdAt = admin.database.ServerValue.TIMESTAMP;
            							}
            				refBookStoreRadix.child('storicoMagazzino/'+date2).set(eans); //Tutti gli ean... compresi gli ultimo....			
            				});
		  				}
		  		     }	
			      //Inserito un timestamp qui...
			      const totali = {'pezzi' : totalePezzi, 'titolo' : righe[propt].titolo, 'autore' : righe[propt].autore, 'prezzoListino' : righe[propt].prezzoListino, 'imgFirebaseUrl': righe[propt].imgFirebaseUrl, 'createdAt': admin.database.ServerValue.TIMESTAMP } ; 
            	  
            	  return refBookStoreRadix.child('magazzino/'+ean).set(totali);
            	  }
               
            //Caso riga inserita o modificata... la sostituisco integralmente. 
            return true;	
            };
    
