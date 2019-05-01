//Metodi helpers per fare "avanti e dietro" da firebase al mio mondo dati...(per esempio react-bootstrap-table)

//Per passare a react-bootstrap-table una tabella dati a partire da una snapshot di dati da firebase
//Gestisco una struttura dati fatta di un array e di un oggetto indice che associa la chiave di firebase alla tabella dell'array

//Vengo chiamato dal reducer... per tre tipologie di modifiche...
//Inserimento di una riga (evento on child added)
import Firebase from 'firebase';
import {getLibreria, getCatena} from '../reducers';

//Helper per il prefisso alla base dati...la ricolloco qui... in prospettiva...
export function prefissoNegozio(getState) 
    { 
      const catena = getCatena(getState());
      const libreria = getLibreria(getState());
      if (catena && libreria) return(getCatena(getState()) + '/' + getLibreria(getState()) + '/'); 
      else return null;
    }
    
//Passo un getstate, dove voglio andare (stringa), params (oggetti)
//Posso semplificare...
//Se params è un valore singolo... vuol dire che firebase aveva bisogno solo di quello...
//Se è un array sono i valori a cui accedere in ordine...
//Come zucchero semantico posso aggiungere un secondo parametro specifico del periodo che magari rende più leggibile
//Un secondo parametro per discernere se sto vedendo una singola riga.. così semplifico l'elengo oggetti...
// urlFactory (getState, destination, params, itemId, period)
//Dove params è un valore singolo o un arrey
//ItemId determina una foglia...
//Period determina i valori da dare a anno e mese...

export function urlFactory(getState, destination, params, itemId)    
{   let url = "";
    let prefisso = prefissoNegozio(getState);
    if (params && !Array.isArray(params)) params = [params];
    if (prefisso)
    {
	  	switch(destination)
			{
				//RigheBolla sta sotto anno, mese e idBolla
				case "righeBolla": url = prefissoNegozio(getState)+'bolle/'  +params[0]+'/'+params[1] + '/'+params[2] ; break;
				//Un trucco per passare l'id che ho già nel formato giusto...
				case "righeBollaInResa": url = prefissoNegozio(getState)+'bolle/'  +params[0]; break;
				//Punta alle rese...
				case "reseInRigheBolla": url = prefissoNegozio(getState)+'bolle/'  +params[0] + '/rese'; break;
				
				case "righeElencoBolle": url = prefissoNegozio(getState)+'elencoBolle/'+params[0]+'/'+params[1]; break;
				//Persisto una chiave di accesso per ogni bolla ordinata secondo il fornitore
				case "bollePerFornitore": url = prefissoNegozio(getState)+'bollePerFornitore/'+params[0]; break;
				
				case "righeElencoCasse": url = prefissoNegozio(getState)+'elencoCasse/'+params[0]+'/'+params[1]; break;
				case "righeElencoRese": url = prefissoNegozio(getState)+'elencoRese/'+params[0]+'/'+params[1]; break;
				case "righeResa": url = prefissoNegozio(getState)+'rese/'  +params[0]+'/'+params[1] + '/'+params[2] ; break;
			
				case "righeElencoScontrini": url = prefissoNegozio(getState)+'elencoScontrini/'+params[0]+'/'+params[1] + '/'+params[2]; break;
				
				//Elenco di tutte le info di una cassa...
			    case "righeCassa": url = prefissoNegozio(getState)+'scontrini/'+params[0]+'/'+params[1]+'/'+params[2]; break;
			    
			    case "righeScontrino": url = prefissoNegozio(getState)+'scontrini/'+params[0]+'/'+params[1] + '/'+params[2] + '/'+params[3]; break;
				
			
				case "magazzino": url = prefissoNegozio(getState)+'magazzino'; break;
			    case "catalogoLocale": url = prefissoNegozio(getState)+'catalogo'; break;
				
				case "registroEAN": url = prefissoNegozio(getState)+'registroEAN'; break;
				
				case "registroData": url = prefissoNegozio(getState)+'registroData'; break;
				
				
				//Sono piatti... ne avrò uno l'anno... per 50 anni sono a posto...
				case "righeInventario": url = prefissoNegozio(getState)+'inventari/'  +params[0] ; break;
				case "righeElencoInventari": url = prefissoNegozio(getState)+'elencoInventari'; break;
				
				case "totaliInventario": url = prefissoNegozio(getState)+'elencoInventari/' +params[0] +'/totali'; break;
		
				 case "anagraficheLocali": url = prefissoNegozio(getState)+'anagrafiche'; break;
				 
				 //La tabella persistita.... è ordinata per idCliente. In memoria avrò gli ordini aperti ordinati per EAN
				 case "ordiniAperti": url = prefissoNegozio(getState)+'ordiniAperti'; break;
			    
			     case "fornitori": url = prefissoNegozio(getState)+'anagrafiche/fornitori'; break;
			      case "categorie": url = prefissoNegozio(getState)+'anagrafiche/categorie'; break;
			      case "clienti": url = prefissoNegozio(getState)+'anagrafiche/clienti'; break;
			      case "cliente": url = prefissoNegozio(getState)+'anagrafiche/clienti/'+params[0]; break;
			      
			      //Gli ordini sono per cliente e basta
			     	case "righeElencoOrdini": url = prefissoNegozio(getState)+'elencoOrdini/'+params[0]; break;
			     	case "righeOrdine": url = prefissoNegozio(getState)+'ordini/'+params[0]+'/'+params[1]; break;
			     	//Ordinate per EAN...me le tiro tutte dentro
			     	case "righeOrdiniAperti": url = prefissoNegozio(getState)+'ordiniAperti'; break;
			     	
			
			      case "report": url = prefissoNegozio(getState)+'report'; break;
			    case "dateStoricoMagazzino": url = prefissoNegozio(getState)+'dateStoricoMagazzino'; break;
			    case "storicoMagazzino": url = prefissoNegozio(getState)+'storicoMagazzino/'+params[0]; break;
			    
				
				default: return null;
			}
		if (itemId) url = url + '/' + itemId;	
		return url;
    }
    else return null;
	
}


