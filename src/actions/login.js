
import {FormActions} from '../helpers/formActions';


import Firebase from 'firebase';

//Questa genera i path... e mi dorvrebbe aggiungere flessibilità...
export const SCENE = 'LOGIN';
export const SUBMIT_EDITED_ITEM_LOGIN = 'SUBMIT_EDITED_ITEM_LOGIN' //Override
export const AUTH_ERROR_LOGIN = 'AUTH_ERROR_LOGIN'
export const DISMISS_AUTH_ERROR_LOGIN = 'DISMISS_AUTH_ERROR_LOGIN'
//METODI DEL FORM
var loginFAtmp = new FormActions(SCENE);

//Se devo fare override.... definisco metodi alternativi qui...
//Eccone uno...faccio il login
loginFAtmp.submitEditedItem = (isValid,credentials) => {
if (isValid) return function(dispatch) {
	        
			dispatch({type: SUBMIT_EDITED_ITEM_LOGIN});
			Firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
    		 .then(response => {
    		    dispatch({type: DISMISS_AUTH_ERROR_LOGIN});
    		    if(credentials.remember) Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);
    		    else Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
			   })
		     .catch(error => {
		     dispatch({type: AUTH_ERROR_LOGIN, error: error});
	      });
		}
}

export const loginFA = loginFAtmp;
