//Ci metto anche i metodi rigaBolla...

import {addCreatedStamp,addChangedStamp} from '../helpers/firebase';
export const ADDED_RIGA_BOLLA = 'ADDED_RIGA_BOLLA';
export const DELETED_RIGA_BOLLA = 'DELETED_RIGA_BOLLA';
export const CHANGED_RIGA_BOLLA = 'CHANGED_RIGA_BOLLA';
export const TABLE_BOLLA_WILL_SCROLL = 'TABLE_BOLLA_WILL_SCROLL';
export const RESET_BOLLA = 'RESET_BOLLA';
export const TOTALI_CHANGED = 'TOTALI_CHANGED';

//action per il form Rigabolla
export const CHANGE_EDITED_RIGA_BOLLA = 'CHANGE_EDITED_RIGA_BOLLA';
export const SUBMIT_EDITED_RIGA_BOLLA = 'SUBMIT_EDITED_RIGA_BOLLA';
export const SET_SELECTED_RIGA_BOLLA = 'SET_SELECTED_RIGA_BOLLA';
export const RESET_EDITED_RIGA_BOLLA = 'RESET_EDITED_RIGA_BOLLA';


import Firebase from 'firebase';
import {prefissoNegozio} from './index';

//Questa genera i path... e mi dorvrebbe aggiungere flessibilità...
import {urlFactory} from '../helpers/firebase';

//Funzioni VERIFICATE
export function listenTotaliChanged(bollaId)
{
  return function(dispatch, getState) {
    
    Firebase.database().ref(urlFactory(getState,"totaliBolla", {bollaId: bollaId})).on('value', snapshot => {
      dispatch({
        type: TOTALI_CHANGED,
        payload: snapshot.val()
      })
    });
 
}	
}

//Non ritorna nessuna azione e non crea nessuna actionCreator... per coerenza di architettura...
export function offListenTotaliChanged(bollaId)
{   return function(dispatch, getState) {
	Firebase.database().ref(urlFactory(getState,"totaliBolla", {bollaId: bollaId})).off();
    }
}



//Genero tre listener... come un'unica funzione...
export function listenRigaBolla(bollaId) {
  return function(dispatch, getState) {
  	const url = urlFactory(getState,"righeBolla", {bollaId: bollaId});
    Firebase.database().ref(url).on('child_added', snapshot => {
      dispatch({
        type: ADDED_RIGA_BOLLA,
        payload: snapshot
      })
    });
   Firebase.database().ref(url).on('child_changed', snapshot => {
      dispatch({
        type: CHANGED_RIGA_BOLLA,
        payload: snapshot
      })  
   });
   Firebase.database().ref(url).on('child_removed', snapshot => {
      dispatch({
        type: DELETED_RIGA_BOLLA,
        payload: snapshot
      })  
   });
  }
}


//Non ritorna nessuna azione e non crea nessuna actionCreator
export function offListenRigaBolla(bollaId)
{   return function(dispatch, getState) {
	Firebase.database().ref(urlFactory(getState,"righeBolla", {bollaId: bollaId})).off();
    }
}

//Funzione chiamata quando cambia un campo del form...
//Mando un oggetto nel formato... campo e valore
export function changeEditedRigaBolla(name,value) {
   	return {
		type: CHANGE_EDITED_RIGA_BOLLA,
    	name: name,
    	value: value
		}
}

//Azione richiamata sia perchè il campo EAN è stato attivato per "codice breve"
//Sia perchè a campi validi... si può scrivere...

export function submitEditedRigaBolla(isValid, bollaId, valori, selectedItem) {
      return function(dispatch, getState) {
		dispatch({type: SUBMIT_EDITED_RIGA_BOLLA});
		if (selectedItem && isValid) dispatch(aggiornaRigaBolla(bollaId,valori, selectedItem));
		else if(isValid) dispatch(aggiungiRigaBolla(bollaId,valori));
      }
}	


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaRiga(riga)
   {
     riga['sconto1'] = parseInt(riga['sconto1'],10) || 0;
     riga['sconto2'] = parseInt(riga['sconto2'],10) || 0;
     riga['sconto3'] = parseInt(riga['sconto3'],10) || 0;
      riga['pezzi'] = parseInt(riga['pezzi'],10) || 0;
      riga['gratis'] = parseInt(riga['gratis'],10) || 0;
      riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
     riga['prezzoTotale'] = parseFloat(riga['prezzoTotale']).toFixed(2);
   }






//Metodo per fare scrollare la tabella... 
export function tableBollaWillScroll(scroll) {
  return {
    type: TABLE_BOLLA_WILL_SCROLL,
    scroll
  }
}





//Disattivata la componente che opera sul magazzino...
export function aggiungiRigaBolla(bollaId,valori) {
  var nuovaRigaBolla = {...valori};
   addCreatedStamp(nuovaRigaBolla);
   preparaRiga(nuovaRigaBolla);
  return function(dispatch,getState) {
    dispatch(tableBollaWillScroll(true));    //Mi metto alla fine della tabella
    
    //Questa riga è stata modificata.. totali calcolati da una function...
    
    //Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe').push().set(nuovaRigaBolla);
    Firebase.database().ref(urlFactory(getState,"righeBolla", {bollaId: bollaId})).push().set(nuovaRigaBolla);
  	
  }
}

//Idem...
export function aggiornaRigaBolla(bollaId,valori,row) {
    var nuovaRigaBolla = {...valori};
      addChangedStamp(nuovaRigaBolla);
   preparaRiga(nuovaRigaBolla);
     return function(dispatch,getState) {
     var id = row['key'];
   	
    
    Firebase.database().ref(urlFactory(getState,"rigaBolla", {bollaId: bollaId, rigaId: id})).update(nuovaRigaBolla).then(response => {
    });
  }
  
}

//Ripristinata a prima del magazzino...
export function deleteRigaBolla(bollaId,row) {
  return function(dispatch, getState) {
  var id = row['key'];
   
  Firebase.database().ref(urlFactory(getState,"rigaBolla", {bollaId: bollaId, rigaId: id})).remove().then(response => {
  })
    };
  }

//METODI DEL FORM
//Selezionata una riga nella tabella
export function setSelectedRigaBolla(row) {
  return {
    type: SET_SELECTED_RIGA_BOLLA,
    row
  }  
}

export function resetEditedRigaBolla() {
  return {
    type: RESET_EDITED_RIGA_BOLLA,
  }  
}

//Metodo per disattivare gli osservatori quando cambio bolla... e resettare il form... resta solo la seconda parte...
export function resetBolla(bolla) {
  return function(dispatch, getState) {
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe').off();
    //Smetto di osservare anche i totali...
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/'  + bolla + '/totali').off();
    dispatch({type: RESET_BOLLA});
  }
}


//ROBA DA BUTTARE!!!
//Trigger da firebase quando cambiano i totali in bolla... la butto via... perchè devo essere più esplicito...
export function totaliChanged(bollaId)
{
  return function(dispatch, getState) {
    
    Firebase.database().ref(urlFactory(getState,"totaliBolla", {bollaId: bollaId})).on('value', snapshot => {
      dispatch({
        type: TOTALI_CHANGED,
        payload: snapshot.val()
      })
    });
 
}	
}


