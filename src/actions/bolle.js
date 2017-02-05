import {addCreatedStamp,addChangedStamp} from '../helpers/firebase';
export const ADDED_RIGA_BOLLA = 'ADDED_RIGA_BOLLA';
export const DELETED_RIGA_BOLLA = 'DELETED_RIGA_BOLLA';
export const CHANGED_RIGA_BOLLA = 'CHANGED_RIGA_BOLLA';
export const SET_SELECTED_RIGA_BOLLA = 'SET_SELECTED_RIGA_BOLLA';
export const TABLE_BOLLA_WILL_SCROLL = 'TABLE_BOLLA_WILL_SCROLL';
export const RESET_BOLLA = 'RESET_BOLLA';
export const TOTALI_CHANGED = 'TOTALI_CHANGED';
import Firebase from 'firebase';
import {prefissoNegozio} from './index';
import {aggiungiRigheBollaMagazzino, eliminaRigheMagazzino} from './magazzino';

function preparaRiga(riga)
   {
     riga['sconto1'] = parseInt(riga['sconto1']) || 0;
     riga['sconto2'] = parseInt(riga['sconto2']) || 0;
     riga['sconto3'] = parseInt(riga['sconto3']) || 0;
      riga['pezzi'] = parseInt(riga['pezzi']) || 0;
      riga['gratis'] = parseInt(riga['gratis']) || 0;
      riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
     riga['prezzoTotale'] = parseFloat(riga['prezzoTotale']).toFixed(2);
   }


export function totaliChanged(bollaId)
{
  return function(dispatch, getState) {
    
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/'  + bollaId + '/totali').on('value', snapshot => {
      dispatch({
        type: TOTALI_CHANGED,
        payload: snapshot.val()
      })
    });
 
}	
}


export function calcolaTotaliSafe(bollaId) 

{return function(dispatch,getState) {

var bollaRef = Firebase.database().ref(prefissoNegozio(getState)+'bolle/' + bollaId); //Puntatore alla bolla corrente
console.log(bollaRef);
bollaRef.transaction(function(bolla) {
 	if (bolla)
	{
	var totalePezzi = 0.0;
	var totaleGratis = 0.0;
	var totaleImporto = 0.0;
  	var righe = bolla['righe'];
  	for(var propt in righe){
    totalePezzi = parseInt(righe[propt].pezzi) + totalePezzi;
    totaleGratis =  parseInt(righe[propt].gratis) + totaleGratis;
    totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
	}
	bolla['totali']  = {'pezzi' : totalePezzi, 'gratis' : totaleGratis, 'prezzoTotale' : totaleImporto.toFixed(2)}; 
    return (bolla);
	}
    else 
       {
        var bollaReset = {'totali' : {'pezzi' : 0, 'gratis' : 0, 'prezzoTotale' : 0}};
        return (bollaReset);
       } 
  },function(){},false);
 
}
}


export function tableBollaWillScroll(scroll) {
  return {
    type: TABLE_BOLLA_WILL_SCROLL,
    scroll
  }
}

export function resetBolla(bolla) {
  return function(dispatch, getState) {
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe').off();
    dispatch({type: RESET_BOLLA});
  }
}



export function aggiungiRigaBolla(bolla,valori) {
  var nuovaRigaBolla = {...valori};
   addCreatedStamp(nuovaRigaBolla);
   preparaRiga(nuovaRigaBolla);
  return function(dispatch,getState) {
    dispatch(tableBollaWillScroll(true));    
    dispatch(calcolaTotaliSafe(bolla));
    var rigaRef = Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe').push()
    dispatch(aggiungiRigheBollaMagazzino(bolla,valori,rigaRef)); //Calcolo prima...
    //var magazzinoList
    //nuovaRigaBolla['listaOggetti'] = magazzinoList;
    //rigaRef.set(nuovaRigaBolla).then(response => {
    //		dispatch(calcolaTotaliSafe(bolla));
    //			 });
  }
}


export function aggiornaRigaBolla(bolla,valori,selectedRigaBollaValues) {
    var nuovaRigaBolla = {...valori};
      addChangedStamp(nuovaRigaBolla);
   preparaRiga(nuovaRigaBolla);
  return function(dispatch,getState) {
  	var selectedRigaBolla = prefissoNegozio(getState) +'bolle/' + bolla + '/righe/' + selectedRigaBollaValues['key'];
     
 
     //Cancello le righe in magazzino della vecchia versione...
    dispatch(eliminaRigheMagazzino(selectedRigaBollaValues['ean'], selectedRigaBollaValues['listaOggetti'], null,'bolla', {'bolla': bolla}));
    //e le aggiungo per la nuova
    //Ultimo parametro dice di aggiornare e non di fare set
    dispatch(aggiungiRigheBollaMagazzino(bolla, valori, selectedRigaBolla, true));
  
  }
}


export function setSelectedRigaBolla(row) {
  return {
    type: SET_SELECTED_RIGA_BOLLA,
    row
  }  
}

//Aggiungo il riferimento alla riga per determinare le righe da cancellare...
export function deleteRigaBolla(bolla, row) {
  return function(dispatch, getState) {
   var id = row['key'];
 
  	var rigaDaCancellare = prefissoNegozio(getState) +'bolle/' + bolla + '/righe/' +id;
   	dispatch(eliminaRigheMagazzino(row['ean'], row['listaOggetti'], rigaDaCancellare, 'bolla', {'bolla': bolla}));
   
    };
  }


export function addedRigaBolla(bolla) {
  return function(dispatch, getState) {
    
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/'  + bolla + '/righe').on('child_added', snapshot => {
      dispatch({
        type: ADDED_RIGA_BOLLA,
        payload: snapshot
      })
    });
  }
}

export function deletedRigaBolla(bolla) {
  return function(dispatch, getState) {
    
    
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe').on('child_removed', snapshot => {
      dispatch({
        type: DELETED_RIGA_BOLLA,
        payload: snapshot
      })
    });
  }
}

export function changedRigaBolla(bolla) {
  return function(dispatch, getState) {
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe').on('child_changed', snapshot => {
      dispatch({
        type: CHANGED_RIGA_BOLLA,
        payload: snapshot
      })
    });
  }
}
