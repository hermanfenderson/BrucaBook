import {FormActions} from '../helpers/formActions';
import {addCreatedStamp,addChangedStamp, urlFactory} from '../helpers/firebase';
import Firebase from 'firebase';

export const SCENE = 'RESA';
export const LISTEN_BOLLE_PER_FORNITORE = 'LISTEN_BOLLE_PER_FORNITORE';
export const ADDED_BOLLE_PER_FORNITORE = 'ADDED_BOLLE_PER_FORNITORE';
export const CHANGED_BOLLE_PER_FORNITORE = 'CHANGED_BOLLE_PER_FORNITORE';
export const DELETED_BOLLE_PER_FORNITORE = 'DELETED_BOLLE_PER_FORNITORE';

export const UNLISTEN_BOLLE_PER_FORNITORE = 'UNLISTEN_BOLLE_PER_FORNITORE';

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

   
export function listenBollePerFornitore(idFornitore)
{
	
//Genero tre listener... come un'unica funzione...

   
   return function(dispatch, getState) {
  	const url = urlFactory(getState,'bollePerFornitore', idFornitore);
  	if (url)
    {  
       const listener_added = Firebase.database().ref(url).on('child_added', snapshot => {
	      dispatch({
	        type: ADDED_BOLLE_PER_FORNITORE,
	        payload: snapshot
	      })
	    });
	   const listener_changed = Firebase.database().ref(url).on('child_changed', snapshot => {
	      dispatch({
	        type: CHANGED_BOLLE_PER_FORNITORE,
	        payload: snapshot
	      })  
	   });
	   const listener_removed = Firebase.database().ref(url).on('child_removed', snapshot => {
	      dispatch({
	        type: DELETED_BOLLE_PER_FORNITORE,
	        payload: snapshot
	      })  
	   });
	   dispatch({
	   	type: LISTEN_BOLLE_PER_FORNITORE,
	   	params: idFornitore,
	   	listeners: {added: listener_added,changed: listener_changed, removed: listener_removed} 
	   })
	}   
	else dispatch({
	   	type: LISTEN_BOLLE_PER_FORNITORE,
	   	params: null,
	   })   
  }
  
}

export function unlistenBollePerFornitore(idFornitore)
{
return function(dispatch, getState) {	
	Firebase.database().ref(urlFactory(getState,'bollePerFornitore', idFornitore)).off();
		dispatch({
		   	type: UNLISTEN_BOLLE_PER_FORNITORE,
		   	params: idFornitore
		   })

	}
}	   

//METODI DEL FORM
//Il true... indica che voglio la gestione dello stock nei messaggi informativi
export const rigaResaFA = new FormActions(SCENE, preparaItem, 'righeResa','righeElencoRese', true);

//Se devo fare override.... definisco metodi alternativi qui...




rigaResaFA.aggiungiItem = (params, valori) => {
  const typeAdd =  rigaResaFA.ADD_ITEM;
  var nuovoItem = {...valori};
  const itemsUrl = rigaResaFA.itemsUrl;
  const stockMessageQueue = rigaResaFA.stockMessageQueue;
  const stockMessageQueueListener = rigaResaFA.stockMessageQueueListener;
  const toggleTableScroll = rigaResaFA.toggleTableScroll;
   addCreatedStamp(nuovoItem);
   rigaResaFA.preparaItem(nuovoItem);
    return function(dispatch,getState) {
   
   dispatch(toggleTableScroll(true));    //Mi metto alla fine della tabella
   var ref; 
    ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params)).push();
    ref.set(nuovoItem);
   /* 
   var ref2;
    ref2  = Firebase.database().ref(urlFactory(getState,itemsUrl, params)).push();
   */
    
   dispatch(
   	{
   		type: typeAdd,
   		key: ref.key
   	}
   	)  	
   if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));	
   return(ref.key);
  }
  
}

rigaResaFA.aggiornaItem = (params,itemId, valori) => {
    const typeChange = rigaResaFA.CHANGE_ITEM;
 	 const stockMessageQueue = rigaResaFA.stockMessageQueue;
 const stockMessageQueueListener = rigaResaFA.stockMessageQueueListener;
  
    var nuovoItem = {...valori};
      addChangedStamp(nuovoItem);
   rigaResaFA.preparaItem(nuovoItem);
    const itemsUrl = rigaResaFA.itemsUrl;
      return function(dispatch,getState) {

    const ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params, itemId));
    ref.update(nuovoItem);
    dispatch(
   	{
   		type: typeChange,
   		key: ref.key
   	}
   	)  	 
   	if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));
   	 return(itemId); 
  }
 
}




//Una forzatura chiedere ean come parametro aggiuntivo in alcuni casi......ma mi evito una chiamata del tutto inutile
rigaResaFA.deleteItem = (params, itemId, valori=null) => {
const typeDelete = rigaResaFA.DELETE_ITEM;
const itemsUrl = rigaResaFA.itemsUrl;
const stockMessageQueue = rigaResaFA.stockMessageQueue;
 const stockMessageQueueListener = rigaResaFA.stockMessageQueueListener;
  

  return function(dispatch, getState) {
    Firebase.database().ref(urlFactory(getState,itemsUrl,params, itemId)).remove();
     dispatch(
					{
   					type: typeDelete,
   					key: itemId
   					}
   					)   
   	if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));				
    };
  }
	