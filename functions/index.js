
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
/*
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/messages').push({original: original}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});
*/

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
/*
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      const original = event.data.val();
      console.log('Uppercasing', event.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return event.data.ref.parent.child('uppercase').set(uppercase);
    });
*/    
    

    
exports.calcolaTotaleBolla = functions.database.ref('{catena}/{negozio}/bolle/{idBolla}')
    .onWrite(event => {
    	if (event.data.child('righe').changed()) //Non eseguo se sono cambiati i totali...
    		{
        	const righe = event.data.child('righe').val();
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
			console.log(totali);
			return event.data.ref.child('totali').set(totali);	
			
    		}
    	else return event.data.ref; //Nessuna modifica se sono cambiati i totali...
    }); 
    

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
   
