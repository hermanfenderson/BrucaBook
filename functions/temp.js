
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
//res.send('Passed.');    							 
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
    								admin.database().ref(urlDest).update({'serieIncassi': serieIncassi, 'serieIncassiMesi': serieIncassiMesi, 'serieIncassiAnni': serieIncassiAnni, 'top5thisYear': top5thisYear, 'top5lastYear': top5lastYear,  'top5lastMonth': top5lastMonth, 'createdAt': admin.database.ServerValue.TIMESTAMP }).then(
    									() => {
    										  console.log("report calcolati");
    										  res.send('Passed.');    							 
    										  }
    									);	
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
			return(elencoLibrerieRef.once("value").then(function(snapshot)
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
				}));
				
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
			return(eanDetailsRef.once("value").then(function(snapshot)
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
				}));
			}
			);
			
exports.calcolaTotaleCassa = functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{prefixId}/{id}/totali')
    .onWrite((change, context) => {return(calcolaTotali(change, context, 'elencoCasse'))});
   

exports.calcolaTotaleScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{prefixId}/{id}/{idItem}')
    .onWrite((change, context) =>  {return(calcolaTotali(change, context, 'elencoScontrini'))});
          
exports.calcolaTotaleBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{id}/{idItem}')
    .onWrite((change, context) =>  {return(calcolaTotali(change, context, 'elencoBolle'))});
     
exports.calcolaTotaleResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{id}/{idItem}')
    .onWrite((change, context) =>  {return(calcolaTotali(change, context, 'elencoRese'))});
       
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
//Due strategie differenti... la prima è full
//Ragiono sulla singola riga modificata sempre...
//algoritmo full
//Qualsiasi sia la riga cambiata.... calcolo i totali per somma di tutto ciò che c'e' in registroEAN/ean 
//Mi metto in transaction su registroEAN/ean
//Calcolo il totale e lo persisto con una set dentro la transazione su magazzino. Salvo in ogni caso l'esito del calcolo del totale...
//Salvo anche la differenza "originale" (il delta)
//Per lo storico magazzino... opero così
//Mi metto in transazione su storicoMagazzino
//Determinata la data alla quale è cambiato il totale...
//Se la data è nuova... Mi faccio una copia dello stato alla data immediatamente precedente (empty se è la prima data).
//Da quella data alla fine del registro applico il delta.
//algoritmo delta
//Mi metto in transaction su magazzino/EAN e applico direttamente il delta.
//Aggiornamento storico magazzino è identico...
//Il problema emptyAfter lo risolvo dopo...
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
	return(totalePezzi);
}

exports.correggiMagazzino = functions.database.ref('{catena}/{negozio}/magazzino/{ean}')
    .onWrite((change, context) => 
            {
              const ean = context.params.ean;	
              const pezzi = change.after.val() ? change.after.val().pezzi : 0;	
          	  return(
          	  		change.after.parent.parent.child("registroEAN").child(ean).once("value").then(
          	  			function(snapshot) 
          	  				{
          	  				 let registro = snapshot.val();
          	  				 let truePezzi = calcolaPezzi(registro, null);
          	  				 if (trueTotali === totali) return(console.info("Totale verificato "+ ean));
          	  				 else change.after.update({pezzi: truePezzi}).then(() => {console.info("Totale corretto "+ ean)});
          	  				}
          	  			)
 
            });	



exports.aggiornaMagazzino = functions.database.ref('{catena}/{negozio}/registroEAN/{ean}/{data}/{key}')
    .onWrite((change, context) => 
            {
            const ean = context.params.ean;	
            const data = context.params.data;
            const key = context.params.key;
            const refBookStoreRadix = change.after.ref.parent.parent.parent.parent;
            
            const value = change.after.val();	//Loop dalla prima all'ultima data...
            const oldValue = change.before.val(); //Prendo il dato precedente
             return (aggiornaMagazzinoEANDiff(ean, refBookStoreRadix, getValues(value,oldValue), getDiff(value, oldValue)));
            });
            
exports.aggiornaStoricoMagazzino = functions.database.ref('{catena}/{negozio}/registroEAN/{ean}/{data}/{key}')
    .onWrite((change, context) => 
            {
            const ean = context.params.ean;	
            const data = context.params.data;
            const key = context.params.key;
            const refBookStoreRadix = change.after.ref.parent.parent.parent.parent;
            
            const value = change.after.val();	//Loop dalla prima all'ultima data...
            const oldValue = change.before.val(); //Prendo il dato precedente
             return (aggiornaStoricoMagazzinoEANDiff(ean, refBookStoreRadix, data, getValues(value,oldValue), getDiff(value, oldValue)));
            });
            
const aggiornaMagazzinoEANDiff = (ean, refRadix, values, diff) =>
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
		})).then(()=>{console.info('aggiornato EAN '+ean);})
}

const aggiornaStoricoMagazzinoEANDiff = (ean, refRadix, dataChange, values, diff) =>
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
	    for (data in storicoMagazzino)
	    	{
	    	if (data >= dataChange)
	    		{
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
		})).then(()=>{console.info('aggiornato storico magazzino EAN '+ean);})

		
		
/*
return(refRadix.child('storicoMagazzino').child(data).transaction(function(stockData) {
		return(
			//Devo chiamare una promise che prende il valore dell'ultima data utile...
			//In essa faccio le modifiche a quel record e lo passo come return della promise...
			refRadix.child('storicoMagazzino').orderByKey().endAt(data).limitToLast(1).once("value").then(
					function(snapshot)
						{   
							let lastStockData = snapshot.val() ? snapshot.val() : {};
							let pezzi = lastStockData[ean] ? lastStockData[ean].pezzi : 0;
							let stockEAN = {};
							stockEAN.pezzi = pezzi + diff;
							stockEAN.autore = values.autore;
							stockEAN.imgFirebaseUrl = values.imgFirebaseUrl;
							stockEAN.prezzoListino = values.prezzoListino;
							stockEAN.createdAt = admin.database.ServerValue.TIMESTAMP;
							lastStockData[ean] = stockEAN;
							return(lastStockData);
						}
					)
			);    
		})).then(()=>{console.info('aggiornato storico magazzino EAN '+ean);})
*/

}




/*
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
*/

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
                  let lastDate = Object.keys(oldDate)[0]; //L'ultima data
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


