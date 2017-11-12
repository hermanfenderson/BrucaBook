import {FormActions} from '../helpers/formActions';

import Firebase from 'firebase';
//Questa genera i path... e mi dorvrebbe aggiungere flessibilità...
import {urlFactory} from '../helpers/firebase';


export const TESTATA_CHANGED_BOLLA = 'TESTATA_CHANGED_BOLLA';
export const RESET_BOLLA = 'RESET_BOLLA';
export const SCENE = 'BOLLA';
export const LISTEN_TESTATA_BOLLA = 'LISTEN_TESTATA_BOLLA';
export const OFF_LISTEN_TESTATA_BOLLA = 'OFF_LISTEN_TESTATA_BOLLA';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
     riga['sconto1'] = parseInt(riga['sconto1'],10) || 0;
     riga['sconto2'] = parseInt(riga['sconto2'],10) || 0;
     riga['sconto3'] = parseInt(riga['sconto3'],10) || 0;
      riga['pezzi'] = parseInt(riga['pezzi'],10) || 0;
      riga['gratis'] = parseInt(riga['gratis'],10) || 0;
      riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
     riga['prezzoTotale'] = parseFloat(riga['prezzoTotale']).toFixed(2);
   }

   

//Mi serve per poter gestire un eventuale cambio data o altre info dalla testata...
export function listenTestataBolla(bolla) 
{
return function(dispatch, getState) {
	  //Mi devo procurare il periodo della bolla...
	  const urlPeriodoBolla = urlFactory(getState,"periodoBolla", {'bollaId': bolla});
	  if (urlPeriodoBolla)
		{
		 Firebase.database().ref(urlPeriodoBolla).once('value', snapshot =>
      		{
      			const anno = snapshot.val().anno;
      			const mese = snapshot.val().mese;
      			 const url = urlFactory(getState,"rigaElencoBolle", {'bollaId': bolla, anno: anno, mese: mese});
      			 if (url)
				      {
				      Firebase.database().ref(url).on('value', snapshot =>
				          {
				          	const riga = (snapshot.val()) ? {...snapshot.val(), 'key': bolla} : null//Per discernere la cancellazione...
				          	dispatch(
				          		{
				          			type: TESTATA_CHANGED_BOLLA,
				          			payload: riga
				          		}
				          		)
				          	 }
				    	  )
			      	dispatch(
			      		{type: LISTEN_TESTATA_BOLLA,
			      		object: {'bollaId': bolla}
			      		}
			      		)
			      	
			    		}
			      else dispatch(
			      		{type: LISTEN_TESTATA_BOLLA,
			      		object: {'bollaId': null}
			      		}
			      		)
			      		})
		}
		else dispatch(
			      		{type: LISTEN_TESTATA_BOLLA,
			      		object: {'bollaId': null}
			      		}
			      		);
  }
}

export function unlistenTestataBolla(bolla) 
{
return function(dispatch, getState) {
      Firebase.database().ref(urlFactory(getState,"rigaElencoBolle", {'bollaId': bolla})).off();
      dispatch(
      	{
      		type: OFF_LISTEN_TESTATA_BOLLA
      	}
      	)
    }	
}

//Metodo per disattivare gli osservatori quando cambio bolla... e resettare il form... resta solo la seconda parte...
export function resetBolla(bolla) {
  return function(dispatch, getState) {
    Firebase.database().ref(urlFactory(getState,"righeBolla", {'bollaId': bolla})).off();
    //Smetto di osservare anche i totali...
    Firebase.database().ref(urlFactory(getState,"totaliBolla", {'bollaId': bolla})).off();
    //E non osservo più la riga di testata...
    Firebase.database().ref(urlFactory(getState,"rigaElencoBolle", {'itemId': bolla})).off();
    
   //DEVO DECIDERE COSA FARE QUI...
    dispatch({type: RESET_BOLLA});
    
  }
}


//METODI DEL FORM
export const rigaBollaFA = new FormActions(SCENE, preparaItem, 'rigaBolla', 'righeBolla','totaliBolla');

//Se devo fare override.... definisco metodi alternativi qui...


