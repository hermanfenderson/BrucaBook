
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('firebase-admin');


const moment = require('moment');

const {generateTop5thisYear} = require('./report');
const {generateTop5lastYear} = require('./report');
const {generateTop5lastMonth} = require('./report');

const {getMatrixVenditeFromRegistroData} = require('./report');
const {generateSerieIncassi} = require('./report');
const {generateSerieIncassiMesi} = require('./report');
const {generateSerieIncassiAnni} = require('./report');


function areEqualShallow(a, b) {
    if (a===b) return true;
    if ((!a && b) || (!b && a)) return false;
    for(let key in a) {
        if(!(key in b) || a[key] !== b[key]) {
            return false;
        }
    }
    for(let key in b) {
        if(!(key in a) || a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}



// The Firebase Admin SDK to access the Firebase Realtime Database. 
//const admin = require('firebase-admin');

//admin.initializeApp();

//admin.initializeApp(functions.config().firebase);

//Da catalogo generale a catalogo locale...


admin.initializeApp();
/*
exports.sample = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.send('Passed.');
  });
});
*/
const cors = require('cors')({origin: true});


exports.report = functions.https.onRequest((req, res) => {

cors(req, res, () => {
let catena = req.query.catena;
let libreria = req.query.libreria;

 let urlSource = catena + '/' + libreria + '/registroData'
 let urlDest = catena + '/' + libreria + '/report/bulk';
 admin.database().ref(urlDest).remove();
  res.send('Passed.');    							 
  /*
  res.send(`<!doctype html>
    <head>
      <title>Report</title>
    </head>
    <body>
      OK
    </body>
  </html>`);
  */
  
  
 admin.database().ref(urlSource).once("value").then(function(snapshot)
								{   let year = moment().format('YYYY');
    								let lastYear = (parseInt(year,10) -1).toString(10);
    								let lastMonthArray = moment().subtract(1, 'months').format('YYYY/MM').split('/');
      
									let matrixVendite = getMatrixVenditeFromRegistroData(snapshot.val());
									let serieIncassi = generateSerieIncassi(matrixVendite);
    								let serieIncassiMesi = generateSerieIncassiMesi(matrixVendite);
    								let serieIncassiAnni = generateSerieIncassiAnni(matrixVendite);
    								let top5thisYear = generateTop5thisYear(matrixVendite, year);
    								let top5lastYear = generateTop5lastYear(matrixVendite, lastYear);
    								let top5lastMonth = generateTop5lastMonth(matrixVendite, lastMonthArray);
    							
    							
    								admin.database().ref(urlDest).update({'serieIncassi': serieIncassi, 'serieIncassiMesi': serieIncassiMesi, 'serieIncassiAnni': serieIncassiAnni, 'top5thisYear': top5thisYear, 'top5lastYear': top5lastYear,  'top5lastMonth': top5lastMonth });	
									

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
			
exports.calcolaTotaleCassa = functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{idCassa}/{idScontrino}/totali')
    .onWrite((change, context) => 
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

exports.calcolaTotaleScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}/{idItem}')
    .onWrite((change, context) => 
            {
             //Da riscrivere....
             const key = context.params.idScontrino;	
             const cassa = context.params.idCassa;
             const anno = context.params.anno;
             const mese = context.params.mese;
			 const idItem = context.params.idItem;
            var righeSnapshot = change;
            
            const refScontrino = change.after.ref.parent;
            var totalePezzi = 0.0;
			var totaleImporto = 0.0;
		  	
            refScontrino.transaction(function(righe) {
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

//Modo "paraculo"... devo ragionare se crea problemi in transazione    
//Aggiungo una info ai totali per determinare se ho un valore aggiornato da far vedere all'utente...

exports.calcolaTotaleBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{idBolla}')
    .onWrite((change, context) => 
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
		  		if (!areEqualShallow(newObj, oldObj)) idItem = propt; //Prendo la riga cambiata...	
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
           
exports.calcolaTotaleResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{idResa}')
    .onWrite((change, context) => 
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
		  		if (!areEqualShallow(newObj, oldObj)) idItem = propt; //Prendo la riga cambiata...	
		  			
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
                      

//Cancello tutti i figli di una bolla...se l'ho cancellata dall'elenco. Chiedo prima conferma ovviamente...

exports.purgeBolla =  functions.database.ref('{catena}/{negozio}/elencoBolle/{anno}/{mese}/{idBolla}')
    .onDelete((snap, context) => 
            {
            const key = context.params.idBolla;
                const anno = context.params.anno;
             const mese = context.params.mese;
		
            
			console.info("Cancello bolla "+key);
			return snap.ref.parent.parent.parent.parent.child('bolle').child(anno).child(mese).child(key).remove();
    		}
           );
           
exports.purgeResa =  functions.database.ref('{catena}/{negozio}/elencoRese/{anno}/{mese}/{idResa}')
    .onDelete((snap,context) => 
            {
            const key = context.params.idResa;
                const anno = context.params.anno;
             const mese = context.params.mese;
		
            
			console.info("Cancello resa "+key);
			return snap.ref.parent.parent.parent.parent.child('rese').child(anno).child(mese).child(key).remove();
    		}
           );      
           
//Idem per gli scontrini...

exports.purgeScontrino =  functions.database.ref('{catena}/{negozio}/elencoScontrini/{anno}/{mese}/{idCassa}/{idScontrino}')
    .onDelete((snap,context) => 
            {
            const key = context.params.idScontrino;
            const cassa = context.params.idCassa;
                const anno = context.params.anno;
             const mese = context.params.mese;
		
            
			console.info("Cancello scontrino "+key);
			return snap.ref.parent.parent.parent.parent.parent.child('scontrini').child(anno).child(mese).child(cassa).child(key).remove();
    		}
           );

//Idem per le casse... cancello solo elencoScontrini che propaga l'effetto...
exports.purgeCassa =  functions.database.ref('{catena}/{negozio}/elencoCasse/{anno}/{mese}/{idCassa}')
    .onDelete((snap, context) => 
            {
            const cassa = context.params.idCassa;
                const anno = context.params.anno;
             const mese = context.params.mese;
		
            
			console.info("Cancello cassa "+cassa);
			return snap.ref.parent.parent.parent.parent.child('elencoScontrini').child(anno).child(mese).child(cassa).remove();
    		}
           );

exports.purgeInventario =  functions.database.ref('{catena}/{negozio}/elencoInventari/{idInventario}')
    .onDelete((snap,context) => 
            {
            const inventario = context.params.idInventario;
            
			console.info("Cancello inventario "+inventario);
			return snap.ref.parent.parent.child('inventari').child(inventario).remove();
    		}
           );


//Salvo la nuova data nelle righe già presenti...
exports.updateBolla =  functions.database.ref('{catena}/{negozio}/elencoBolle/{anno}/{mese}/{idBolla}')
    .onUpdate((change, context) => 
            {
            let oldTot = change.before.child('totali');
            let newTot = change.after.child('totali');
            
            if (!areEqualShallow(oldTot, newTot)) //Per discernere cambiamenti genuini in testata
              {
	            const key = context.params.idBolla;	
	            const anno = context.params.anno;
	            const mese = context.params.mese;
	            var values = Object.assign({}, change.after.val());
			    delete values.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
			    delete values.createdBy;
			    delete values.createdAt;
			    delete values.changedBy;
			    delete values.changedAt;
			    delete values.key;
			    values.data = values.dataCarico;
				console.info("Aggiorno bolla "+key);
				const ref = change.after.ref.parent.parent.parent.parent.child('bolle').child(anno).child(mese).child(key);
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
    .onUpdate((change, context) => 
            {
             let oldTot = change.before.child('totali');
            let newTot = change.after.child('totali');
            
            if (!areEqualShallow(oldTot, newTot)) //Per discernere cambiamenti genuini in testata
             {
	            const key = context.params.idResa;	
	            const anno = context.params.anno;
	            const mese = context.params.mese;
	            var values = Object.assign({}, change.after.val());
			    delete values.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
			    delete values.createdBy;
			    delete values.createdAt;
			    delete values.changedBy;
			    delete values.changedAt;
			    delete values.key;
			    values.data = values.dataCarico;
				console.info("Aggiorno bolla "+key);
				const ref = change.after.ref.parent.parent.parent.parent.child('rese').child(anno).child(mese).child(key);
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
    .onUpdate((change, context) => 
            {
             let oldTot = change.before.child('totali');
            let newTot = change.after.child('totali');
            let oldSconto = change.before.child('sconto').val();
            let newSconto = change.after.child('sconto').val();
            
            if (!areEqualShallow(oldTot, newTot)) //Per discernere cambiamenti genuini in testata
            {	
	            const key = context.params.idScontrino;	
	            const anno = context.params.anno;
	            const mese = context.params.mese;
	            const cassa = context.params.idCassa;
			    var values = Object.assign({}, change.after.val());
			    delete values.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
			    delete values.createdBy;
			    delete values.createdAt;
			    delete values.changedBy;
			    delete values.changedAt;
			    delete values.key;
			    delete values.sconto; //Non devo persistere lo sconto se non è cambiato...
			    values.data = values.dataCassa;
				console.info("Aggiorno scontrino "+key);
				const ref = change.after.ref.parent.parent.parent.parent.parent.child('scontrini').child(anno).child(mese).child(cassa).child(key);
				ref.once('value', function(snapshot) {
					snapshot.forEach(function(childSnapshot) 
						{
						/* PASSATO SUL FRONT-END	
					    delete values.sconto;
					    delete values.prezzoUnitario;
					    delete values.prezzoTotale;
						if (newSconto !== oldSconto && !childSnapshot.val().manSconto) //Modifico solo le righe con manSconto falso
							{
								let prezzoListino = childSnapshot.val().prezzoListino;
								let pezzi = childSnapshot.val().pezzi;
								
								let prezzoUnitario = ((1 - newSconto/100) * prezzoListino).toFixed(2);
								let prezzoTotale = (pezzi * prezzoUnitario).toFixed(2);
								values.sconto = newSconto;
								values.prezzoUnitario = prezzoUnitario;
								values.prezzoTotale = prezzoTotale;
							}
						*/	
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
    .onCreate((snap, context) =>
    		{   const key =  context.params.keyRiga;
    			const ean = snap.val().ean;	
    			const data = snap.val().data;
            	const newVal = Object.assign(snap.val(), {tipo: 'bolle', id: context.params.anno + '/'+ context.params.mese + '/'+context.params.idBolla});
                snap.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
                 snap.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		
    		 return true;		
    		}
         
          ); 

exports.modificaRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{idBolla}/{keyRiga}')
    .onUpdate((change, context) =>
    		{
    			const key =context.params.keyRiga;
    			const ean = change.after.val().ean;	
    			const oldData = change.before.val().data;
    			const data = change.after.val().data;
            	const newVal = Object.assign(change.after.val(), {tipo: 'bolle', id:  context.params.anno + '/'+ context.params.mese + '/'+ context.params.idBolla});
//Se è cambiata la data devo cancellare la vecchia riga...
                if (oldData !== data) 
                	{
                	change.after.ref.parent.parent.parent.parent.parent.child('registroData/'+oldData+'/'+key).remove();
                	change.after.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+oldData+'/'+key).remove();
                		
                	}
                change.after.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
      
                change.after.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    	  return true;	
    		}
          ); 

exports.eliminaRegistroDaBolla = functions.database.ref('{catena}/{negozio}/bolle/{anno}/{mese}/{idBolla}/{keyRiga}')
    .onDelete((snap, context) =>
    		{
    			const key = context.params.keyRiga;
    			const ean = snap.val().ean;	
    			const data = snap.val().data;
    			snap.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).remove();
                snap.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).remove();
    	  return true;	
    		}
          ); 

//Nel caso delle rese...  

exports.inserisciRegistroDaResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{idResa}/{keyRiga}')
    .onCreate((snap, context) =>
    		{
    			const key =  context.params.keyRiga;
    			const ean = snap.val().ean;	
    			const data = snap.val().data;
            	const newVal = Object.assign(snap.val(), {tipo: 'rese', id: context.params.anno + '/'+ context.params.mese + '/'+context.params.idResa});
                snap.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
                 snap.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		return true;	
    			
    		}
          ); 

exports.modificaRegistroDaResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{idResa}/{keyRiga}')
    .onUpdate((change,context) =>
    		{
    			const key =context.params.keyRiga;
    			const ean = change.after.val().ean;	
    			const oldData = change.before.val().data;
    			const data = change.after.val().data;
            	const newVal = Object.assign(change.after.val(), {tipo: 'rese', id:  context.params.anno + '/'+ context.params.mese + '/'+ context.params.idResa});
//Se è cambiata la data devo cancellare la vecchia riga...
                if (oldData !== data) 
                	{
                	change.after.ref.parent.parent.parent.parent.parent.child('registroData/'+oldData+'/'+key).remove();
                	change.after.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+oldData+'/'+key).remove();
                		
                	}
                change.after.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
      
                change.after.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		return true;	
    			
    		}
          ); 

exports.eliminaRegistroDaResa = functions.database.ref('{catena}/{negozio}/rese/{anno}/{mese}/{idResa}/{keyRiga}')
    .onDelete((snap, context) =>
    		{
    			const key = context.params.keyRiga;
    			const ean = snap.val().ean;	
    			const data = snap.val().data;
    			snap.ref.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).remove();
                snap.ref.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).remove();
    	return true;	
    		}
          ); 

//Nel caso degli scontrini...  

exports.inserisciRegistroDaScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}/{keyRiga}')
    .onCreate((snap, context) =>
    		{
    			const key = context.params.keyRiga;
    			const ean = snap.val().ean;	
    			const data = snap.val().data;
            	const newVal = Object.assign(snap.val(), {tipo: 'scontrini', id: context.params.anno + '/'+ context.params.mese + '/'+context.params.idCassa + '/'+context.params.idScontrino});
                snap.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
                 snap.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    	return true;	
    		}
          ); 

exports.modificaRegistroDaScontrino = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}/{keyRiga}')
    .onUpdate((change, context) =>
    		{
    			const key =context.params.keyRiga;
    			const ean = change.after.val().ean;	
    			const oldData = change.before.val().data;
    			const data = change.after.val().data;
            	const newVal = Object.assign(change.after.val(), {tipo: 'scontrini', id:  context.params.anno + '/'+ context.params.mese + '/'+context.params.idCassa + '/'+context.params.idScontrino});
                //Se è cambiata la data devo cancellare la vecchia riga...
                console.log(newVal);
                if (oldData !== data) 
                	{
                	change.after.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+oldData+'/'+key).remove();
                	change.after.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+oldData+'/'+key).remove();
                		
                	}
                change.after.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
      
                change.after.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		return true;	
    			
    		}
          ); 

exports.eliminaRegistroDaScontrini = functions.database.ref('{catena}/{negozio}/scontrini/{anno}/{mese}/{idCassa}/{idScontrino}/{keyRiga}')
    .onDelete((snap, context) =>
    		{
    			const key = context.params.keyRiga;
    			const ean = snap.val().ean;	
    			const data = snap.val().data;
    			snap.ref.parent.parent.parent.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).remove();
                snap.ref.parent.parent.parent.parent.parent.parent.child('registroData/'+data+'/'+key).remove();
    		
    		return true;		
    		}
          ); 
          

//Nel caso dell'inventario
exports.inserisciRegistroDaInventario = functions.database.ref('{catena}/{negozio}/inventari/{idInventario}/{keyRiga}')
    .onCreate((snap, context) =>
    		{
    			const key =  context.params.keyRiga; //Corrisponde a EAN...
    			const ean = snap.val().ean;	
    			const data = snap.val().data;
            	const newVal = Object.assign(snap.val(), {tipo: 'inventari', id: context.params.idInventario});
                snap.ref.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
                snap.ref.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
    		
    		return true;		
    		}
          ); 

exports.modificaRegistroDaInventario = functions.database.ref('{catena}/{negozio}/inventari/{idInventario}/{keyRiga}')
    .onUpdate((change, context) =>
    		{
    			const key = context.params.keyRiga;
    			const ean = change.after.val().ean;	
    			const oldData = change.before.val().data;
    			const data = change.after.val().data;
            	const newVal = Object.assign(change.after.val(), {tipo: 'inventari', id:  context.params.idInventario});
                 //Se è cambiata la data devo cancellare la vecchia riga...
                if (oldData !== data) 
                	{
                	change.after.ref.parent.parent.parent.child('registroData/'+oldData+'/'+key).remove();
                	change.after.ref.parent.parent.parent.child('registroEAN/'+ean+'/'+oldData+'/'+key).remove();
          		
                	}
                change.after.ref.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).set(newVal);
      
                change.after.ref.parent.parent.parent.child('registroData/'+data+'/'+key).set(newVal);
            return true;	
    		}
          ); 

exports.eliminaRegistroDaInventario = functions.database.ref('{catena}/{negozio}/inventari/{idInventario}/{keyRiga}')
    .onDelete((snap, context) =>
    		{
    			const key = context.params.keyRiga;
    			const ean = snap.val().ean;	
    			const data = snap.val().data;
    			snap.ref.parent.parent.parent.child('registroEAN/'+ean+'/'+data+'/'+key).remove();
                snap.ref.parent.parent.parent.child('registroData/'+data+'/'+key).remove();
    		
    		return true;		
    		}
          ); 

exports.aggiornaMagazzino = functions.database.ref('{catena}/{negozio}/registroEAN/{ean}')
    .onWrite((change, context) => 
            {
            const ean = context.params.ean;	
            //Caso riga cancellata....cancello semplicemente EAN ... e cancello la entry corrispondente 
         
            if (!change.after.exists()) 
                  {
                  return change.after.ref.parent.parent.child('magazzino/'+ean).remove();	
                  }
            else 
            	  {
            	  var totalePezzi = 0;
        		  var righe;
            	  date = change.after.val();	
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
            	  return change.after.ref.parent.parent.child('magazzino/'+ean).set(totali);
            	  }
               
            //Caso riga inserita o modificata... la sostituisco integralmente. 
            return true;	
            }
           ); 
    
