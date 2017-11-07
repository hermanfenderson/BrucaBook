
import {FormActions} from '../helpers/formActions';


import Firebase from 'firebase';

//Questa genera i path... e mi dorvrebbe aggiungere flessibilità...
export const SCENE = 'SIGNUP';
export const SUBMIT_EDITED_ITEM_SIGNUP = 'SUBMIT_EDITED_ITEM_SIGNUP' //Override
export const AUTH_ERROR_SIGNUP = 'AUTH_ERROR_LOGIN'
export const DISMISS_AUTH_ERROR_SIGNUP = 'DISMISS_AUTH_ERROR_SIGNUP'
//METODI DEL FORM
var loginFAtmp = new FormActions(SCENE);

//Se devo fare override.... definisco metodi alternativi qui...
//Eccone uno...faccio il login
loginFAtmp.submitEditedItem = (isValid,credentials) => {
if (isValid) return function(dispatch) {
			dispatch({type: SUBMIT_EDITED_ITEM_SIGNUP});
			Firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    		 .then(response => {
    		    dispatch({type: DISMISS_AUTH_ERROR_SIGNUP});
    		    Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
			   })
		     .catch(error => {
		     dispatch({type: AUTH_ERROR_SIGNUP, error: error});
	      });
		}
}

export const loginFA = loginFAtmp;
