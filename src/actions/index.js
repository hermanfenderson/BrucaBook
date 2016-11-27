import request from 'superagent';
import { browserHistory } from 'react-router';
import Firebase from 'firebase';
import { reset as resetForm} from 'redux-form';

export const ADDED_RIGA_BOLLA = 'ADDED_RIGA_BOLLA';
export const DELETED_RIGA_BOLLA = 'DELETED_RIGA_BOLLA';
export const CALCOLA_SCONTO_MAN = 'CALCOLA_SCONTO_MAN';
export const CALCOLA_SCONTO_AUT = 'CALCOLA_SCONTO_AUT';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const REQUEST_GIFS = 'REQUEST_GIFS';
export const FETCH_FAVORITED_GIFS = 'FETCH_FAVORITED_GIFS';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_INFO_RECEIVED = 'AUTH_INFO_RECEIVED';
export const AUTH_USER = 'AUTH_USER';
export const RESET_STATUS = 'RESET_STATUS';
export const SET_EAN_INPUT_REF = 'SET_EAN_INPUT_REF';



const API_URL = 'http://api.giphy.com/v1/gifs/search?q=';
const API_KEY = '&api_key=dc6zaTOxFJmzC';

const config = {
 apiKey: "AIzaSyAfrGzYIIRlmtN50IiChv8raxSKve-a0Sc",
    authDomain: "brucabook.firebaseapp.com",
    databaseURL: "https://brucabook.firebaseio.com",
    storageBucket: "brucabook.appspot.com",
    messagingSenderId: "684965752152"
};

Firebase.initializeApp(config);


 
 
export function toggleScontoMan() {
  return {
    type: CALCOLA_SCONTO_MAN
  }
}

export function toggleScontoAut() {
  return {
    type: CALCOLA_SCONTO_AUT
  }
}

//Questa mi serve a rimettere focus su EAN da fuori
export function setEANInputRef(input) {
     return(
       {type: SET_EAN_INPUT_REF,
       input}
       )
}


//Azioni per la gestione delle righe

//Helper per il prefisso alla base dati...
function prefissoNegozio(getState) 
    {
      return(getState().status.catena + '/' + getState().status.libreria + '/'); 
    }


export function aggiungiRigaBolla(bolla,valori) {
//  const userUid = Firebase.auth().currentUser.uid;
  //var nuovaRigaOrdine = { "ean":valori.ean, "titolo":valori.titolo, "autore":valori.autore, "prezzo":valori.prezzoUnitario, "copie":valori.pezzi, "totale":valori.prezzoTotale};
  var nuovaRigaOrdine = valori;
  nuovaRigaOrdine['createdBy'] = Firebase.auth().currentUser.uid;
  nuovaRigaOrdine['createdAt'] = Firebase.database.ServerValue.TIMESTAMP;
  
  return function(dispatch,getState) {
    
    Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla).push().set(nuovaRigaOrdine).then(response => {
      dispatch(resetForm('rigaBolla'));
    });
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


export function requestGifs(term = null) {
  return function(dispatch) {
    request.get(`${API_URL}${term.replace(/\s/g, '+')}${API_KEY}`).then(response => {
      dispatch({
        type: REQUEST_GIFS,
        payload: response
      });
    });
  }
}

export function favoriteGif({selectedGif}) {
  const userUid = Firebase.auth().currentUser.uid;
  const gifId = selectedGif.id;

  return dispatch => Firebase.database().ref(userUid).update({
    [gifId]: selectedGif
  });
}

export function unfavoriteGif({selectedGif}) {
  const userUid = Firebase.auth().currentUser.uid;
  const gifId = selectedGif.id;

  return dispatch => Firebase.database().ref(userUid).child(gifId).remove();
}

export function fetchFavoritedGifs() {
  return function(dispatch) {
  const userUid = Firebase.auth().currentUser.uid;
  Firebase.database().ref(userUid).on('value', snapshot => {
      dispatch({
        type: FETCH_FAVORITED_GIFS,
        payload: snapshot.val()
      })
    });
  }
}


export function openModal(gif) {
  return {
    type: OPEN_MODAL,
    gif
  }
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  }
}

export function signUpUser(credentials) {
  return function(dispatch) {
    Firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(response => {
        dispatch(authUser());
        browserHistory.push('/favorites');
      })
      .catch(error => {
        console.log(error);
        dispatch(authError(error));
      });
  }
}

export function signInUser(credentials) {
  return function(dispatch) {
    Firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(response => {
        console.log(response);
        dispatch(authUser());
        browserHistory.push('/favorites');
      })
      .catch(error => {
        dispatch(authError(error));
      });
  }
}

export function signOutUser() {
  return function(dispatch) {
  browserHistory.push('/');
  dispatch(resetStatus());
  dispatch(finalizeSignOut());
 } 
}

export function finalizeSignOut()
  {
  return {
  type: SIGN_OUT_USER
  }  
}


export function resetStatus()
  {
  return {
  type: RESET_STATUS
  }  
}
  

export function verifyAuth() {
  return function (dispatch) {
    
    
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(authUser()); 
        dispatch(authInfoReceived());
      } else {
        dispatch(signOutUser());
        dispatch(authInfoReceived());
      }
    });
  }
}


export function authInfoReceived() 
     {
    return {
      type: AUTH_INFO_RECEIVED
    }
}


export function authUser() {
  return {
    type: AUTH_USER
  }
}


export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}