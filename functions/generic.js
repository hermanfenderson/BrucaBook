const equal = require('deep-equal');

const purge = (snap, context, part) =>
{
            const prefixId = context.params.prefixId;
            const key = context.params.id;
            const anno = context.params.anno;
            const mese = context.params.mese;
		
			switch(part)
				{
			 case 'bolle':
			 case 'rese':
			 case  'elencoScontrini':
				return snap.ref.parent.parent.parent.parent.child(part).child(anno).child(mese).child(key).remove().then(()=>{console.info("Cancellato "+part+ " "+key);});
			 case 'scontrini':
				return snap.ref.parent.parent.parent.parent.parent.child(part).child(anno).child(mese).child(prefixId).child(key).remove().then(()=>{console.info("Cancellato "+part+ " "+key);});
     		 case 'inventari':
				return snap.ref.parent.parent.child(part).child(key).remove().then(()=>{console.info("Cancellato "+part+ " "+key);});
         	 default: 
         		return false;
				}
};

//Action inserisci,modifica, elimina 

const aggiornaRegistro = (snap, context, action, part) =>
{
 const key =  context.params.keyRiga;
 const id = context.params.id;
 const prefixId = context.params.prefixId;
 const anno = context.params.anno;
 const mese = context.params.mese;
 const change = (action==='modifica') ? snap : null;
 const ref = (change) ? change.after.ref: snap.ref;
 const val = (change) ? change.after.val() : snap.val();
 const ean = val.ean;
 const data = val.data;
 const oldData = (change) ? change.before.val().data : null;
 var newVal;
 var destRef;
 switch(part)
{	
 case 'bolle':
 case 'rese':
	newVal = Object.assign(val, {tipo: part, id: anno + '/'+ mese + '/'+id});
	destRef = ref.parent.parent.parent.parent.parent;
 break;
 case 'scontrini':
 	 newVal = Object.assign(val, {tipo: 'scontrini', id: anno + '/'+ mese + '/'+prefixId + '/'+id});
     destRef = ref.parent.parent.parent.parent.parent.parent;
 break;
 case 'inventari':  
 	 newVal = Object.assign(val, {tipo: 'inventari', id: id});
     destRef = ref.parent.parent.parent;
 break;
 default:
 break;
}
let updates = {}; //Qui metto tutti gli updates
 if (change && (oldData !== data))
	{
		
        updates['registroData/'+oldData+'/'+key] = null;
        updates['registroEAN/'+ean+'/'+oldData+'/'+key] = null;
	}
 if (action==='inserisci' || action==='modifica')
	{
	     updates['registroData/'+data+'/'+key] = newVal;
        updates['registroEAN/'+ean+'/'+data+'/'+key] = newVal;
 	}
else 
	{
      updates['registroData/'+data+'/'+key] = null;
        updates['registroEAN/'+ean+'/'+data+'/'+key] = null;
        
	}
return (destRef.update(updates).then(()=>{console.info("Modifiche registro: "+key); console.info(updates);} ));
};

const update = (change, context, part) =>
{
	 let oldTot = change.before.child('totali');
     let newTot = change.after.child('totali');
     let oldSconto = change.before.child('sconto').val();
     let newSconto = change.after.child('sconto').val();
      if ((oldSconto === newSconto) && (equal(oldTot, newTot))) //Per discernere cambiamenti genuini in testata
            {	
	            const key = context.params.id;	
	            const anno = context.params.anno;
	            const mese = context.params.mese;
	            const cassa = context.params.prefixId;
			    var values = Object.assign({}, change.after.val());
			    delete values.totali; //Porto giù tutto meno i totali...e i timestamp (mi servono quelli dei figli)
			    delete values.createdBy;
			    delete values.createdAt;
			    delete values.changedBy;
			    delete values.changedAt;
			    delete values.key;
			    delete values.sconto; //Non devo persistere lo sconto se non è cambiato...
			   	var ref;	
			    switch(part)
			    	{
			    	case 'scontrini':	
				    	values.data = values.dataCassa;
						ref = change.after.ref.parent.parent.parent.parent.parent.child('scontrini').child(anno).child(mese).child(cassa).child(key);
				    break;
			    	case 'bolle':
			    		values.data = values.dataCarico;
					    ref = change.after.ref.parent.parent.parent.parent.child('bolle').child(anno).child(mese).child(key);
			    	break;
			    	
			    	case 'rese':
			    		  values.data = values.dataScarico;
			    		  ref = change.after.ref.parent.parent.parent.parent.child('rese').child(anno).child(mese).child(key);
			    	break;
			    	default: 
			    	break;
			    	}
				return(ref.once('value').then(function(snapshot) {
					let updates={};
					snapshot.forEach(function(childSnapshot) 
						{
						updates[childSnapshot.key] = values;
						//childSnapshot.ref.update(values);
	    				});
	    			ref.update(updates).then( console.info("Aggiorno " +part+ " "+key));	
					}));
              }	
		else return false;       
};

