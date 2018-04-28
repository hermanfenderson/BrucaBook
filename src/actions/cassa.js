import {FormActions} from '../helpers/formActions';
import Firebase from 'firebase';
import {urlFactory, addCreatedStamp,addChangedStamp} from '../helpers/firebase';

import moment from 'moment';
export const SCENE = 'CASSA';
export const ADDED_RIGASCONTRINO = 'ADDED_RIGASCONTRINO';
export const CHANGED_RIGASCONTRINO = 'CHANGED_RIGASCONTRINO';
export const DELETED_RIGASCONTRINO = 'DELETED_RIGASCONTRINO';
export const LISTEN_RIGASCONTRINO = 'LISTEN_RIGASCONTRINO';
export const OFF_LISTEN_RIGASCONTRINO = 'OFF_LISTEN_RIGASCONTRINO';

//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
   	riga['oraScontrino'] = riga['oraScontrino'].valueOf();
   	//Questi vengono calcolati... oppure servono a visualizzre...
   	if ('totali' in riga) {delete riga.totali};
    if ('tipo' in riga) {delete riga.tipo};
     
   }

   



//METODI DEL FORM anche qui visualizzo i totali...
export const cassaFA = new FormActions(SCENE, preparaItem, 'righeElencoScontrini','righeElencoCasse');


//Se devo fare override.... definisco metodi alternativi qui...
//Devo proprio scriverla del tutto diversa...
cassaFA.aggiungiItem = (params, valori) => {
	//Prendo il numero scontrino e la data cassa dalla cassa madre...
	const anno = params[0];
	const mese = params[1];
	const cassa = params[2];
	var numero = null;
	var dataCassa = null;
	var oraScontrino = null;
	var numeroCassa = null;	
	return function(dispatch,getState) 
	   {
	   	const ref = Firebase.database().ref(urlFactory(getState,'righeElencoScontrini', [anno,mese,cassa])).push();
	   	const refCassa = Firebase.database().ref(urlFactory(getState,'righeElencoCasse',[anno,mese],cassa));
		refCassa.transaction( function(cassa) {
    		if (cassa) 
    			{
    			cassa.ultimoScontrino++;
    			numero = cassa.ultimoScontrino;
    			dataCassa = cassa.dataCassa;
    			numeroCassa = cassa.cassa;
    			oraScontrino = moment(dataCassa);
    			oraScontrino.hour(moment().hour());
    			oraScontrino.minute(moment().minute());
    			}
    		return cassa;
			}).then(function(success) {
			valori.cassa = numeroCassa;
			valori.numero = numero;
			valori.dataCassa = dataCassa;
			valori.oraScontrino = oraScontrino.valueOf();
			const typeAdd =  cassaFA.ADD_ITEM;
			var nuovoItem = {...valori}; //Fix del baco in cancellazione di scontrino vuoto...
	        addCreatedStamp(nuovoItem);
			preparaItem(nuovoItem);
			nuovoItem['totali'] = {pezzi: 0, prezzoTotale: '0.00'};
			const toggleTableScroll = cassaFA.toggleTableScroll;
			dispatch(toggleTableScroll(true));    //Mi metto alla fine della tabella
    	    //ref  = Firebase.database().ref(urlFactory(getState,'righeElencoScontrini', [anno,mese,cassa])).push();
    		ref.set(nuovoItem);
			dispatch(
   					{
   					type: typeAdd,
   					key: ref.key
   					}
   					)  	
			nuovoItem['key'] = ref.key;
			nuovoItem.oraScontrino = moment(nuovoItem.oraScontrino).format('HH:mm');
			dispatch(cassaFA.setSelectedItem(nuovoItem));
			
			})
           

			//Non mi serve chiamare la funzione originale...
			//dispatch(aggiungiItemSuper(params, valori));
		return(ref.key);
		}
}

