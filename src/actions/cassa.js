import {FormActions, stdListenItem, stdOffListenItem} from '../helpers/formActions';
import Firebase from 'firebase';
import {urlFactory, addCreatedStamp,addChangedStamp} from '../helpers/firebase';
import {getListeningMagazzino}  from '../reducers';
import {magazzinoFA} from '../actions/magazzino'

import moment from 'moment';
export const SCENE = 'CASSA';

//Per sentire le testate di tutti gli scontrini di una cassa
export const INITIAL_LOAD_ITEM_ELENCOSCONTRINI = 'INITIAL_LOAD_ITEM_ELENCOSCONTRINI';
export const ADDED_ITEM_ELENCOSCONTRINI = 'ADDED_LOAD_ITEM_ELENCOSCONTRINI';
export const CHANGED_ITEM_ELENCOSCONTRINI = 'CHANGED_LOAD_ITEM_ELENCOSCONTRINI';
export const DELETED_ITEM_ELENCOSCONTRINI = 'DELETED_LOAD_ITEM_ELENCOSCONTRINI';
export const LISTEN_ELENCOSCONTRINI = 'LISTEN_ELENCOSCONTRINI';
export const OFF_LISTEN_ELENCOSCONTRINI = 'OFF_LISTEN_ELENCOSCONTRINI';

export const INITIAL_LOAD_ITEM_SCONTRINI = 'INITIAL_LOAD_ITEM_SCONTRINI';
export const ADDED_ITEM_SCONTRINI = 'ADDED_LOAD_ITEM_SCONTRINI';
export const CHANGED_ITEM_SCONTRINI = 'CHANGED_LOAD_ITEM_SCONTRINI';
export const DELETED_ITEM_SCONTRINI = 'DELETED_LOAD_ITEM_SCONTRINI';
export const LISTEN_SCONTRINI = 'LISTEN_SCONTRINI';
export const OFF_LISTEN_SCONTRINI = 'OFF_LISTEN_SCONTRINI';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
   	riga['oraScontrino'] = riga['oraScontrino'].valueOf();
   	//Questi vengono calcolati... oppure servono a visualizzre...
   	if ('totali' in riga) {delete riga.totali};
    if ('tipo' in riga) {delete riga.tipo};
     
   }

   

export const listenScontrini = (params) => {
return function(dispatch, getState) {
  	if (getListeningMagazzino(getState()) === null) //Ascolto il magazzino... serve a farlo al refresh...
		{    
				dispatch(magazzinoFA.listenItem());
		}
	dispatch(stdListenItem({ added_item: ADDED_ITEM_SCONTRINI,
					changed_item: CHANGED_ITEM_SCONTRINI,
					deleted_item: DELETED_ITEM_SCONTRINI,
					initial_load_item: INITIAL_LOAD_ITEM_SCONTRINI,
					listen_item: LISTEN_SCONTRINI,
					itemsUrl: 'righeCassa',
					urlParams : params,
					}));	
  }
};

export const listenElencoScontrini = (params) => {
	return function(dispatch, getState) {
  	dispatch(stdListenItem({ added_item: ADDED_ITEM_ELENCOSCONTRINI,
					changed_item: CHANGED_ITEM_ELENCOSCONTRINI,
					deleted_item: DELETED_ITEM_ELENCOSCONTRINI,
					initial_load_item: INITIAL_LOAD_ITEM_ELENCOSCONTRINI,
					listen_item: LISTEN_ELENCOSCONTRINI,
					itemsUrl: 'righeElencoScontrini',
					urlParams : params,
					}));	
  }
};

export const offListenScontrini = (params, listeners=null) =>
{   
	const itemsUrl = 'righeCassa';
    const typeUnlisten = OFF_LISTEN_SCONTRINI ;
	
	return function(dispatch, getState) {
		dispatch(stdOffListenItem({
			            listeners: listeners,
			            itemsUrl: itemsUrl,
			            urlParams: params,
			            off_listen_item: typeUnlisten,
						}));

	 }
    
}

export const offListenElencoScontrini = (params, listeners=null) =>
{   
	const itemsUrl = 'righeCassa';
    const typeUnlisten = OFF_LISTEN_ELENCOSCONTRINI ;
	
	return function(dispatch, getState) {
		dispatch(stdOffListenItem({
			            listeners: listeners,
			            itemsUrl: itemsUrl,
			            urlParams: params,
			            off_listen_item: typeUnlisten,
						}));

	 }
    
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
	


