
import {FormActions} from '../helpers/formActions';


import Firebase from 'firebase';

//Questa genera i path... e mi dorvrebbe aggiungere flessibilità...
export const SCENE = 'USERMGMT';
export const SUBMIT_EDITED_ITEM_USERMGMT = 'SUBMIT_EDITED_ITEM_USERMGMT' //Override
export const RESET_MAIL_SENT = 'RESET_MAIL_SENT';
export const RESET_MAIL_ERROR = 'RESET_MAIL_ERROR';
export const AUTH_ERROR_SIGNUP = 'AUTH_ERROR_SIGNUP'
export const AUTH_ERROR_NEW_PASSWORD = 'AUTH_ERROR_NEW_PASSWORD'
export const AUTH_ERROR_LOGIN = 'AUTH_ERROR_LOGIN'
export const DISMISS_AUTH_ERROR_LOGIN = 'DISMISS_AUTH_ERROR_LOGIN'

export const DISMISS_AUTH_ERROR_SIGNUP = 'DISMISS_AUTH_ERROR_SIGNUP'
export const DISMISS_AUTH_ERROR_NEW_PASSWORD = 'DISMISS_AUTH_ERROR_NEW_PASSWORD'
export const SET_USERMGMT_MODE = 'SET_USERMGMT_MODE'
export const RESET_USERMGMT_STATE = 'RESET_USERMGMT_STATE'
export const VERIFY_CODE = 'VERIFY_CODE'
export const CODE_OK = 'CODE_OK'
export const CODE_KO = 'CODE_KO'

//METODI DEL FORM
export const verifyCode= (oobCode) =>
{
	return function(dispatch) {
			Firebase.auth().verifyPasswordResetCode(oobCode)
    		 .then(email => {
    		    dispatch({type: CODE_OK, email: email});
			   })
		     .catch(error => {
		     dispatch({type: CODE_KO, error: error});
	      });
		}
}

var loginFAtmp = new FormActions(SCENE);

//Se devo fare override.... definisco metodi alternativi qui...
//Eccone uno...faccio il login

		
loginFAtmp.submitEditedItem = (isValid,credentials, mode, oobCode) => {
if (isValid && mode==='login') return function(dispatch) {
	        
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
		
if (isValid && mode==='signup') return function(dispatch) {
			Firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    		 .then(response => {
    		    dispatch({type: DISMISS_AUTH_ERROR_SIGNUP});
    		    Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
			   })
		     .catch(error => {
		     dispatch({type: AUTH_ERROR_SIGNUP, error: error});
	      });
		}
		
//Gestisco qui il cambio password	

if (isValid && mode==='changePassword') return function(dispatch) {
			var user = Firebase.auth().currentUser;
            var newPassword = credentials.password;

			user.updatePassword(newPassword).then(response => {
			// Update successful.
			dispatch({type: DISMISS_AUTH_ERROR_NEW_PASSWORD});
			}).catch(error => {
			 // An error happened.
			dispatch({type: AUTH_ERROR_NEW_PASSWORD, error: error}); 
			});
			
		}
		
if (isValid && mode==='resetPassword') return function(dispatch) {
		    var newPassword = credentials.password;

			Firebase.auth().confirmPasswordReset(oobCode, newPassword).then(response => {
			// Update successful.
			dispatch({type: DISMISS_AUTH_ERROR_NEW_PASSWORD});
			}).catch(error => {
			 // An error happened.
			dispatch({type: AUTH_ERROR_NEW_PASSWORD, error: error}); 
			});
			
		}
		
if (isValid && mode==='requestPasswordReset') return function(dispatch) {
	 console.log(credentials);
			Firebase.auth().sendPasswordResetEmail(credentials.email, null)
    .then(function() {
      dispatch({type: RESET_MAIL_SENT});
		
    })
    .catch(function(error) {
      // Error occurred. Inspect error.code.
      dispatch({type: RESET_MAIL_ERROR, error: error}); 	
    });
            
	}
return({type: SUBMIT_EDITED_ITEM_USERMGMT});

	
}

export const setMode = (mode) => {
	
	return {
		type: SET_USERMGMT_MODE,
		mode: mode
	}
}

export const resetState = () => {
	
	return {
		type: RESET_USERMGMT_STATE,
		
	}
}

export const loginFA = loginFAtmp;