cassaFA.aggiornaItem = (params,itemId, valori) => {
	//Prendo la data cassa dalla cassa madre...
	//Neu valori... trovo anche il vecchio numeroScontrino... che poi dovro' togliere...
	const anno = params[0];
	const mese = params[1];
	const cassa = params[2];
	const oldNumero = valori['oldNumero'];
	const numeroKey = valori['numeroKey'];
   
	delete valori['oldNumero']; //Non mi serve più
	delete valori['numeroKey']; //Non mi serve più
	
	
	const numero = valori['numero'];

	return function(dispatch,getState) 
	   {
	   	const refCassa = Firebase.database().ref(urlFactory(getState,'righeElencoCasse',[anno,mese],cassa));
	   		var ref; 
		refCassa.transaction( function(cassa) {
    		if (cassa) 
    			{
    			if (numero > cassa.ultimoScontrino) cassa.ultimoScontrino = numero;
    			}
    		return cassa;
			}).then(function(success) {
		   //Se devo swappare i numeri lo faccio qui...
			
		   		
		   const typeChange =  cassaFA.CHANGE_ITEM;
			var nuovoItem = {...valori};
			addChangedStamp(nuovoItem);
			preparaItem(nuovoItem);
  
			ref  = Firebase.database().ref(urlFactory(getState,'righeElencoScontrini', [anno,mese,cassa], itemId));
           ref.update(nuovoItem);
			dispatch(
   					{
   					type: typeChange,
   					key: ref.key
   					}
   					)  	
			nuovoItem['key'] = ref.key;
			nuovoItem.oraScontrino = moment(nuovoItem.oraScontrino).format('HH:mm');
		
			dispatch(cassaFA.setSelectedItem(nuovoItem));
			
			
			
			})
            	if (numeroKey)
				{
				ref  = Firebase.database().ref(urlFactory(getState,'righeElencoScontrini', [anno,mese,cassa], numeroKey));	
				ref.update({'numero' : oldNumero});	
				}
		

            
			//Non mi serve chiamare la funzione originale...
			//dispatch(aggiungiItemSuper(params, valori));
		
		}
}


cassaFA.deleteItem = (params, itemId) => {
const typeDelete = cassaFA.DELETE_ITEM;


  return function(dispatch, getState) {
    Firebase.database().ref(urlFactory(getState,'righeElencoScontrini',params, itemId)).remove();
     dispatch(
					{
   					type: typeDelete,
   					key: itemId
   					}
   					) 
   					
   	dispatch(cassaFA.setSelectedItem(null));
	//Aggiorno ultimoScontrino a ultimo valore utile...
	const anno = params[0];
	const mese = params[1];
	const cassa = params[2];

	const refCassa = Firebase.database().ref(urlFactory(getState,'righeElencoCasse',[anno,mese],cassa));
		refCassa.transaction( function(cassa) {
    		if (cassa) 
    			{
    			const refScontrini = Firebase.database().ref(urlFactory(getState,'righeElencoScontrini',params));
    			let ultimoScontrinoAttuale = 0;
    			refScontrini.once('value', snapshot => {
    				let scontrini = snapshot.val();
    				for (var propt in scontrini) {if (scontrini[propt].numero > ultimoScontrinoAttuale) ultimoScontrinoAttuale = scontrini[propt].numero;}
    				});
    			cassa.ultimoScontrino = ultimoScontrinoAttuale;
    			}
    		return cassa;
			})
    };
  }
	

const listenRigheScontrino = (cassaParams, scontrinoKey) =>
{
//Genero tre listener... come un'unica funzione...

 const type1 = ADDED_RIGASCONTRINO;
   const type2 = CHANGED_RIGASCONTRINO;
   const type3 = DELETED_RIGASCONTRINO;
   const typeListen = LISTEN_RIGASCONTRINO;
   
   const itemsUrl = 'righeScontrino';	
   const params = [...cassaParams]
   params.push(scontrinoKey);
   
   return function(dispatch, getState) {
  	const url = urlFactory(getState,itemsUrl, params);
  	if (url)
    {  
       const listener_added = Firebase.database().ref(url).on('child_added', snapshot => {
	      dispatch({
	        type: type1,
	        payload: snapshot
	      })
	    });
	   const listener_changed = Firebase.database().ref(url).on('child_changed', snapshot => {
	      dispatch({
	        type: type2,
	        payload: snapshot
	      })  
	   });
	   const listener_removed = Firebase.database().ref(url).on('child_removed', snapshot => {
	      dispatch({
	        type: type3,
	        payload: snapshot
	      })  
	   });
	   dispatch({
	   	type: typeListen,
	   	params: params,
	   	listeners: {added: listener_added,changed: listener_changed, removed: listener_removed} 
	   })
	}   
	else dispatch({
	   	type: typeListen,
	   	params: null,
	   })   
  }



};


