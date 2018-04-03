import {caricaAnagrafiche} from '../actions';
import {FormActions} from '../helpers/formActions';
import {urlFactory} from '../helpers/firebase';

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
export const USER_CONFIGURATION_CHANGED = 'USER_CONFIGURATION_CHANGED'
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
		
if (isValid && mode==='configuration') return function(dispatch, getState) {
	         let infoUser = {nick: credentials.nick, imgFirebaseUrl: credentials.imgFirebaseUrl};
	         if (credentials.libreria) 
	        	{   let libreria = credentials.libreria.split("/");
	        		infoUser.defaultCatena = libreria[0];
	        		infoUser.defaultLibreria = libreria[1];
	        	
	        	}
	         let uid = Firebase.auth().currentUser.uid;
	         Firebase.database().ref('/utenti/'+uid).update(infoUser).then(
	         	snapshot =>
	         		{ //Ho toccato i parametri utente...
	         		//Ricarico il magazzino
	         			Firebase.database().ref(urlFactory(getState,'magazzino', null)).off();
	         			dispatch({type: 'RESET_MAGAZZINO'});
	         			Firebase.database().ref(urlFactory(getState,'righeElencoInventari', null)).off();
	         			dispatch({type: 'RESET_ELENCOINVENTARI'});
	         			Firebase.database().ref(urlFactory(getState,'fornitori', null)).off();
	         			dispatch({type: 'RESET_FORNITORI'});
	         			if (getState().elencoBolle.listeningItem) 
	         				{
	         				Firebase.database().ref(urlFactory(getState,'righeElencoBolle', getState().elencoBolle.listeningItem )).off();
	         				dispatch({type: 'RESET_ELENCOBOLLE'});
	         				}
	         			if (getState().elencoCasse.listeningItem) 
	         				{Firebase.database().ref(urlFactory(getState,'righeElencoCasse', getState().elencoCasse.listeningItem)).off();
	         				dispatch({type: 'RESET_ELENCOCASSE'});
	         				}
	         			if (getState().elencoRese.listeningItem) 
	         				{Firebase.database().ref(urlFactory(getState,'righeElencoRese', getState().elencoRese.listeningItem)).off();
	         				dispatch({type: 'RESET_ELENCORESE'});
	         				}
	         		    dispatch({type: 'RESET_LISTENING_DASHBOARD'});
	         			dispatch({type: USER_CONFIGURATION_CHANGED, info: infoUser})
	         			dispatch(caricaAnagrafiche());
    
	         			
	         		}
	         	
	         	)
	        	
	    		    			
		
		}		
		
if (isValid && mode==='signup') return function(dispatch) {
			Firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
    		 .then(response => {
	    		 	//Qui inserisco la creazione dei dati accessori...
	    		 	let uid = response.uid;
	    		 	//Una query per cercare il default della libreria...
	    		 	Firebase.database().ref('/librerie').once('value', snapshot => 
	    		 				{
	    		 				let elenco = snapshot.val();
	    		 				let defaultCatena = elenco.defaultCatena;
	    		 				let defaultLibreria= elenco.defaultLibreria;
	    					    let infoUser = {'nome': credentials.nome, 
	    					    			    'cognome': credentials.cognome,
	    					    				'email': credentials.email,
	    					    				'nick': credentials.nick,
	    					    				'defaultCatena': defaultCatena,
	    					    				'defaultLibreria': defaultLibreria,
	    					    				'elencoLibrerie': {[defaultCatena]:  
	    					    					
	    					    					{'nome': elenco.elencoLibrerie[defaultCatena].nome,
	    					    					 'librerie': {[defaultLibreria]: elenco.elencoLibrerie[defaultCatena].librerie[defaultLibreria]}
	    					    					 }
	    					    					}
	    					    				
	    					    				}	
	    					    Firebase.database().ref('/utenti/'+uid).set(infoUser); //Scrivo i dati utente...				
	    		    			dispatch({type: DISMISS_AUTH_ERROR_SIGNUP});
	    		    			Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
	    						});
	    		 	
					})
		     .catch(error => {
		     dispatch({type: AUTH_ERROR_SIGNUP, error: error});
	      });
		}
		
//Gestisco qui il cambio password	

if (isValid && mode==='changePassword') return function(dispatch) {
			var user = Firebase.auth().currentUser;
            var newPassword = credentials.password;
            var oldPassword = credentials.oldPassword;
            var email = credentials.email;
            var credential = Firebase.auth.EmailAuthProvider.credential(email,oldPassword);
            user.reauthenticateWithCredential(credential)
    		 .then(response => {
    		 	user.updatePassword(newPassword).then(response => {
			// Update successful.
			dispatch({type: DISMISS_AUTH_ERROR_NEW_PASSWORD});
			}).catch(error => {
			 // An error happened.
			dispatch({type: AUTH_ERROR_NEW_PASSWORD, error: error}); 
			});
    		    })
		     .catch(error => {
		     dispatch({type: AUTH_ERROR_LOGIN, error: error});
		     
	      });
	      /*
			user.updatePassword(newPassword).then(response => {
			// Update successful.
			dispatch({type: DISMISS_AUTH_ERROR_NEW_PASSWORD});
			}).catch(error => {
			 // An error happened.
			dispatch({type: AUTH_ERROR_NEW_PASSWORD, error: error}); 
			});
		*/
		
			
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
