import request from 'superagent';
import { browserHistory } from 'react-router';
import Firebase from 'firebase';
import { reset as resetForm, initialize as initializeForm} from 'redux-form';

import {addCreatedStamp,addChangedStamp} from '../helpers/firebase';

import { purgeLocalStorage } from '../store/configureStore'; //Lo uso per fare reset dello stato persistito nel local store al logout
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

export const SET_USER_STATUS = 'SET_USER_STATUS';
export const RESET_USER_STATUS = 'RESET_USER_STATUS';

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
    
    
    
//Prende nel database la configurazione utente e la passa nello stato, Inzialmente catena e negozio
export function setUserStatus() {
     return function(dispatch) {
  const userUid = Firebase.auth().currentUser.uid;
  Firebase.database().ref('utenti/' + userUid).once('value', snapshot => {
      dispatch({
        type: SET_USER_STATUS,
        payload: snapshot.val()
      })
    });
  }
}

 export function resetUserStatus()
  {
  	return {type: RESET_USER_STATUS}
  }



export function signUpUser(credentials) {
  return function(dispatch) {
    Firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(response => {
        dispatch(authUser());
        browserHistory.push('/');
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
        browserHistory.push('/');
      })
      .catch(error => {
        dispatch(authError(error));
      });
  }
}

export function signOutUser() {
  return function(dispatch) {
  browserHistory.push('/');
  dispatch(resetUserStatus());
 purgeLocalStorage();
  dispatch(finalizeSignOut());
 } 
}

export function finalizeSignOut()
  {
  return {
  type: SIGN_OUT_USER
  }  
}




export function verifyAuth() {
  return function (dispatch) {
    
    
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(authUser()); 
        dispatch(authInfoReceived());
        dispatch(setUserStatus());
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