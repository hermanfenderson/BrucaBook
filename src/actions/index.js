import request from 'superagent';
import { browserHistory } from 'react-router';
import Firebase from 'firebase';
import { reset as resetForm, initialize as initializeForm} from 'redux-form';

import {addCreatedStamp,addChangedStamp} from '../helpers/firebase';

export const  STORE_MEASURE = 'STORE_MEASURE';
export const REMOVE_MEASURE = 'REMOVE_MEASURE';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const REQUEST_GIFS = 'REQUEST_GIFS';
export const FETCH_FAVORITED_GIFS = 'FETCH_FAVORITED_GIFS';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_INFO_RECEIVED = 'AUTH_INFO_RECEIVED';
export const AUTH_USER = 'AUTH_USER';
export const RESET_STATUS = 'RESET_STATUS';

const API_URL = 'http://api.giphy.com/v1/gifs/search?q=';
const API_KEY = '&api_key=dc6zaTOxFJmzC';






export function storeMeasure(newMeasureName, newMeasureNumber) {
  var newMeasure = {name: newMeasureName, number: newMeasureNumber};
  return {
  type: STORE_MEASURE,
  newMeasure: newMeasure
  }
}

export function removeMeasure(measureName) {
  return {
  type: STORE_MEASURE,
  measureName
  }
}
 
 




//Azioni per la gestione delle righe

//Helper per il prefisso alla base dati...
export function prefissoNegozio(getState) 
    {
      return(getState().status.catena + '/' + getState().status.libreria + '/'); 
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