//Aggiunta possibilità di salvare i valori in un oggetto-prefisso qui e nei due metodi sotto...
export function childAdded(payload, state, dataArrayName, dataIndexName, transformItem, prefix)
{  //Creo un array e un indice per copia degli attuali
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndexNew = {...(state[dataIndexName])};
  //Prendo la riga da aggiungere e aggiungo una proprietà con la chiave
   var tmp = payload.val();
   tmp['key'] = payload.key;
    //Se è definita una funzione di trasformazione la applico
   if (transformItem) transformItem(tmp);


   if (!prefix) dataArrayNew.push(tmp);
   else 
	{   let obj = {};
		obj[prefix] = tmp;
		obj.key = payload.key;
		dataArrayNew.push(obj);
	}	
  //Creo un indice per recuperare in seguito la posizione nell'array per la chiave
   dataIndexNew[payload.key] = dataArrayNew.length - 1;
  
  //Aggiorno lo stato passando nuovo array e nuovo indice
   var newState = {...state};
   newState[dataArrayName] = dataArrayNew;
   newState[dataIndexName] = dataIndexNew;                    
   return newState;
}
/*
export function initialLoading(payload,state, dataArrayName, dataIndexName, transformItem, prefix)
{
	//Creo un array e un indice per copia degli attuali
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndexNew = {...(state[dataIndexName])};
   for (let propt in payload.val())
		{
	    
		//Aggiungo solo se non la ho già...
		
		if (dataIndexNew[propt] !== undefined)
		  {
		  	  var index = dataIndexNew[propt];
  
		  	 delete dataIndexNew[propt];
			//Cancello la rigna nell'array
			 dataArrayNew.splice(index,1);
			  //Aggiorno l'indice decrementando tutti i puntatori maggiori della posizione eliminata...
			   for(var propt2 in dataIndexNew){
			          if (dataIndexNew[propt2] > index) dataIndexNew[propt2]--;
			      }
	  		  	 
		  }		
		  
		  
		  //Prendo la riga da aggiungere e aggiungo una proprietà con la chiave
		   var tmp = payload.val()[propt];
		   tmp['key'] = propt;
		    //Se è definita una funzione di trasformazione la applico
		   if (transformItem) transformItem(tmp);
		
		
		   if (!prefix) dataArrayNew.push(tmp);
		   else 
			{   let obj = {};
				obj[prefix] = tmp;
				obj.key = tmp['key'];
				dataArrayNew.push(obj);
			}	
		  //Creo un indice per recuperare in seguito la posizione nell'array per la chiave
		   dataIndexNew[propt] = dataArrayNew.length - 1;
		   
		}
	 
    //Aggiorno lo stato passando nuovo array e nuovo indice
    var newState = {...state};
    newState[dataArrayName] = dataArrayNew;
    newState[dataIndexName] = dataIndexNew;                    
	return newState;
}
*/


export function initialLoading(payload,state, dataArrayName, dataIndexName, transformItem, prefix)
{
 //Creo una copia del vecchio array (potrei avere righe arrivate in anticipo)
   var dataArrayTmp = state[dataArrayName].slice();

	//Creo un array a partire dall'oggetto
  let values = payload.val();
  console.log(values);
   let dataArrayNewTmp =  values ? Object.values(values) : [];
   let tmpArray = values? Object.keys(values) : [];
   let dataArrayNew = dataArrayNewTmp.map((value,index) => 
		{
   			let valueOut = {};
   			value.key = tmpArray[index];
   			if (transformItem) transformItem(value);
   			if (prefix) 
   				{
   				valueOut[prefix] = value;
   				valueOut.key = value.key;
   				}
   			else 
   			    valueOut = value;
   			return valueOut;
		})
	let dataIndexNew = {};	
    tmpArray.forEach((value,index) => {dataIndexNew[value] = index});
    if (dataArrayTmp)
    	{
    	dataArrayTmp.forEach((value) => {
    		if (dataIndexNew[value.key] === undefined)
    			{
    				//Se ho righe che mi sono perso le aggiungo di nuovo...
    				dataArrayNew.push(value);
    				dataIndexNew[value.key] = dataArrayNew.length - 1;
    			}
    	})	
    	}
    //Aggiorno lo stato passando nuovo array e nuovo indice
    var newState = {...state};
    newState[dataArrayName] = dataArrayNew;
    newState[dataIndexName] = dataIndexNew;                    
	return newState;
}



