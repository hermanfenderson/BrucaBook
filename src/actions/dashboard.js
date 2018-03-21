import Firebase from 'firebase';
import {urlFactory} from '../helpers/firebase';


export const GET_REGISTRO_DATA = 'GET_REGISTRO_DATA'

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
