//Isolo la componente di autenticazione per consentire di persistere correttamente solo la parte di stato che deve essere persistita

import {USER_INFO_CHANGED} from '../actions';

const initialState =  {
  info: null,
  user: null,
  authenticated: null //Risolti per sempre i problemi di rimbalzo al reload!!!
};

export default function auth(state = initialState, action) {
  switch (action.type) {
  	
  	 case USER_INFO_CHANGED:
      	return {
      	 ...state,
      	 authenticated: action.authenticated,
        user: action.user,
        info: action.info //Elementi persistiti nel database in corrispondenza all'utente
      	}	
     
      
    default:
      return state;
  }
}

export const isAuthenticated = (state) => {return state.authenticated};
export const getUser = (state) => {return state.user};

