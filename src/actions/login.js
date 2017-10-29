
export const SCENE = 'LOGIN';
export const SUBMIT_EDITED_ITEM_LOGIN = 'SUBMIT_EDITED_ITEM_LOGIN' //Override
import {FormActions} from '../helpers/formActions';


import Firebase from 'firebase';

//Questa genera i path... e mi dorvrebbe aggiungere flessibilità...
import {authUser, authError} from './index';


//METODI DEL FORM
var loginFAtmp = new FormActions(SCENE);

//Se devo fare override.... definisco metodi alternativi qui...
//Eccone uno...faccio il login
loginFAtmp.submitEditedItem = (isValid,credentials) => {
if (isValid) return function(dispatch) {
			dispatch({type: SUBMIT_EDITED_ITEM_LOGIN});
			Firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
    		 .then(response => {
    		    dispatch(authUser());
			   })
		     .catch(error => {
		     dispatch(authError(error));
	      });
		}
}

export const loginFA = loginFAtmp;
