import {addCreatedStamp,addChangedStamp} from '../helpers/firebase';
export const ADDED_RIGA_SCONTRINO = 'ADDED_RIGA_SCONTRINO';
export const DELETED_RIGA_SCONTRINO = 'DELETED_RIGA_SCONTRINO';
export const CHANGED_RIGA_SCONTRINO = 'CHANGED_RIGA_SCONTRINO';
export const SET_SELECTED_RIGA_SCONTRINO = 'SET_SELECTED_RIGA_SCONTRINO';
export const TABLE_SCONTRINO_WILL_SCROLL = 'TABLE_BOLLA_WILL_SCONTRINO';
export const RESET_SCONTRINO = 'RESET_SCONTRINO';
export const TOTALI_SCONTRINO_CHANGED = 'TOTALI_SCONTRINO_CHANGED';
import Firebase from 'firebase';
import {prefissoNegozio} from './index';

function preparaRiga(riga)
   {
     riga['sconto'] = parseInt(riga['sconto']) || 0;
       riga['pezzi'] = parseInt(riga['pezzi']) || 0;
       riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
     riga['prezzoTotale'] = parseFloat(riga['prezzoTotale']).toFixed(2);
   }


export function totaliScontrinoChanged(cassaId, scontrinoId)
{
  return function(dispatch, getState) {
    
    Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/totali').on('value', snapshot => {
      dispatch({
        type: TOTALI_SCONTRINO_CHANGED,
        payload: snapshot.val()
      })
    });
 
}	
}

//Questo va "staccato"
export function calcolaTotaliSafe(cassaId, scontrinoId) 

{return function(dispatch,getState) {

var scontrinoRef = Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId ); //Puntatore alla bolla corrente
scontrinoRef.transaction(function(scontrino) {
 	if (scontrino)
		{
		var totalePezzi = 0.0;
		var totaleImporto = 0.0;
	  	var righe = scontrino['righe'];
	  	for(var propt in righe){
			 totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
	    	 totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
			}
		scontrino['totali']  = {'pezzi' : totalePezzi, 'prezzoTotale' : totaleImporto.toFixed(2)}; 
		console.log(scontrino);
	    return (scontrino);
		}
    else 
    	{

        var scontrinoReset = {'totali' : {'pezzi' : 0, 'prezzoTotale' : 0}};
        return (scontrinoReset);
    	} 
  },function(){},false);
 
}
}


export function tableScontrinoWillScroll(scroll) {
  return {
    type: TABLE_SCONTRINO_WILL_SCROLL,
    scroll
  }
}


export function resetScontrino(cassaId, scontrinoId) {
  return function(dispatch, getState) {
    
    
   Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/righe').off();
   Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/totali').off();
 
   dispatch({type: RESET_SCONTRINO});
    
  }
}


  
  
//Ho già sganciato il calcolo dei totali...

export function aggiungiRigaScontrino(cassaId, scontrinoId,valori) {

  var nuovaRigaScontrino = {...valori};
   addCreatedStamp(nuovaRigaScontrino);
   preparaRiga(nuovaRigaScontrino);

   return function(dispatch,getState) {
	
	dispatch(tableScontrinoWillScroll(true));    
    Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/righe').push().set(nuovaRigaScontrino);

   }
}



//Idem...
export function aggiornaRigaBolla(bolla,valori,selectedRigaBollaValues) {
    var nuovaRigaBolla = {...valori};
      addChangedStamp(nuovaRigaBolla);
   preparaRiga(nuovaRigaBolla);
     return function(dispatch,getState) {
    
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe/' + selectedRigaBollaValues['key']).update(nuovaRigaBolla).then(response => {
    });
  }
  
}
export function aggiornaRigaScontrino(cassaId, scontrinoId,valori,selectedRigaScontrinoValues) {
    var nuovaRigaScontrino = {...valori};
   addChangedStamp(nuovaRigaScontrino);
   preparaRiga(nuovaRigaScontrino);
  return function(dispatch,getState) {
  	 Firebase.database().ref(prefissoNegozio(getState) +'vendite/' + cassaId + '/' + scontrinoId + '/righe/' + selectedRigaScontrinoValues['key']).update(nuovaRigaScontrino).then(response => {
    });
  }
}


export function setSelectedRigaScontrino(row) {
  return {
    type: SET_SELECTED_RIGA_SCONTRINO,
    row
  }  
}



//Aggiungo il riferimento alla riga per determinare le righe da cancellare...
export function deleteRigaScontrino(cassaId, scontrinoId, row) {
  return function(dispatch, getState) {
  	 var id = row['key'];
     var rigaDaCancellare = prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/righe/' +id;
     Firebase.database().ref(rigaDaCancellare).remove().then(response => {
  })
    };
  }


export function addedRigaScontrino(cassaId, scontrinoId) {
  return function(dispatch, getState) {
      
    Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/righe').on('child_added', snapshot => {
      dispatch({
        type: ADDED_RIGA_SCONTRINO,
        payload: snapshot
      })
    });
  }
}

export function deletedRigaScontrino(cassaId, scontrinoId) {
  return function(dispatch, getState) {
    
    
   Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/righe').on('child_removed', snapshot => {
      dispatch({
        type: DELETED_RIGA_SCONTRINO,
        payload: snapshot
      })
    });
  }
}

export function changedRigaScontrino(cassaId, scontrinoId) {
  return function(dispatch, getState) {
    Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/righe').on('child_changed', snapshot => {
      dispatch({
        type: CHANGED_RIGA_SCONTRINO,
        payload: snapshot
      })
    });
  }
}
