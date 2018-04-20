import Firebase from 'firebase';
import {urlFactory, getServerTime} from '../helpers/firebase';
import request from 'superagent';


export const GET_REPORT_DATA = 'GET_REPORT_DATA'

export const RESET_LISTENING_DASHBOARD = 'RESET_LISTENING_DASHBOARD'

export const getReportData = () =>
{
	return function(dispatch, getState) {
	let url3 = urlFactory(getState,'report',null);

	let libreria = getState().status.libreria;
	let catena = getState().status.catena;
	let url2 = 'https://brucabook.com/report?id=bulk&catena='+catena+'&libreria='+libreria;
    console.log(getServerTime(Firebase.database().ref('/'))());

	request.get(url2).then(
	                  (response) => {Firebase.database().ref(url3).once('child_added', snapshot => {
	
		dispatch({
	        type: GET_REPORT_DATA,
	        payload: snapshot
	      });      
	})});
	

	
		
	}

	
}

export const resetListening = () =>
{
	return ({type: RESET_LISTENING_DASHBOARD})
}
