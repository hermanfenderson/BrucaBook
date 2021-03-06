
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const {purge, aggiornaRegistro, update, calcolaTotaliNew} = require('./generic');
const {deletedRigaOrdine, deletedRiga} = require('./ordini');
const {createClient,getProductId, updateProduct, createProduct} = require('./shopify');


const {aggiornaMagazzinoEANFull, creaMagazzinoDaCatalogo} = require('./magazzino');
//const GraphqlClient = require('./GraphqlClient');

const {generateTop5thisYear, generateTop5lastYear, generateTop5lastMonth, getMatrixVenditeFromRegistroData,generateSerieIncassi, generateSerieIncassiMesi,generateSerieIncassiAnni } = require('./report');
//const equal = require('deep-equal');
const cors = require('cors')({origin: true});

admin.initializeApp();

exports.report = functions.https.onRequest((req, res) => {
cors(req, res, () => {
let catena = req.query.catena;
let libreria = req.query.libreria;
let urlSource = catena + '/' + libreria + '/registroData'
let urlDest = catena + '/' + libreria + '/report/bulk';
//res.send('Passed.');    							 
return(admin.database().ref(urlSource).once("value").then(function(snapshot)
								{ 	let year = moment().format('YYYY');
    								let lastYear = (parseInt(year,10) -1).toString(10);
    								let lastMonthArray = moment().subtract(1, 'months').format('YYYY/MM').split('/');
      								let matrixVendite = getMatrixVenditeFromRegistroData(snapshot.val());
									let serieIncassi = generateSerieIncassi(matrixVendite);
									console.log(serieIncassi);
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
								}));
	});
});
//RISCRITTA... COSI' NON MI CANCELLA IL VALORE DI STOCK
exports.aggiornaDaCatalogo = functions.database.ref('/catalogo/{ean}')
//Modificato... propago su tutti anche quelli che non lo avevano... 
   .onUpdate((change, context) =>
			{
			const ean = context.params.ean;
			let newCatalogEntry = change.after.val();
	let elencoLibrerieRef = change.after.ref.parent.parent.child('librerie').child('elencoLibrerie');
			return(elencoLibrerieRef.once("value").then(function(snapshot)
				{
					let promises = [];
			//
				let elencoLibrerie = snapshot.val();
				for (var catena in elencoLibrerie)
					for (var libreria in elencoLibrerie[catena].librerie) promises.push(change.after.ref.parent.parent.child(catena).child(libreria).child('magazzino').child(ean).update(newCatalogEntry));
					
					//updates[catena+'/'+libreria+'/catalogo/'+ean] = newCatalogEntry;
				//change.after.ref.parent.parent.update(updates).then(()=>{console.info("Aggiornati cataloghi locali per codice "+ean)});	
				//Così è una update...
				Promise.all(promises).then(()=>{console.info("Aggiornati cataloghi locali per codice "+ean)});	
					
				}));
			}
			);

//Da catalogo locale alle righe di bolle, scontrini, ecc...DISABILITO E RAGIONO DIVERSAMENTE...
/*
exports.aggiornaDaCatalogoLocale = functions.database.ref('{catena}/{negozio}/catalogo/{ean}')

   .onUpdate((change,context) =>
			{
			const ean = context.params.ean;
			const eanDetailsRef =  change.after.ref.parent.parent.child('registroEAN').child(ean);
			let newCatalogEntry = change.after.val();
			let updates = {};
		
			//Non aggiorno il prezzo di listino!
			newCatalogEntry.prezzoListinoUltimo = newCatalogEntry.prezzoListino;
			delete newCatalogEntry.prezzoListino;
			return(eanDetailsRef.once("value").then(function(snapshot)
				{
				let dettagliEAN = snapshot.val();
				//console.log(dettagliEAN);
				for (var date in dettagliEAN)
					{
						for (var riga in dettagliEAN[date])
							{
								let path =  dettagliEAN[date][riga].tipo + '/' +   dettagliEAN[date][riga].id + '/' + riga;
								change.after.ref.parent.parent.child(path).update(newCatalogEntry);
								updates[path] = newCatalogEntry;
							}
					}
			//	console.log(newCatalogEntry);
			//	change.after.ref.parent.parent.child(path)
			//	change.after.ref.parent.parent.update(updates).then(()=>{console.info("Aggiornate righe per modifiche catalogo locale per codice "+ean)});	
			console.info("Aggiornate righe per modifiche catalogo locale per codice "+ean);
				}));
			}
			);
			
*/
//ANCHE QUESTA NON SERVE PIU'... 
/*
exports.creaMagazzinoDaCatalogoLocale = functions.database.ref('{catena}/{negozio}/catalogo/{ean}')

   .onCreate((snapshot,context) =>
			{
			const ean = context.params.ean;
			const totaleEAN = snapshot.val(); 
			const refRadix = snapshot.ref.parent.parent;
			return(creaMagazzinoDaCatalogo(admin, ean, refRadix, totaleEAN));
			});
			
			
*/


			
exports.calcolaTotaleCassa = functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{id}')
    .onWrite((change, context) => {return(calcolaTotaliNew(change, context, 'elencoCasse'))});
   

