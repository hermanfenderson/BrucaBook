/*Devo modificare la gestione dell'autenticazione
Strategia potenziale...
Listener su authInfoChanged.. .
Quando cambia la info sull'utente... triggera una action con il nuovo user nel campo della funzione
1. Action listenAuthStateChange scatena a tempo action authStateChanged. 
2. authStateChanged prende in input user.
Se user è valido chiama Firebase e prende gli elementi di stato collegati allo user (per ora solo catena e libreria)...con una "once" da Firebase. Quando ritorna la once...chiamo userInfoChanged che passa 
allo stato user e tutti gli stati in un oggetto... con type USER_INFO_CHANGED questo mette authenticated a true, user a quello che ho e gli altri elementi di stato corretti.
Se user è null chiamo anche in questo caso userInfoChanged con type USER_INFO_CHANGED. In questo caso metto authenticated a false, user a null e gli elementi di stato corretti...

*/
import Firebase from 'firebase';


export const STORE_MEASURE = 'STORE_MEASURE';
export const REMOVE_MEASURE = 'REMOVE_MEASURE';

export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_USER = 'AUTH_USER';
export const USER_INFO_CHANGED = 'USER_INFO_CHANGED';




export function listenAuthStateChanged() {
  return function (dispatch) {
    
    
    Firebase.auth().onAuthStateChanged(user => {
      //Utente loggato
      if (user) {
      	  Firebase.database().ref('utenti/' + user.uid).once('value', snapshot => {
      dispatch({
        type: USER_INFO_CHANGED,
        authenticated: true,
        user: user,
        info: snapshot.val(),
      })
    });
        } 
      //Utente sloggato
      else {
      dispatch({
		type: USER_INFO_CHANGED,
		authenticated: false,
		user: null,
		info: null
  });  
      }
     
    });
  }
}

export function storeMeasure(newMeasureName, newMeasureNumber) {
  var newMeasure = {name: newMeasureName, number: newMeasureNumber};
  return function(dispatch, getState) {
  dispatch({
  type: STORE_MEASURE,
  newMeasure: newMeasure,
  allMeasures: getState().measures.measures
  });
};
}

export function removeMeasure(measureName) {
  return {
  type: STORE_MEASURE,
  measureName
  }
}
 
 




//Azioni per la gestione delle righe

 

export function signUpUser(credentials) {
  return function(dispatch) {
    Firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(response => {
        dispatch(authUser());
      })
      .catch(error => {
        dispatch(authError(error));
      });
  }
}

export function signInUser(credentials) {
  return function(dispatch) {
    Firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(response => {
        dispatch(authUser());
      })
      .catch(error => {
        dispatch(authError(error));
      });
  }
}

export function signOutUser() {
  return function(dispatch) {
  	Firebase.auth().signOut().then(function() {
  // Sign-out successful.
  dispatch({
		type: USER_INFO_CHANGED,
		authenticated: false,
		user: null,
		info: null,
  });  
}).catch(function(error) {
  // An error happened.
});
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