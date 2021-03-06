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
			case 'ordini':
				return snap.ref.parent.parent.parent.child(part).child(context.params.cliente).child(key).remove().then(()=>{console.info("Cancellato "+part+ " "+key);});
			case 'clienti':
				return snap.ref.parent.parent.parent.child('elencoOrdini').child(key).remove().then(()=>{console.info("Cancellato "+part+ " "+key);});
         	
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
	 let oldSconto = change.before.child('sconto').val();
     let newSconto = change.after.child('sconto').val();
     let oldPezzi = change.before.child('totali').child('pezzi').val();
     let newPezzi = change.after.child('totali').child('pezzi').val();
     let oldPrezzo = change.before.child('totali').child('prezzoTotale').val();
     let newPrezzo = change.after.child('totali').child('prezzoTotale').val();
     
     
      if ((oldSconto === newSconto) && (oldPezzi === newPezzi) && (oldPrezzo === newPrezzo)) //Per discernere cambiamenti genuini in testata
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
						let mergedValues = Object.assign({}, childSnapshot.val(), values);
						updates[childSnapshot.key] = mergedValues;
						//childSnapshot.ref.update(values);
	    				});
	    			ref.update(updates).then( console.info("Aggiorno " +part+ " "+key));	
					}));
              }	
		else return false;       
};

//Ti passo direttamente il pezzo di dati su cui calcolare... 	   
const calcolaTotaliNew = (change, context, part) =>
{
           
             const cassa = context.params.prefixId;
             const anno = context.params.anno;
             const mese = context.params.mese;
             const key = context.params.id;
			 //Se calcolo la somma di scontrini salgo di due (sto osservando i totali...)
			 const items = change.after.val();
			 const righe = (items) ? Object.values(items) : [];
              	
			var totalePezzi = 0;
			var totaleImporto = 0.0;
	        var scontrini = 0;
	        var totaleGratis= 0;
	        var totali;
	        for(let propt=0; propt<righe.length; propt++)
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
		    				totali = {'pezzi' : totalePezzi, 'gratis' : totaleGratis, 'prezzoTotale' : totaleImporto.toFixed(2)}; 
		    			    ref = change.after.ref.parent.parent.parent.parent.child(part).child(anno).child(mese).child(key);
		    			break;
		    			case 'elencoCasse':
		    				totali = {'pezzi' : totalePezzi, 'scontrini' : scontrini,
									'prezzoTotale' : totaleImporto.toFixed(2)}; 
									ref = change.after.ref.parent.parent.parent.parent.child('elencoCasse').child(anno).child(mese).child(key);
		    			break;
		    			case 'elencoScontrini':
		    				totali = {'pezzi' : totalePezzi, 'prezzoTotale' : totaleImporto.toFixed(2)};
		    				ref = change.after.ref.parent.parent.parent.parent.parent.child('elencoScontrini').child(anno).child(mese).child(cassa).child(key);
		    			break;
		    			case 'elencoOrdini': 
		    				console.log(totaleImporto);
		    				totali = {'pezzi' : totalePezzi,  'prezzoTotale' : totaleImporto.toFixed(2), lastActionKey : idItem}; 
		    			    ref = change.after.ref.parent.parent.parent.child(part).child(context.params.cliente).child(key);
		                break;
		    			default:
		    			break;
		    			}
		   	        let pezziTot = (part==='elencoBolle' || part==='elencoRese') ? totalePezzi + totaleGratis : totalePezzi;
					if (pezziTot > 0) return(ref.child('totali').set(totali).then(console.info("aggiornati totali "+part+" chiave: "+key ))); //Per non perdere tempo...
					//Se sono a zero pezzi ... aggiorno i totali... se non è vuoto elencoBolle...
					else 
						{
						return(ref.once("value")
								.then(function(snapshot) {
									var notEmpty = snapshot.hasChildren(); 
				    				if (notEmpty) ref.child('totali').set(totali).then(console.info("aggiornati totali "+part+" chiave: "+key ));
				    				else console.info("Record vuoto: "+part+" chiave: "+key);
									 }));
				    	}
		    	
        
                }	
        	   

module.exports = {
 purge : purge,
 aggiornaRegistro: aggiornaRegistro,
 update : update,
 calcolaTotaliNew: calcolaTotaliNew
}


 