/*Devo modificare la gestione dell'autenticazione
Strategia potenziale...
Listener su authInfoChanged.. .
Quando cambia la info sull'utente... triggera una action con il nuovo user nel campo della funzione
1. Action listenAuthStateChange scatena a tempo action authStateChanged. 
2. authStateChanged prende in input user.
Se user è valido chiama Firebase e prende gli elementi di stato collegati allo user (per ora solo catena e libreria)...con una "once" da Firebase. Quando ritorna la once...chiamo userInfoChanged che passa 
allo stato user e tutti gli stati in un oggetto... con type USER_INFO_CHANGED questo mette authenticated a true, user a quello che ho e gli altri elementi di stato corretti.
Se user è null chiamo anche in questo caso userInfoChanged con type USER_INFO_CHANGED. In questo caso metto authenticated a false, user a null e gli elementi di stato corretti...

*/
import Firebase from 'firebase';
import {urlFactory} from '../helpers/firebase';
import {ordiniApertiFA} from './ordiniAperti';

export const USER_INFO_CHANGED = 'USER_INFO_CHANGED';
export const TOGGLE_COLLAPSED = 'TOGGLE_COLLAPSED';

export const STORE_MEASURE = 'STORE_MEASURE';
export const REMOVE_MEASURE = 'REMOVE_MEASURE';
export const SET_HEADER_INFO = 'SET_HEADER_INFO';
export const SET_MENU_SELECTED_KEYS = 'SET_MENU_SELECTED_KEYS';
export const MASTER_DATA_LOADED = 'MASTER_DATA_LOADED';
export const LOCAL_MASTER_DATA_LOADED = 'LOCAL_MASTER_DATA_LOADED';



export function listenAuthStateChanged() {
  return function (dispatch) {
    
    
    Firebase.auth().onAuthStateChanged(user => {
      //Utente loggato
      if (user) {
      	  Firebase.database().ref('utenti/' + user.uid).once('value', snapshot => {
      dispatch({
        type: USER_INFO_CHANGED,
        authenticated: true,
        user: user,
        info: snapshot.val(),
      })
      dispatch(caricaAnagrafiche());
    });
        } 
      //Utente sloggato
      else {
      dispatch({
		type: USER_INFO_CHANGED,
		authenticated: false,
		user: null,
		info: null
  });  
      }
     
    });
  }
}





export function signOutUser() {
  return function(dispatch) {
  	Firebase.auth().signOut().then(function() {
  // Sign-out successful.
  dispatch({
		type: USER_INFO_CHANGED,
		authenticated: false,
		user: null,
		info: null,
  });  
}).catch(function(error) {
  // An error happened. DA IMPLEMENTARE!!!
  
});
 } 
}

export function toggleCollapsed() {
  return function(dispatch, getState) {
     let width = (getState().app.collapsed) ? 200 : 80;
     let viewPortWidth = getState().measures.measures.viewPortWidth;
	 dispatch ({
  		type: TOGGLE_COLLAPSED,
		});
    dispatch(storeMeasure('mainWidth', viewPortWidth - width));		
	dispatch(storeMeasure('siderWidth',width));	
  }	
}



export function storeMeasure(newMeasureName, newMeasureNumber) {
  var newMeasure = {name: newMeasureName, number: newMeasureNumber};
  return function(dispatch, getState) {
  dispatch({
  		allMeasures: getState().measures.measures,
		type: STORE_MEASURE,
		newMeasure: newMeasure
		})
  }
}

export function removeMeasure(measureName) {
  return {
  type: STORE_MEASURE,
  measureName
  }
}

export function setHeaderInfo(headerInfo) {
	return {
		type: SET_HEADER_INFO,
		headerInfo: headerInfo
	}
}	

export function setMenuSelectedKeys(menuSelectedKeys) {
	return {
		type: SET_MENU_SELECTED_KEYS,
		menuSelectedKeys: menuSelectedKeys
	}	
}

