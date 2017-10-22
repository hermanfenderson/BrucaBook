//Metodi helpers per fare "avanti e dietro" da firebase al mio mondo dati...(per esempio react-bootstrap-table)

//Per passare a react-bootstrap-table una tabella dati a partire da una snapshot di dati da firebase
//Gestisco una struttura dati fatta di un array e di un oggetto indice che associa la chiave di firebase alla tabella dell'array

//Vengo chiamato dal reducer... per tre tipologie di modifiche...
//Inserimento di una riga (evento on child added)
import Firebase from 'firebase';

//Helper per il prefisso alla base dati...la ricolloco qui... in prospettiva...
export function prefissoNegozio(getState) 
    { 
      return(getState().status.catena + '/' + getState().status.libreria + '/'); 
    }
    
//Passo un getstate, dove voglio andare (stringa), params (oggetti)
export function urlFactory(getState, destination, params)    
{   let url = "";
	switch(destination)
		{
			//Bolla: in input idBolla
			case "totaliBolla": url = prefissoNegozio(getState)+'bolle/'  + params.bollaId + '/totali'; break;
			case "righeBolla": url = prefissoNegozio(getState)+'bolle/'  + params.bollaId + '/righe'; break;
			case "rigaBolla": url = prefissoNegozio(getState)+'bolle/'  + params.bollaId + '/righe/' +params.rigaId; break;
			default: return "";
		}
	return url;	
	
}

export function childAdded(payload, state, dataArrayName, dataIndexName)
{  //Creo un array e un indice per copia degli attuali
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndexNew = {...(state[dataIndexName])};
  //Prendo la riga da aggiungere e aggiungo una proprietà con la chiave
   var tmp = payload.val();
   tmp['key'] = payload.key;
   dataArrayNew.push(tmp);
  //Creo un indice per recuperare in seguito la posizione nell'array per la chiave
   dataIndexNew[payload.key] = dataArrayNew.length - 1;
  
  //Aggiorno lo stato passando nuovo array e nuovo indice
   var newState = {...state};
   newState[dataArrayName] = dataArrayNew;
   newState[dataIndexName] = dataIndexNew;                    
   return newState;
}

export function childDeleted(payload, state, dataArrayName, dataIndexName)
{  //Creo un array e un indice per copia degli attuali
 
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndexNew = {...(state[dataIndexName])};
   //Cerco nell'indice la riga nell'array da cancellare  
   var index = dataIndexNew[payload.key];
  //Cancello la riga nell'indice
   delete dataIndexNew[payload.key]
  //Cancello la rigna nell'array
   dataArrayNew.splice(index,1);
  //Aggiorno l'indice decrementando tutti i puntatori maggiori della posizione eliminata...
   for(var propt in dataIndexNew){
          if (dataIndexNew[propt] > index) dataIndexNew[propt]--;
      }
   //Aggiorno lo stato passando nuovo array e nuovo indice   
   var newState = {...state};
   newState[dataArrayName] = dataArrayNew;
   newState[dataIndexName] = dataIndexNew;                    
   return newState;
}

export function childChanged(payload, state, dataArrayName, dataIndexName)
{  //Creo un array per copia dell'attuale e accedo all'indice (non mi serve cambiarlo)
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndex = state[dataIndexName];
  //Vedo in quale posizione devo modificare
  var index = dataIndex[payload.key];
  //Prendo la riga da modificare e aggiungo una proprietà con la chiave
   var tmp = payload.val();
   tmp['key'] = payload.key;
   dataArrayNew[index] = tmp; //Aggiorno la riga alla posizione giusta
  
  //Aggiorno lo stato passando nuovo array e nuovo indice
   var newState = {...state};
   newState[dataArrayName] = dataArrayNew;
   return newState;
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

