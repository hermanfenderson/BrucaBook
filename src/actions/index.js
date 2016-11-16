import request from 'superagent';
import { browserHistory } from 'react-router';
import Firebase from 'firebase';
import { reset as resetForm } from 'redux-form';

export const ADDED_RIGA_BOLLA = 'ADDED_RIGA_BOLLA';
export const DELETED_RIGA_BOLLA = 'DELETED_RIGA_BOLLA';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const REQUEST_GIFS = 'REQUEST_GIFS';
export const FETCH_FAVORITED_GIFS = 'FETCH_FAVORITED_GIFS';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_USER = 'AUTH_USER';

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
//Prova amazon

export function ricerca() {
  var amazon = require('amazon-product-api');
  var client = amazon.createClient({
  awsId: "AKIAJ35CCXBI5PGJRGNQ",
  awsSecret: "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",
  awsTag: "brucabook"
  });
  return function(dispatch) {
      client.itemSearch({
            director: 'Quentin Tarantino',
            actor: 'Samuel L. Jackson',
            searchIndex: 'DVD',
            audienceRating: 'R',
            responseGroup: 'ItemAttributes,Offers,Images'
            }).then(function(results){
                    console.log(results);
            }).catch(function(err){
                      console.log(err);
                    });
     
    };
}

  


//Azioni per la gestione delle righe
export function aggiungiRigaBolla(bolla,valori) {
//  const userUid = Firebase.auth().currentUser.uid;
  var nuovaRigaOrdine = { "ean":valori.ean, "titolo":valori.titolo, "autore":valori.autore, "prezzo":valori.prezzo, "copie":valori.copie, "totale":valori.totale};
  return function(dispatch) {
    Firebase.database().ref('bolle/' + bolla).push().set(nuovaRigaOrdine).then(response => {
      dispatch(resetForm('riga-bolla'));
    });
  }
}

export function deleteRigaBolla(bolla,id) {
  return function(dispatch) {
  Firebase.database().ref('bolle/' + bolla + '/' +id).remove();
    };
  }


export function addedRigaBolla(bolla) {
  return function(dispatch) {
    

    Firebase.database().ref('bolle/' + bolla).on('child_added', snapshot => {
      dispatch({
        type: ADDED_RIGA_BOLLA,
        payload: snapshot
      })
    });
  }
}

export function deletedRigaBolla(bolla) {
  return function(dispatch) {
    

    Firebase.database().ref('bolle/' + bolla).on('child_removed', snapshot => {
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

export function fetchFavoritedGifs(user) {
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
        dispatch(authUser());
        browserHistory.push('/favorites');
      })
      .catch(error => {
        dispatch(authError(error));
      });
  }
}

export function signOutUser() {
  browserHistory.push('/');
  return {
    type: SIGN_OUT_USER
  }
}

export function verifyAuth() {
  return function (dispatch) {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(authUser(user));
      } else {
        dispatch(signOutUser());
      }
    });
  }
}

export function authUser(user) {
  return {
    type: AUTH_USER,
    payload: user
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}