exports.calcolaTotaleScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{prefixId}/{id}')
    .onWrite((change, context) =>  {return(calcolaTotaliNew(change, context, 'elencoScontrini'))});
          
exports.calcolaTotaleBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{id}')
    .onWrite((change, context) =>  {return(calcolaTotaliNew(change, context, 'elencoBolle'))});
     
exports.calcolaTotaleResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{id}')
    .onWrite((change, context) =>  {return(calcolaTotaliNew(change, context, 'elencoRese'))});

exports.calcolaTotaleOrdine = functions.database.ref('{catena}/{negozio}/ordini/{cliente}/{id}')
    .onWrite((change, context) =>  {return(calcolaTotaliNew(change, context, 'elencoOrdini'))});

//Chiusura ordine...se ha tutte le righe consegnate
exports.chiudiOrdine = functions.database.ref('{catena}/{negozio}/ordini/{cliente}/{id}/{idItem}')
    .onWrite((change, context) =>  {
     var key = context.params.id;	
            const refParent = change.after.ref.parent;
            return(refParent.once("value")
					.then(function(snapshot) {
				  	let righe = snapshot.val();
        			var len = 0;
            	    var stato = (righe===null || Object.keys(righe).length === 0) ? 'A': 'C';
            	    console.info(righe);
					for(var propt in righe)
		    			{
		    			if (righe[propt].stato !== 'Z') stato = 'A';
		    			}
		    	    ref = change.after.ref.parent.parent.parent.parent.child('elencoOrdini').child(context.params.cliente).child(key);
		    	    ref.once("value")
								.then(function(snapshot) {
									var notEmpty = snapshot.hasChildren(); 
				    				if (notEmpty) 
				    					{
				    				     var dataChiusura = (stato ==='C') ? moment().format("L") : null;
		   	       						console.info("stato "+stato);
		   	       						ref.update({stato: stato, dataChiusura: dataChiusura}).then(console.info("aggiornato stato ordine "+key )); 
		   	       						return(stato);
				    					}	
				    				else return false;		
				    				  });
				    				 })
		   	      );
    });
					
       
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

exports.purgeOrdine =  functions.database.ref('{catena}/{negozio}/elencoOrdini/{cliente}/{id}')
    .onDelete((snap, context) => {return(purge(snap,context,'ordini'))});
    
exports.purgeCliente =  functions.database.ref('{catena}/{negozio}/anagrafiche/clienti/{id}')
    .onDelete((snap, context) => {return(purge(snap,context,'clienti'))});    

//Vado a ripulire anche scontrini e bolle...
exports.deletedRigaOrdineSideEffectBolla =  functions.database.ref('{catena}/{negozio}/ordini/{cliente}/{ordine}/{id}')
    .onDelete((snap, context) => {
    	             let path = snap.val().bolla
    	             if (path) return(deletedRigaOrdine(snap,context,"bolle",path));
    	             else return null;
    });
    
exports.deletedRigaOrdineSideEffectScontrino =  functions.database.ref('{catena}/{negozio}/ordini/{cliente}/{ordine}/{id}')
    .onDelete((snap, context) => {
    	let path = snap.val().scontrino;
    	if (path) return(deletedRigaOrdine(snap,context,"scontrini", path));
    	else return null;
    });


