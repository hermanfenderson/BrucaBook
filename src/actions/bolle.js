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

//Prepara riga con zeri ai fini della persistenza... resta così
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

//Trigger da firebase quando cambiano i totali in bolla... resta così??? Capire come funziona
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



//Metodo per fare scrollare la tabella... 
export function tableBollaWillScroll(scroll) {
  return {
    type: TABLE_BOLLA_WILL_SCROLL,
    scroll
  }
}

//Metodo per disattivare gli osservatori quando cambio bolla... 
export function resetBolla(bolla) {
  return function(dispatch, getState) {
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe').off();
    //Smetto di osservare anche i totali...
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/'  + bolla + '/totali').off();
    dispatch({type: RESET_BOLLA});
  }
}


//Disattivata la componente che opera sul magazzino...
export function aggiungiRigaBolla(bolla,valori) {
  var nuovaRigaBolla = {...valori};
   addCreatedStamp(nuovaRigaBolla);
   preparaRiga(nuovaRigaBolla);
  return function(dispatch,getState) {
    dispatch(tableBollaWillScroll(true));    //Mi metto alla fine della tabella
    
    //Questa riga è stata modificata.. totali calcolati da una function...
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe').push().set(nuovaRigaBolla);
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

//Ripristinata a prima del magazzino...
export function deleteRigaBolla(bolla,row) {
  return function(dispatch, getState) {
  var id = row['key'];
   
  Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe/' +id).remove().then(response => {
  })
    };
  }

//Selezionata una riga nella tabella
export function setSelectedRigaBolla(row) {
  return {
    type: SET_SELECTED_RIGA_BOLLA,
    row
  }  
}



//Questa è ragionevolmente OK
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

//Idem
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

//Idem
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
