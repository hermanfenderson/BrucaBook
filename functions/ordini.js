

const encodeSlash = (path) => {
	return(path.replace(/\//g, ","))
};

const decodeSlash = (key) => {
	return(key.replace(/,/g, "/"));
}
//dato un elenco di righe bolle o scontrini riporta quale riga contiene uno specifico ordine
const findRiga = (rows,order) =>
{


	let encodedOrder = encodeSlash(order);
	let keyOrder = null;
	for (var key in rows) {
		let row = rows[key];
         if (row.ordini) 
        	{
             for (var order_key in row.ordini)
                	{
            		if  (order_key === encodedOrder) 
            			{keyOrder = key;
            			 break;
            			}
            		}
            if (keyOrder) break;	    
        	}
	}
	
	return keyOrder;
}

const deletedRigaOrdine = (snap, context, source, path) =>
{
	//Vengo chiamato se ho bolla o scontrino valorizzato...
	let ref = snap.ref.parent.parent.parent.parent.child(source).child(path);
	ref.once("value")
								.then(function(snapshot) {
								    let righe = snapshot.val();
								    let ordine = context.params.cliente+'/'+context.params.ordine+'/'+context.params.id;
								    console.log("Ordine da cancellare " + ordine);
								    let riga = findRiga(righe,ordine);
								    console.log("Trovato in riga "+source+": " + riga);
								    
				    				if (riga) ref.child(riga).child('ordini').child(encodeSlash(ordine)).remove();
				    				return(riga);
									 });
	
	
}

const deletedRiga = (context, ordini, source) =>
{
	//Creo un oggetto con tutte le righe ordine che devo modificare
	//Qui metto tutte le rpomises relative agli ordini
	let ordineBaseRef = (source === "scontrini") ? snap.ref.parent.parent.parent.parent.parent.parent.child("ordini") : snap.ref.parent.parent.parent.parent.parent.child("ordini");
	//Fa riferimento allo scontrino o alla bolla che sto cancellando...
	let path = (source === "scontrini") ? context.params.anno + '/' +  context.params.mese + '/'+ context.params.prefixId + '/' + context.params.id :  context.params.anno + '/' +  context.params.mese + '/'+ context.params.id; 
	let allOrderPromises = [];
	let updatedOrders = {};
	for (var key in ordini)
		{   
			var decodedOrder = decodeSlash(key);
			//Metto la promise corrispondente al then di ogni ordine in un array....
			allOrderPromises.push(
					ordineBaseRef.child(decodedOrder).once("value").then(
						 (function(snapshot)
							{
							var ordine = snapshot.val();
							if (source === "scontrini")
								{
								if (ordine.scontrino === path && ordine.stato === 'Z')
									{
									ordine.stato = (ordine.oldStato) ? ordine.oldStato : 'Z';
									ordine.oldStato = 'Z';
									}
							    if (ordine.scontrino === path) ordine.scontrino = null;
									
								ordine.history[ordineBaseRef.push().key] = {at: Firebase.database.ServerValue.TIMESTAMP, oldStato: ordine.oldStato, stato: ordine.stato, source: 'scontrinoCancellato', path: path};
	  	        		
								}
							//Eì una bolla
							else
								{
								if (ordine.bolla === path && ordine.stato === 'C')
									{
									ordine.stato = (ordine.oldStato) ? ordine.oldStato : 'C';
									ordine.oldStato = 'C';
									}
								if (ordine.bolla === path) ordine.bolla = null;
								
								ordine.history[ordineBaseRef.push().key] = {at: Firebase.database.ServerValue.TIMESTAMP, oldStato: ordine.oldStato, stato: ordine.stato, source: 'bollaCancellata', path: path};
	  	        			
								}
							updatedOrders[decodedOrder] = ordine;	
							return(ordine);
							}
						)
					)
				)	
		}
}

module.exports = {
findRiga: findRiga,
deletedRigaOrdine: deletedRigaOrdine,
deletedRiga:deletedRiga
}