export function caricaAnagrafiche() {
	 return function(dispatch, getState) {
	 		Firebase.database().ref('/anagrafiche').once('value', snapshot => {
	 		
	 		dispatch ({type: MASTER_DATA_LOADED, payload: snapshot.val()})	
	 		})
	 		
	 		Firebase.database().ref(urlFactory(getState, 'anagraficheLocali')).on('value', snapshot => {
	 		
	 		dispatch ({type: LOCAL_MASTER_DATA_LOADED, payload: snapshot.val()})	
	 		})
	 		dispatch(ordiniApertiFA.listenItem());
	 		/*
	 		Firebase.database().ref(urlFactory(getState, 'ordiniAperti')).on('child_added', snapshot => {
	 		
	 		dispatch ({type: ORDINI_APERTI_ADDED, payload: snapshot})	
	 		})
	 		
	 		Firebase.database().ref(urlFactory(getState, 'ordiniAperti')).on('child_changed', snapshot => {
	 		
	 		dispatch ({type: ORDINI_APERTI_CHANGED, payload: snapshot})	
	 		})
	 		
	 		Firebase.database().ref(urlFactory(getState, 'ordiniAperti')).on('child_removed', snapshot => {
	 		
	 		dispatch ({type: ORDINI_APERTI_DELETED, payload: snapshot})	
	 		})
	 		*/
	 		
	 		
	  }	
}


export function forzaAggiornaMagazzino() {
	 return function(dispatch, getState) {
//	 	let storicoMagazzinoRef = Firebase.database().ref(urlFactory(getState, 'allStoricoMagazzino'));
//	 	let dateStoricoRef = Firebase.database().ref(urlFactory(getState, 'dateStoricoMagazzino'));
	 	
	 	let magazzinoRef = Firebase.database().ref(urlFactory(getState, 'magazzino'));
	 	Firebase.database().ref(urlFactory(getState, 'registroData')).once('value', snapshot => {
	 				let registroData = Object.entries(snapshot.val());
			    	let eanInfo = {};
			    	//Update a chunk di date...
			    	 for (let i=0; i<registroData.length; i++) 
			        	{
			        	 let rowsData = Object.values(registroData[i][1]);
			        		for (let j=0; j<rowsData.length; j++) 
			        			{
			        	 
			        			let values = rowsData[j]; 
			        			let ean = values.ean;
			        			let pezzi =  (eanInfo[ean]) ? eanInfo[ean].pezzi : 0;
			        			if (values.tipo == "bolle")
				  					{
					    			pezzi = parseInt(values.pezzi) + parseInt(values.gratis)+ pezzi;
					    			}
								 if (values.tipo == "rese")
				  					{
					    			pezzi = pezzi - (parseInt(values.pezzi) + parseInt(values.gratis));
					    			}	
								if (values.tipo == "scontrini")
				  					{
				  					pezzi = pezzi - parseInt(values.pezzi);
					    			}
									
								if (values.tipo == "inventari")
				  					{
				  					pezzi = pezzi + parseInt(values.pezzi);
					    			}
				        		eanInfo[ean] = {ean: (values.ean) ? values.ean : '', 
        													 titolo: (values.titolo) ? values.titolo : '',
        													 autore: (values.autore) ? values.autore : '',
        													 editore: (values.editore) ? values.editore : '',
        													 prezzoListino: (values.prezzoListino) ? values.prezzoListino : 0.00,
        													 categoria: (values.categoria) ? values.categoria : '',
        													 iva: (values.iva) ? values.iva : 'a0',
        													 pezzi: pezzi
        	                                				}
			        			}            				
        				//Qui preparo gli updates specifici della giornata...
			        	let currentData = registroData[i][0];
			        	console.log(currentData);
			        	//storicoMagazzinoRef.child(currentData).update({...eanInfo});
			        	//dateStoricoRef.child(currentData).update(Firebase.database.ServerValue.TIMESTAMP);
			        	
			        //	promises.push(refRadix.child('storicoMagazzino/'+currentData).update({...eanInfo}));
			        	}
			        	magazzinoRef.update({...eanInfo});
			        	//storicoMagazzinoRef.update(updatesStorico);
			        	/*
			        	storicoMagazzinoRef.update(updatesStorico).then(
			        	   dateStoricoRef.update(updatesDateStorico).then(	
			        		magazzinoRef.update({...eanInfo}).then(	dispatch ({type: 'FORZA_AGGIORNA_MAGAZZINO'}))
			        		))
			        	*/	
			        	
	 		})
	 }
}





