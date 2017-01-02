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
	var totalePezzi = 0;
	var totaleGratis = 0;
	var totaleImporto = 0.0;
  	var righe = bolla['righe'];
  	for(var propt in righe){
    totalePezzi = righe[propt].pezzi + totalePezzi;
    totaleGratis =  righe[propt].gratis + totaleGratis;
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

export function resetBolla() {
	return {
		type: RESET_BOLLA
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
    var magazzinoList = dispatch(aggiungiRigheMagazzino(bolla,valori,rigaRef)); //Calcolo prima...
    nuovaRigaBolla['listaOggetti'] = magazzinoList;
    rigaRef.set(nuovaRigaBolla).then(response => {
    		dispatch(calcolaTotaliSafe(bolla));
    			 });
  }
}

export function aggiungiRigheMagazzino(bolla,valori, rigaBollaRef) {
	 var nuovaRigaBolla = {...valori};
     preparaRiga(nuovaRigaBolla);
     var infoTestata = {'titolo': valori.titolo, 'autore': valori.autore, 'prezzoListino': valori.prezzoListino};
      return function(dispatch,getState) {
 
     var magCodRef = Firebase.database().ref(prefissoNegozio(getState) +'magazzino/' + valori.ean );
     var magOggettiArray = [];
     magCodRef.transaction((magEntry) => 
    	{
    	 var magEntryNew; 
    	 magOggettiArray = [];
    		//Devo appendere a magEntry tutte le righe che mi servono...
    		if (magEntry === null)
    		   {
    		   	magEntryNew =  {...infoTestata};
    		   }
    		else 
    		   {
    		   	magEntryNew = {...magEntry, ...infoTestata}
    		   }
    		//Devo appendere a magEntry tutte le righe che mi servono...
    		var totEntry = parseInt(valori.pezzi) + parseInt(valori.gratis);
    		//Questo mi serve sempòiocemente per generare chiavi...
    		var oggettiRef = Firebase.database().ref(prefissoNegozio(getState) +'magazzino/' + valori.ean + '/oggetti');
    		//Devo inserire qui la gestione degli orfani.... 
    		
    		for (var i=0; i<totEntry; i++)
    		{  if (!magEntryNew['oggetti']) magEntryNew['oggetti'] = {};
    		    var oggettoKey = oggettiRef.push().key;
    		    magOggettiArray.push(oggettoKey);
    		    //Esercizio di "erudizione".... questa è una stupidata... ma devo capirlo meglio
    		    var statoKey = Firebase.database().ref(prefissoNegozio(getState) +'magazzino/' + valori.ean + '/oggetti/' + oggettoKey).push().key;
				magEntryNew.oggetti[oggettoKey] = {'inMagazzino': true, 'stato': 'bolla', 'statoRef': statoKey};
				//Gestisco il prezzo unitario... e le copie gratis....
    			if (i < valori.pezzi) magEntryNew.oggetti[oggettoKey]['prezzoUnitario'] =  valori.prezzoUnitario;
    			else magEntryNew.oggetti[oggettoKey]['prezzoUnitario'] = 0;
    	        //Riga per la gestione dello storico...
    			magEntryNew.oggetti[oggettoKey][statoKey] = {"stato": "bolla", "ref": bolla + "/" + rigaBollaRef.key};
    		}
    		magEntryNew['totali'] = {inMagazzino : 0}
    		for (var oggetto in magEntryNew['oggetti']) {
    			 if (magEntryNew['oggetti'][oggetto]['inMagazzino']) magEntryNew['totali']['inMagazzino']++;
    		}
    
    		
       	return (magEntryNew);	
    	}
     
        )
        
     
     //Aggiorno la testata con le descrizioni... (dati freschi)... ho una key totali che mi dice quanti da vendere e quanti orfani...potro' avere anche altri totali (sono usciti senza che li avessi in magazzino)
     //Ho una key istanze che elenca tutti gli oggetti singolarmente.... ho solo se sono in_magazzino o se sono orfani... e il puntatore e descrizione deall'ultimo stato...
     //Sotto ho gli stati... ad esempio "bolla", "resa", "vendita" ecc... con il riferimento al doc di partenza...
     return (magOggettiArray);
  
   }
}

//Cancello tutti gli oggetti che corrispondono alla riga della bolla che sto cancellando

export function eliminaRigheMagazzino(ean,oggettiDaCancellare) {
  return function(dispatch,getState) {
     var magCodRef = Firebase.database().ref(prefissoNegozio(getState) +'magazzino/' + ean );
     magCodRef.transaction((magEntry) => 
    	{ 
    		if (magEntry)  
    		
    	  {
    	  	
    		var magEntryNew = {...magEntry}
    		for  (var i=0; i < oggettiDaCancellare.length; i++)
    		{
    			//Devo inserire qui la gestione degli orfani.... e tutta la gestione degli stati successivi... 
    			// per ora sto ranzando la riga intera!
    		
    		   delete magEntryNew['oggetti'][oggettiDaCancellare[i]];	
    		}
    		magEntryNew['totali'] = {inMagazzino : 0}
    		for (var oggetto in magEntry['oggetti']) {
    			 if (magEntryNew['oggetti'][oggetto]['inMagazzino']) magEntryNew['totali']['inMagazzino']++;
    		}
    	  }	
    	  else var magEntryNew = 0;
       	return (magEntryNew);	
    	}
     
        )
}
}

export function aggiornaRigaBolla(bolla,valori,selectedRigaBollaValues) {
    var nuovaRigaBolla = {...valori};
    var selectedRigaBolla = selectedRigaBollaValues['key'];
     
   addChangedStamp(nuovaRigaBolla);
   preparaRiga(nuovaRigaBolla);
  return function(dispatch,getState) {
     //Cancello le righe in magazzino della vecchia versione...
    dispatch(eliminaRigheMagazzino(selectedRigaBollaValues['ean'], selectedRigaBollaValues['listaOggetti']));
    dispatch(aggiungiRigheMagazzino(bolla, valori, selectedRigaBolla));
    //e le aggiungo per la nuova
  
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe/' + selectedRigaBolla).update(nuovaRigaBolla).then(response => {
    dispatch(calcolaTotaliSafe(bolla));
    });
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
  	dispatch(eliminaRigheMagazzino(row['ean'], row['listaOggetti']));
   var id = row['key'];
  Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe/' +id).remove().then(response => {
    dispatch(calcolaTotaliSafe(bolla));
  })
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
