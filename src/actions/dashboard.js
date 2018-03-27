import Firebase from 'firebase';
import {urlFactory} from '../helpers/firebase';


export const GET_REGISTRO_DATA = 'GET_REGISTRO_DATA'
export const RESET_LISTENING_DASHBOARD = 'RESET_LISTENING_DASHBOARD'
export const getRegistroData = () =>
{
	return function(dispatch, getState) {
	let url = urlFactory(getState,'registroData',null);
	Firebase.database().ref(url).once('value', snapshot => {
	
		dispatch({
	        type: GET_REGISTRO_DATA,
	        payload: snapshot
	      });
		
		})
	}

	
}

export const resetListening = () =>
{
	return ({type: RESET_LISTENING_DASHBOARD})
}
