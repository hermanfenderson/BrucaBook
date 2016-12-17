import {addCreatedStamp,addChangedStamp} from '../helpers/firebase';
export const ADDED_RIGA_BOLLA = 'ADDED_RIGA_BOLLA';
export const DELETED_RIGA_BOLLA = 'DELETED_RIGA_BOLLA';
export const CHANGED_RIGA_BOLLA = 'CHANGED_RIGA_BOLLA';
export const SET_SELECTED_RIGA_BOLLA = 'SET_SELECTED_RIGA_BOLLA';
export const TABLE_BOLLA_WILL_SCROLL = 'TABLE_BOLLA_WILL_SCROLL';

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



export function tableBollaWillScroll(scroll) {
  return {
    type: TABLE_BOLLA_WILL_SCROLL,
    scroll
  }
}

export function aggiungiRigaBolla(bolla,valori) {
  var nuovaRigaBolla = {...valori};
   addCreatedStamp(nuovaRigaBolla);
   preparaRiga(nuovaRigaBolla);
  return function(dispatch,getState) {
    dispatch(tableBollaWillScroll(true));    
   
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla).push().set(nuovaRigaBolla).then(response => {
    });
  }
}

export function aggiornaRigaBolla(bolla,valori,selectedRigaBolla) {
  var nuovaRigaBolla = {...valori};
   addChangedStamp(nuovaRigaBolla);
   preparaRiga(nuovaRigaBolla);
  return function(dispatch,getState) {
    
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/' + selectedRigaBolla).update(nuovaRigaBolla).then(response => {
    });
  }
}


export function setSelectedRigaBolla(row) {
  return {
    type: SET_SELECTED_RIGA_BOLLA,
    row
  }  
}


export function deleteRigaBolla(bolla,id) {
  return function(dispatch, getState) {
    
  Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/' +id).remove();
    };
  }


export function addedRigaBolla(bolla) {
  return function(dispatch, getState) {
    
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/'  + bolla).on('child_added', snapshot => {
      dispatch({
        type: ADDED_RIGA_BOLLA,
        payload: snapshot
      })
    });
  }
}

export function deletedRigaBolla(bolla) {
  return function(dispatch, getState) {
    
    
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla).on('child_removed', snapshot => {
      dispatch({
        type: DELETED_RIGA_BOLLA,
        payload: snapshot
      })
    });
  }
}

export function changedRigaBolla(bolla) {
  return function(dispatch, getState) {
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla).on('child_changed', snapshot => {
      dispatch({
        type: CHANGED_RIGA_BOLLA,
        payload: snapshot
      })
    });
  }
}