//Salvo la nuova data nelle righe già presenti...
exports.updateBolla =  functions.database.ref('{catena}/{negozio}/elencoBolle/{anno}/{mese}/{id}')
    .onUpdate((change, context) => {return(update(change,context,'bolle'))});
          
 //Salvo la nuova data nelle righe già presenti...
exports.updateResa =  functions.database.ref('{catena}/{negozio}/elencoRese/{anno}/{mese}/{id}')
    .onUpdate((change, context) => {return(update(change,context,'rese'))});
           
 exports.updateScontrino =  functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{prefixId}/{id}')
    .onUpdate((change, context) => {return(update(change,context,'scontrini'))});
    
    
    
exports.eliminaOrdineDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{id}/{keyRiga}')
    .onDelete((snap, context) => {
    	
    							if (snap.val().ordini) return(deletedRiga(admin, snap, context, snap.val().ordini,'bolle'));
    							else return(null);
    							});

exports.eliminaOrdineDaScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{prefixId}/{id}/{keyRiga}')
    .onDelete((snap, context) => {
    							if (snap.val().ordini) return(deletedRiga(admin, snap, context, snap.val().ordini,'scontrini'));
    							else return(null);
    });

    

    
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




exports.aggiornaMagazzinoNew = functions.database.ref('{catena}/{negozio}/registroEAN/{ean}')
    .onWrite((change, context) => 
            {
            const ean = context.params.ean;	
            const refBookStoreRadix = change.after.ref.parent.parent;
            return (aggiornaMagazzinoEANFull(admin, ean, refBookStoreRadix, change.after.val() ));
            //return (aggiornaMagazzinoFull(admin, refBookStoreRadix));
            
            });

/* OBSOLETA...
exports.forzaAggiornaMagazzino = functions.https.onRequest((req, res) => {

cors(req, res, () => {
			
						
let catena = req.query.catena;
let libreria = req.query.libreria;
let refBookStoreRadix = admin.database().ref(catena + '/' + libreria);
 aggiornaMagazzinoFull(admin,refBookStoreRadix).then(function (result) {
                res.status(200).send();
            })
            .catch(function (err) {
                console.error(err);
                res.status(501).send();
            });
	});
});



*/

exports.aggiornaOrdiniAperti = functions.database.ref('{catena}/{negozio}/ordini/{cliente}/{id}/{idItem}')
    .onWrite((change, context) => 
            {
            let idItem = context.params.idItem;
            //Caso inserimento o aggiornamento... se ho lo stato after non in 'Z' ho un ordine aperto...e semplicemente lo aggiorno...
            if (change.after.val())
            {
            	if (change.after.val().stato !== 'Z') return (change.after.ref.parent.parent.parent.parent.child("ordiniAperti").child(idItem).update(change.after.val()).then(console.info("Aggiornata riga ordine aperto "+idItem)));
            	// E' in stato Z... e non era in stato Z prima...
            	else if (change.before.val() && change.before.val().stato !=='Z') return (change.after.ref.parent.parent.parent.parent.child("ordiniAperti").child(idItem).remove().then(console.info("Chiusa riga ordine aperto "+idItem)));
            }
            else //Se ho cancellato una riga che era in stato aperto... cancello anche la riga ordine aperto corrispondente...
            {
                if (change.before.val() && change.before.val().stato !=='Z') return (change.after.ref.parent.parent.parent.parent.child("ordiniAperti").child(idItem).remove().then(console.info("Cancellata riga ordine aperto "+idItem)));
            }
            });	



exports.forzaAggiornaTitoli = functions.https.onRequest((req, res) => {

cors(req, res, () => {
let catena = req.query.catena;
let libreria = req.query.libreria;
let refBookStoreRadix = admin.database().ref(catena + '/' + libreria);



let updates = {}; //Qui devo azzerare EAN e prima data in cui appare...	
let promise = refBookStoreRadix.child('registroEAN').once("value").then(function(snapshot)
								{
								if (snapshot.val())
									{
									let records = snapshot.val();
									let eans = Object.keys(records);
									//let values = Object.values(records);
									eans.forEach(
										(ean) => {
										//console.log(records[ean]);
										let record = records[ean];
										let firstDateRecord = record[Object.keys(record)[0]];
										let firstKeyRecord = firstDateRecord[Object.keys(firstDateRecord)[0]];
										//console.log(firstKeyRecord);
										updates['magazzino/'+ean+'/titolo'] = firstKeyRecord.titolo;
										updates['magazzino/'+ean+'/editore'] = firstKeyRecord.editore ? firstKeyRecord.editore : 'nd';
										
										})
								    console.log(updates);
							
										
									}
								
								
								return(refBookStoreRadix.update(updates));
								
								
								
									
								});
return(promise.then(() => {res.send('Passed.');console.info("avviato aggiornamento titoli")}));
});  
});


