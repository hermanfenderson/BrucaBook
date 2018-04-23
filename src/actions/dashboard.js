import Firebase from 'firebase';
import {urlFactory} from '../helpers/firebase';
import request from 'superagent';


export const GET_REPORT_DATA = 'GET_REPORT_DATA'
export const REPORT_DATA_ASKED = 'REPORT_DATA_ASKED'
//Questa va riscritta per usare invece una child_changed!!! 
export const getReportData = () =>
{
	return function(dispatch, getState) {
	let url3 = urlFactory(getState,'report',null);

	let libreria = getState().status.libreria;
	let catena = getState().status.catena;
	let url2 = 'https://brucabook.com/report?id=bulk&catena='+catena+'&libreria='+libreria;
    dispatch({
	        type: REPORT_DATA_ASKED,
	        	 });
	request.get(url2).then(
	                  (response) => {Firebase.database().ref(url3).once('child_changed', snapshot => {
	
		dispatch({
	        type: GET_REPORT_DATA,
	        payload: snapshot
	      });      
	})});
	

	
		
	}

	
}
