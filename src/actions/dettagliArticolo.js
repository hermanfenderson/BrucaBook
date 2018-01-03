import Firebase from 'firebase';
import {urlFactory} from '../helpers/firebase'

export const LISTEN_EAN = 'LISTEN_EAN'
export const ITEM_DETAILS = 'ITEM_DETAILS'
export const ITEM_HEADER = 'ITEM_HEADER'
export const OFF_LISTEN_EAN = 'OFF_LISTEN_EAN'

export const listenEAN = (ean) =>
{
	return function(dispatch,getState) 
	{
	const url = urlFactory(getState,'registroEAN', null, ean);
	Firebase.database().ref(url).on('value', snapshot => {
       dispatch({
       	type: 'ITEM_DETAILS',
       	payload: snapshot 
       })
	})
	const url2 = urlFactory(getState,'magazzino', null, ean);
	Firebase.database().ref(url2).on('value', snapshot => {
       dispatch({
       	type: 'ITEM_HEADER',
       	payload: snapshot 
       })
	})
	dispatch({type: 'LISTEN_EAN',
		     ean: ean
	})
	}
}

export const offListenEAN = (ean) =>
{
	return function(dispatch,getState)  
	{
	const url = urlFactory(getState,'registroEAN', null, ean);
	const url2 = urlFactory(getState,'magazzino', null, ean);
	
	Firebase.database().ref(url).off();
	Firebase.database().ref(url2).off();
	
		dispatch({type: 'OFF_LISTEN_EAN',
		})
	}	
	
}