exports.aggiornaCatalogoShopify = functions.database.ref('{catena}/{negozio}/magazzino/{ean}')
    .onWrite((change, context) => 
            {
            let ean = context.params.ean;
            let negozio = context.params.negozio;
            //Verifico se per il negozio ho una chiave api shopify
            let shopifyApiRef = change.after.ref.parent.parent.parent.parent.child('librerie').child('shopify').child(negozio);
			return(shopifyApiRef.once("value").then(function(snapshot)
				{
				let shopifyApi = snapshot.val();
			     if (!shopifyApi) {console.info("shopify non configurato"); return(null);}
               
				if (ean.substr(0,3)!=="978") {console.info(ean + "non è un libro"); return(null);}
				let productData = change.after.val();
                									 
				if (productData.ean === ean) //Altrimenti non faccio nulla
                	{
                	let token = shopifyApi.token;
                	let uri = shopifyApi.uri;
                	let location = shopifyApi.location;
                	let channels = shopifyApi.channels;
                	console.log("contenuto channels web "+  channels.web);
                	console.info("Trovata chiave shopify " + token);
                	let client = createClient(token,uri);
                	
                	console.info("creato Client " + client);
                	
                	return(
                	//Verifico se l'oggetto esiste già
                		
                		getProductId(client,ean).then(response => 
                										 {
                									 	 //let id = (response.data.productByHandle && response.data.productByHandle.id) ? response.data.productByHandle.id : null;
                									 	 let id = (response.data && response.data.productByHandle) ? response.data.productByHandle.id : null;
                									 	 console.log(id);
                									 	 let variant = (response.data && response.data.productByHandle && response.data.productByHandle.id) ? response.data.productByHandle.variants : null;
                									 	 let variantId = variant ? variant.edges[0].node.id : null;
                									 	 console.log(variantId);
                									 		 //Se il prodotto non esiste vado in insert 
                									 	 if (id===null) createProduct(client, productData, location).then(
                									 	 					response => {
                									 	 						        if (response.data.productCreate && response.data.productCreate.errors && response.data.productCreate.errors.length > 0) console.error(response.data.productCreate.errors);
                									 	 								else console.log("creato prodotto per EAN: "+ean)
                									 	 								}
                									 	 					);
                									 	 else updateProduct(client, productData, location, id, variantId).then(
                									 	 					response => {
                									 	 								if (response.data.productUpdate && response.data.productUpdate.errors && response.data.productUpdate.errors.length > 0) console.error(response.data.productUpdate.errors);
                									 	 							
                									 	 								console.log("aggiornato prodotto per EAN: "+ean);
                									 	 								}
                									 	 					)
                										 }
                									 )
                	
                	
                	     );
                	}
					
				}));
			}
			);

            /*
            //Caso inserimento o aggiornamento... se ho lo stato after non in 'Z' ho un ordine aperto...e semplicemente lo aggiorno...
            if (change.after.val())
            {
            	if (change.after.val().stato !== 'Z') return (change.after.ref.parent.parent.parent.parent.child("ordiniAperti").child(idItem).update(change.after.val()).then(console.info("Aggiornata riga ordine aperto "+idItem)));
            	// E' in stato Z... e non era in stato Z prima...
            	else if (change.before.val() && change.before.val().stato !=='Z') return (change.after.ref.parent.parent.parent.parent.child("ordiniAperti").child(idItem).remove().then(console.info("Chiusa riga ordine aperto "+idItem)));
            }
            else //Se ho cancellato una riga che era in stato aperto... cancello anche la riga ordine aperto corrispondente...
            {
                if (change.before.val() && change.before.val().stato !=='Z') return (change.after.ref.parent.parent.parent.parent.child("ordiniAperti").child(idItem).remove().then(console.info("Cancellata riga ordine aperto "+idItem)));
            }
            */
            //});	


