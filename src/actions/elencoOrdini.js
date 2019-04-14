import {FormActions} from '../helpers/formActions';
import {setDay} from '../helpers/form';
import {addCreatedStamp, addChangedStamp, urlFactory} from '../helpers/firebase';
import Firebase from 'firebase';

//import {isInternalEAN} from './ean';
export const SCENE = 'ELENCOORDINI';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataDocumento'] = setDay(riga['dataDocumento']);
   	riga['dataCarico'] = setDay(riga['dataCarico']);
   	if (riga['dataRendiconto']) riga['dataRendiconto'] = setDay(riga['dataRendiconto']);
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	if ('totali' in riga) {delete riga.totali}
   	
    
     }



//Mi serve per poter gestire un eventuale cambio info cliente..
this.listenCliente = (params, itemId) =>  
{
const rigaClienteUrl = this.rigaClienteUrl;
const typeClienteChanged = this.CLIENTE_CHANGED;
const typeListenCliente = this.LISTEN_CLIENTE;

return function(dispatch, getState) {
	  //semplicemente mi aggancio alla testata...

	   
	  const url = urlFactory(getState,rigaClienteUrl, params, itemId);
			      			 if (url)
							      {
							      Firebase.database().ref(url).on('value', snapshot =>
							          {
							          	const riga = (snapshot.val()) ? {...snapshot.val(), 'key': itemId} : null//Per discernere la cancellazione...
							          	dispatch(
							          			{
							          			type: typeClientehanged,
							          			payload: riga
							          			}
							          			)
							          	 }
							    	  )
						      	dispatch(
						      		{type: typeListenCliente,
						      		object: {params: params, itemId: itemId}
						      		}
						      		)
						      	
						    		}
						      else dispatch(
						      		{type: typeListenCliente,
						      		object: null
						      		}
						      		)
	   
  }
}







//METODI DEL FORM
export const ordineFA = new FormActions(SCENE, preparaItem, 'righeElencoOrdini');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...





	

