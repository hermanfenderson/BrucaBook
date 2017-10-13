//DA RIPULIRE SIGNIFICATIVAMENTE

import { browserHistory } from 'react-router';
import {addCreatedStamp,addChangedStamp} from '../helpers/firebase';
export const NEW_SCONTRINO = 'NEW_SCONTRINO';
export const TOTALI_CASSA_CHANGED = 'TOTALI_CASSA_CHANGED';
export const TOTALI_CASSA_UPDATE = 'TOTALI_CASSA_UPDATE';

export const ADDED_RIGA_SCONTRINO = 'ADDED_RIGA_SCONTRINO';
export const DELETED_RIGA_SCONTRINO = 'DELETED_RIGA_SCONTRINO';
export const CHANGED_RIGA_SCONTRINO = 'CHANGED_RIGA_SCONTRINO';
export const SET_SELECTED_RIGA_SCONTRINO = 'SET_SELECTED_RIGA_SCONTRINO';
export const TABLE_SCONTRINO_WILL_SCROLL = 'TABLE_BOLLA_WILL_SCONTRINO';
export const RESET_SCONTRINO = 'RESET_SCONTRINO';
export const TOTALI_SCONTRINO_CHANGED = 'TOTALI_SCONTRINO_CHANGED';
import Firebase from 'firebase';
import {prefissoNegozio} from './index';


export function newScontrino(cassaId, oldScontrinoId = null)
{
	return function(dispatch, getState) {
    
    var keyScontrino = Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId).push().key;
    dispatch({
        type: NEW_SCONTRINO,
        payload: keyScontrino
      });
   if (oldScontrinoId) dispatch(resetScontrino(cassaId, oldScontrinoId));   
   browserHistory.push('/cassa/' + cassaId + '/' + keyScontrino);
   return (keyScontrino);
}	
  
}





export function totaliCassaChanged(cassaId)
{
  return function(dispatch, getState) {
    
    Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId +  '/totali').on('value', snapshot => {
      dispatch({
        type: TOTALI_CASSA_CHANGED,
        payload: snapshot.val()
      })
    });
 
}	
}




export function calcolaTotaliSafe(cassaId, scontrinoId) 

{return function(dispatch,getState) {

var scontrinoRef = Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId ); //Puntatore alla bolla corrente
scontrinoRef.transaction(function(scontrino) {
 	if (scontrino)
		{
		var totalePezzi = 0;
		var totaleImporto = 0.0;
	  	var righe = scontrino['righe'];
	  	for(var propt in righe){
			 totalePezzi = righe[propt].pezzi + totalePezzi;
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

//Da qui va tutto MODIFICATO

function preparaRiga(riga)
   {
     riga['sconto'] = parseInt(riga['sconto']) || 0;
       riga['pezzi'] = parseInt(riga['pezzi']) || 0;
       riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
     riga['prezzoTotale'] = parseFloat(riga['prezzoTotale']).toFixed(2);
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
   dispatch({type: RESET_SCONTRINO});
    
  }
}

/*

export function aggiungiRigaScontrino(cassaId, scontrinoId,valori) {

var nuovaRigaScontrino = {...valori};
   addCreatedStamp(nuovaRigaScontrino);
   preparaRiga(nuovaRigaScontrino);

return function(dispatch,getState) {
	
	dispatch(tableScontrinoWillScroll(true));    
    dispatch(calcolaTotaliSafe(cassaId, scontrinoId));
     var rigaRef =Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/righe').push();
    var magazzinoList = dispatch(aggiungiRigheScontrinoMagazzino(cassaId, scontrinoId,valori,rigaRef)); //Calcolo prima...
  //  var magazzinoList = {};
    nuovaRigaScontrino['listaOggetti'] = magazzinoList;
    rigaRef.set(nuovaRigaScontrino).then(response => {
    		dispatch(calcolaTotaliSafe(cassaId, scontrinoId));
    			 });
}
}




export function aggiornaRigaScontrino(cassaId, scontrinoId,valori,selectedRigaScontrinoValues) {
    var nuovaRigaScontrino = {...valori};
    var selectedRigaScontrino = selectedRigaScontrinoValues['key'];
     
   addChangedStamp(nuovaRigaScontrino);
   preparaRiga(nuovaRigaScontrino);
  return function(dispatch,getState) {
     //Cancello le righe in magazzino della vecchia versione...
    dispatch(eliminaRigheMagazzino(selectedRigaScontrinoValues['ean'], selectedRigaScontrinoValues['listaOggetti']));
    dispatch(aggiungiRigheScontrinoMagazzino(cassaId, scontrinoId, valori, selectedRigaScontrino));
    //e le aggiungo per la nuova
  
    Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/righe/' + selectedRigaScontrino).update(nuovaRigaScontrino).then(response => {
    dispatch(calcolaTotaliSafe(cassaId, scontrinoId));
    });
  }
}
*/


export function setSelectedRigaScontrino(row) {
  return {
    type: SET_SELECTED_RIGA_SCONTRINO,
    row
  }  
}

/*
//Aggiungo il riferimento alla riga per determinare le righe da cancellare...
export function deleteRigaScontrino(cassaId, scontrinoId, row) {
  return function(dispatch, getState) {
  	dispatch(eliminaRigheMagazzino(row['ean'], row['listaOggetti']));
   var id = row['key'];
  Firebase.database().ref(prefissoNegozio(getState) +'vendite/'  + cassaId + '/' + scontrinoId + '/righe/' +id).remove().then(response => {
    dispatch(calcolaTotaliSafe(cassaId, scontrinoId));
  })
    };
  }

*(
)
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

/*
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

*/


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