const calcolaTotali = (change, context, part) =>
{

             var key = context.params.id;	
             if (part==='elencoCasse' && change.after.val() && change.after.val().lastActionKey) key = change.after.val().lastActionKey;
             const cassa = context.params.prefixId;
             const anno = context.params.anno;
             const mese = context.params.mese;
			 const idItem = context.params.idItem;
            //Se calcolo la somma di scontrini salgo di due (sto osservando i totali...)
            const refParent = (part === 'elencoCasse') ? change.after.ref.parent.parent : change.after.ref.parent;
              	
            return(refParent.transaction(function(righe) {
            	    var totalePezzi = 0;
					var totaleImporto = 0.0;
	                var scontrini = 0;
	                var totaleGratis= 0;
	                var totali;
	                var ref;
            	   	for(var propt in righe)
		    			{
		    			totalePezzi = (part === 'elencoCasse') ? parseInt(righe[propt].totali.pezzi) + totalePezzi : parseInt(righe[propt].pezzi) + totalePezzi;
	    				totaleImporto =  (part === 'elencoCasse') ? parseFloat(righe[propt].totali.prezzoTotale) + parseFloat(totaleImporto) : parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
	    				if (part === 'elencoBolle' || part==='elencoRese')  totaleGratis =  parseInt(righe[propt].gratis) + totaleGratis;
	    				if (part === 'elencoCasse') scontrini++;	
		    			}
		    		switch(part)
		    			{
		    			case 'elencoBolle':
		    			case 'elencoRese':
		    				totali = {'pezzi' : totalePezzi, 'gratis' : totaleGratis, 'prezzoTotale' : totaleImporto.toFixed(2), lastActionKey : idItem}; 
		    			    ref = change.after.ref.parent.parent.parent.parent.parent.child(part).child(anno).child(mese).child(key);
		    			break;
		    			case 'elencoCasse':
		    				totali = {'pezzi' : totalePezzi, 'scontrini' : scontrini,
									'prezzoTotale' : totaleImporto.toFixed(2), 'lastActionKey' : key}; 
									ref = change.after.ref.parent.parent.parent.parent.parent.parent.child('elencoCasse').child(anno).child(mese).child(cassa);
		    			break;
		    			case 'elencoScontrini':
		    				totali = {'pezzi' : totalePezzi, 'prezzoTotale' : totaleImporto.toFixed(2), lastActionKey : idItem};
		    				ref = change.after.ref.parent.parent.parent.parent.parent.parent.child('elencoScontrini').child(anno).child(mese).child(cassa).child(key);
		    			break;
		    			default:
		    			break;
		    			}
		   	        let pezziTot = (part==='elencoBolle' || part==='elencoRese') ? totalePezzi + totaleGratis : totalePezzi;
					if (pezziTot > 0) ref.child('totali').set(totali); //Per non perdere tempo...
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
					}).then(console.info("aggiornati totali "+part+" chiave: "+key )));
            
        
                }	
        	   

module.exports = {
 purge : purge,
 aggiornaRegistro: aggiornaRegistro,
 update : update,
 calcolaTotali: calcolaTotali,
}


 