export function childDeleted(payload, state, dataArrayName, dataIndexName)
{  //Creo un array e un indice per copia degli attuali
 
   var dataArrayNew = [...state[dataArrayName]];
   var dataIndexNew = {...(state[dataIndexName])};
   //Cerco nell'indice la riga nell'array da cancellare  
   var index = dataIndexNew[payload.key];
   //Antirimbalzo...
   if (index>=0) 
		{
	  //Cancello la riga nell'indice
	   delete dataIndexNew[payload.key];
	   
	  //Cancello la rigna nell'array
	   dataArrayNew.splice(index,1);
	  //Aggiorno l'indice decrementando tutti i puntatori maggiori della posizione eliminata...
	   for(var propt in dataIndexNew){
	          if (dataIndexNew[propt] > index) dataIndexNew[propt]--;
	      }
	   //Aggiorno lo stato passando nuovo array e nuovo indice   
	   let newState = {...state};
	   newState[dataArrayName] = dataArrayNew;
	   newState[dataIndexName] = dataIndexNew;  
	   return newState;
	   }
	else return {...state};
}

export function childChanged(payload, state, dataArrayName, dataIndexName, transformItem, prefix)
{  //Creo un array per copia dell'attuale e accedo all'indice (non mi serve cambiarlo)
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndex = state[dataIndexName];
  //Vedo in quale posizione devo modificare
  var index = dataIndex[payload.key];
   //Antirimbalzo
   if (index>=0) 
		{
		  //Prendo la riga da modificare e aggiungo una proprietà con la chiave
		   var tmp = payload.val();
		   tmp['key'] = payload.key;
		 //Se è definita una funzione di trasformazione la applico
		   if (transformItem) transformItem(tmp);
		  
		   if (!prefix) dataArrayNew[index] = tmp; //Aggiorno la riga alla posizione giusta
			else 
			{   let obj = {};
				obj[prefix] = tmp;
				obj.key = payload.key;
		
				dataArrayNew[index] = obj;
			}	

		  //Aggiorno lo stato passando nuovo array e nuovo indice
		   var newState = {...state};
		   newState[dataArrayName] = dataArrayNew;
		   return newState;
		}
	else return {...state};   
}

export function addCreatedStamp(record)
  {
   record['createdBy'] = Firebase.auth().currentUser.uid;
    record['createdAt'] = Firebase.database.ServerValue.TIMESTAMP;
  return record;
 }

export function addChangedStamp(record)
  {
   record['changedBy'] = Firebase.auth().currentUser.uid;
  record['changedAt'] = Firebase.database.ServerValue.TIMESTAMP;
  return record;
 }
 
 export function firebaseUploader(obj)
 {
 	var fileRef = Firebase.storage().ref().child(obj.filename);
 	fileRef.put(obj.file).then(function(snapshot) {
  obj.file.status='done';
  obj.file.url = snapshot.downloadURL;
  obj.onSuccess(obj);
  /*
  fileRef.getDownloadURL().then(function(url) {
  		obj.file.url = url;
		obj.onSuccess(obj);
		});
  */		
	});
 }
 

 
 export function firebaseGetDownloadURL(path, callback)
 {
 		var fileRef = Firebase.storage().ref().child(path);
 		fileRef.getDownloadURL().then(function(url) {
  		callback(url);
		});
 }
//Ritorna errore in italiano se lo ho tradotto... altrimenti ritorna errore originario...

 export const fbItaErr = (error) =>
 {
 let message = '';
 if (error) 
	{
	    switch (error.code) 
	    {
	    case 'auth/wrong-password': message = 'Password sbagliata o account non esistente'; break;
	    case 'auth/email-already-in-use': message = 'Indirizzo email già in uso'; break;
	    case 'auth/weak-password': message = 'Password troppo debole (almeno 6 caratteri)'; break;
	
		default:  message = error.message; break;
	    }
	}    
 return message;   	
 }


export const getServerTime = (ref) => {
    var offset = 0;
    ref.child('.info/serverTimeOffset').on('value', function(snap) {
       offset = snap.val();
    });

    return function() {
       return Date.now() + offset;
    }
};





