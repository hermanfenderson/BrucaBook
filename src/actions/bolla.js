import {FormActions} from '../helpers/formActions';

import Firebase from 'firebase';
import {setHeaderInfo} from './index';
//Questa genera i path... e mi dorvrebbe aggiungere flessibilità...
import {urlFactory} from '../helpers/firebase';
import moment from 'moment';
import 'moment/locale/it';


export const TESTATA_BOLLA_CHANGED = 'TESTATA_BOLLA_CHANGED';
export const RESET_BOLLA = 'RESET_BOLLA';
export const SCENE = 'BOLLA';



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
	  const url = urlFactory(getState,"rigaElencoBolle", {'itemId': bolla});
      if (url)
      {
      Firebase.database().ref(url).on('value', snapshot =>
          {
          	const riga = (snapshot.val()) ? {...snapshot.val(), 'key': bolla} : null//Per discernere la cancellazione...
          	dispatch(
          		{
          			type: TESTATA_BOLLA_CHANGED,
          			payload: riga
          		}
          		)
          	 if (riga) dispatch(setHeaderInfo("Acquisti - Doc. " + snapshot.val().riferimento + ' ' 
          						+ snapshot.val().fornitore + ' del ' + moment(snapshot.val().dataDocumento).format("L")));	
          }
      )
      	return(bolla);
      }
      else return(null);
  }
}

export function unlistenTestataBolla(bolla) 
{
return function(dispatch, getState) {
      Firebase.database().ref(urlFactory(getState,"rigaElencoBolle", {'itemId': bolla})).off();
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