//Smetto di ascoltare tutto... qui ci vado perchè ho cancellato lo scontrino...oppure perchè cambio cassa...
const offListenRigheScontrino = (cassaParams, scontrinoKey) =>
{  
    const typeUnlisten = OFF_LISTEN_RIGASCONTRINO;
   const itemsUrl = 'righeScontrino';	
   const params = [...cassaParams]
   params.push(scontrinoKey);
 	return function(dispatch, getState) {
	Firebase.database().ref(urlFactory(getState,itemsUrl, params)).off();
	dispatch({
	   	type: typeUnlisten,
	   	params: params
	   })
    }
}

//Genero tre listener... come un'unica funzione...
cassaFA.listenItem = (params) => {
 const type1 = cassaFA.ADDED_ITEM;
   const type2 = cassaFA.CHANGED_ITEM;
   const type3 = cassaFA.DELETED_ITEM;
   const typeListen = cassaFA.LISTEN_ITEM;
   
   const itemsUrl = cassaFA.itemsUrl;	
  return function(dispatch, getState) {
  	const url = urlFactory(getState,itemsUrl, params);
  	if (url)
    {  
       const listener_added = Firebase.database().ref(url).on('child_added', snapshot => {
	      dispatch({
	        type: type1,
	        payload: snapshot
	      });
	      //Su added... mi metto ad ascoltare i figli...tutti e 3 i tipi...
	      dispatch(listenRigheScontrino(params, snapshot.key));
	      
	    });
	   const listener_changed = Firebase.database().ref(url).on('child_changed', snapshot => {
	      dispatch({
	        type: type2,
	        payload: snapshot
	      });
	     //Su changed... non devo fare nulla... 
	      
	   });
	   const listener_removed = Firebase.database().ref(url).on('child_removed', snapshot => {
	      dispatch({
	        type: type3,
	        payload: snapshot
	      });
	    //Su deleted... devo smettere di ascoltare i figli...e li cancellerò poi dalla tabella...   
	    dispatch(offListenRigheScontrino(params, snapshot.key));
	     
	   });
	   dispatch({
	   	type: typeListen,
	   	params: params,
	   	listeners: {added: listener_added,changed: listener_changed, removed: listener_removed} 
	   })
	}   
	else dispatch({
	   	type: typeListen,
	   	params: null,
	   })   
  }
}

//Quando smetto di ascoltare... dovrò smettere di ascoltare tutti i figli... va cambiata...
//Non ritorna nessuna azione e non crea nessuna actionCreator
cassaFA.offListenItem = (params, listeners=null) =>
{   const itemsUrl = cassaFA.itemsUrl;
    const typeUnlisten = cassaFA.OFF_LISTEN_ITEM;
	return function(dispatch, getState) {
	if (listeners) 
		{
			Firebase.database().ref(urlFactory(getState,itemsUrl, params)).off(listeners.added);
			Firebase.database().ref(urlFactory(getState,itemsUrl, params)).off(listeners.changed);
			Firebase.database().ref(urlFactory(getState,itemsUrl, params)).off(listeners.removed);
		}
	else Firebase.database().ref(urlFactory(getState,itemsUrl, params)).off();
	//INSERIRE LA CANCELLAZIONE DI TUTTI I FIGLI!!!
	dispatch({
	   	type: typeUnlisten,
	   	params: params
	   })
    }
}

