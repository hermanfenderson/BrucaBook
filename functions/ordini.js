

const encodeSlash = (path) => {
	return(path.replace(/\//g, ","))
};

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

module.exports = {
findRiga: findRiga,
deletedRigaOrdine: deletedRigaOrdine
}