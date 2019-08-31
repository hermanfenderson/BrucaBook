//Questo helper genera azioni data una "scene"
//action per il form Rigabolla


import {addCreatedStamp,addChangedStamp} from './firebase';
import Firebase from 'firebase';
import request from 'superagent';
import {isComplete} from './catalog';

import {urlFactory, getServerTime} from './firebase';
import {isInternalEAN} from './ean';
import {getListeningMagazzino, getDataMagazzino}  from '../reducers';

import {magazzinoFA} from '../actions/magazzino'

//Metodo riutilizzabile... dati tre action, una url fa primo infasamento e ascolta tutto (distringuendo il caso ean)
//Parametri... url oppure urlParams, itemsurl
//le tre action da triggerare e la quarta per l'initial load
//Se devo usare timeStamp

export const stdListenItem = (params) => {
 const type1 = params.added_item;
   const type2 = params.changed_item;
   const type3 = params.deleted_item;
   const type4 = params.initial_load_item;
   const typeListen = params.listen_item;
   const onEAN = (params.useTimestamp) ? true : false;
   const itemsUrl = params.itemsUrl;
   const urlParams = params.urlParams;
   
  return function(dispatch, getState) {
  	const url = (params.url) ? params.url : urlFactory(getState,itemsUrl, urlParams);
     
  	if (url)
    {
    	let ref = Firebase.database().ref(url);
   if (params.extraQuery) ref=params.extraQuery(ref); //Consente di fare filtri e altre magie...
   	
    var listener_added = null;
    //l'added lo faccio dopo...per gestire il caso del initial vuoto
	   const listener_changed = ref.on('child_changed', snapshot => {
	      dispatch({
	        type: type2,
	        payload: snapshot
	      })  
	   });
	   const listener_removed = ref.on('child_removed', snapshot => {
	      dispatch({
	        type: type3,
	        payload: snapshot
	      })  
	   });
	   ref.once('value', snapshot => {
	   	  	if (!onEAN)
    		{
    		let first = (snapshot.val()) ? true : false; //In questo modo non carico due volte ma carico la prima se il data set di initial load è vuoto...
	       listener_added = ref.limitToLast(1).on('child_added', snapshot => {
		      //Così non dovrebbe più generare due volte il primo rigo...
		      if (first) first = false;
		      else dispatch({
		        type: type1,
		        payload: snapshot
		      })
		    });
	      }
	      else
	      {
	      let now = getServerTime(Firebase.database().ref('/'))();
	      //Ragiono per timestamp
	      listener_added = ref.orderByChild('createdAt').startAt(now).on('child_added', snapshot => {
		      dispatch({
		        type: type1,
		        payload: snapshot
		      })
		    });	
	      }
	      dispatch({
	        type: type4,
	        payload: snapshot
	      })  
	   });
	   dispatch({
	   	type: typeListen,
	   	params: urlParams,
	   	url: url,
	   	listeners: {added: listener_added,changed: listener_changed, removed: listener_removed} 
	   })
	}   
	else dispatch({
	   	type: typeListen,
	   	params: null,
	   	url: url,
	   })   
  }
}


//Non ritorna nessuna azione e non crea nessuna actionCreator
export const stdOffListenItem = (params) =>
{   
	const listeners = params.listeners;
	const itemsUrl = params.itemsUrl;
	const urlParams = params.urlParams;
    const typeUnlisten = params.off_listen_item;
	return function(dispatch, getState) {
	const url = (params.url) ? params.url : urlFactory(getState,itemsUrl, urlParams);
  
	if (listeners) 
		{
			Firebase.database().ref(url).off('child_added',listeners.added);
			Firebase.database().ref(url).off('child_changed',listeners.changed);
			Firebase.database().ref(url).off('child_removed',listeners.removed);
		}
	else Firebase.database().ref(url).off();
	dispatch({
	   	type: typeUnlisten,
	   	params: urlParams,
	   	url: url
	   })
    }
}




//3 modificatori...
//stockMessageQueue aggiorna con la info dello stock
//getStock... passa lo stock quando viene cercato il catalogo
//onEAN.... persiste EAN e non una key...
export function FormActions(scene,  preparaItem, itemsUrl, rigaTestataUrl, stockMessageQueue=false, getStock=false, onEAN=false) {
//Azioni legate ad azioni di ricerca
this.scene = scene;
this.UPDATE_CATALOG_ITEM = 'UPDATE_CATALOG_ITEM_'+scene;
this.SEARCH_CATALOG_ITEM = 'SEARCH_CATALOG_ITEM_'+scene;
this.UPDATE_GENERAL_CATALOG_ITEM = 'UPDATE_GENERAL_CATALOG_ITEM_'+scene;
this.SEARCH_GENERAL_CATALOG_ITEM = 'SEARCH_GENERAL_CATALOG_ITEM_'+scene;

this.SEARCH_CLOUD_ITEM = 'SEARCH_CLOUD_ITEM_'+scene;
this.FOUND_CLOUD_ITEM = 'FOUND_CLOUD_ITEM_'+scene;
this.FOUND_CATALOG_ITEM = 'FOUND_CATALOG_ITEM_'+scene;
this.FOUND_GENERAL_CATALOG_ITEM = 'FOUND_GENERAL_CATALOG_ITEM_'+scene;

this.NOT_FOUND_CLOUD_ITEM = 'NOT_FOUND_CLOUD_ITEM_'+scene;
this.NOT_FOUND_CATALOG_ITEM = 'NOT_FOUND_CATALOG_ITEM_'+scene;
this.NOT_FOUND_GENERAL_CATALOG_ITEM = 'NOT_FOUND_GENERAL_CATALOG_ITEM_'+scene;

this.SET_FILTER = 'SET_FILTER_'+scene;
this.RESET_FILTER = 'RESET_FILTER_'+scene;
this.CHANGE_EDITED_ITEM = 'CHANGE_EDITED_ITEM_'+scene;
this.SUBMIT_EDITED_ITEM = 'SUBMIT_EDITED_ITEM_'+scene;
this.SET_SELECTED_ITEM = 'SET_SELECTED_ITEM_'+scene;
this.RESET_EDITED_ITEM = 'RESET_EDITED_ITEM_'+scene;
this.ADD_ITEM = 'ADD_ITEM_'+scene;
this.DELETE_ITEM = 'DELETE_ITEM_'+scene;
this.CHANGE_ITEM = 'CHANGE_ITEM_'+scene;
this.TOGGLE_PIN_ITEM = 'TOGGLE_PIN_ITEM_'+scene;
//Ascolto cambiamenti per questo EAN
this.ADD_EAN_LISTENER = 'ADD_EAN_LISTENER_'+scene;



this.ADDED_ITEM = 'ADDED_ITEM_'+scene;
this.DELETED_ITEM = 'DELETED_ITEM_'+scene;
this.CHANGED_ITEM = 'CHANGED_ITEM_'+scene;
this.INITIAL_LOAD_ITEM = 'INITIAL_LOAD_ITEM_'+scene;
this.LISTEN_ITEM='LISTEN_ITEM_'+scene;
//this.LISTEN_TOTALI='LISTEN_TOTALI_'+scene;

this.OFF_LISTEN_ITEM='OFF_LISTEN_ITEM_'+scene;
//this.OFF_LISTEN_TOTALI='OFF_LISTEN_TOTALI_'+scene;

this.RESET='RESET_'+scene;

this.TOTALI_CHANGED = 'TOTALI_CHANGED_'+scene;
this.RESET_TABLE = 'RESET_TABLE_'+scene;
this.TOGGLE_TABLE_SCROLL = 'TOGGLE_TABLE_SCROLL_'+scene;
this.SET_TABLE_SCROLL_BY_KEY = 'SET_TABLE_SCROLL_BY_KEY_'+scene;

this.SET_TABLE_WINDOW_HEIGHT = 'SET_TABLE_WINDOW_HEIGHT_'+scene;
this.FOCUS_SET = 'FOCUS_SET_'+scene;

this.LISTEN_TESTATA='LISTEN_TESTATA_'+scene;
this.OFF_LISTEN_TESTATA='OFF_LISTEN_TESTATA_'+scene;
this.TESTATA_CHANGED = 'TESTATA_CHANGED_'+scene;

this.SET_READ_ONLY_FORM = 'SET_READ_ONLY_FORM_'+scene;
this.PUSH_MESSAGE = 'PUSH_MESSAGE_'+scene;
this.SHIFT_MESSAGE = 'SHIFT_MESSAGE_'+scene;

this.ADDED_STORICO_MAGAZZINO ='ADDED_STORICO_MAGAZZINO_'+scene;
this.CHANGED_STORICO_MAGAZZINO ='CHANGED_STORICO_MAGAZZINO_'+scene;
this.DELETED_STORICO_MAGAZZINO ='DELETED_STORICO_MAGAZZINO_'+scene;
this.INITIAL_LOAD_STORICO_MAGAZZINO ='INITIAL_LOAD_STORICO_MAGAZZINO_'+scene;
this.LISTEN_STORICO_MAGAZZINO ='LISTEN_STORICO_MAGAZZINO_'+scene;
this.UNLISTEN_STORICO_MAGAZZINO ='UNLISTEN_STORICO_MAGAZZINO_'+scene;
this.DATA_MAGAZZINO_CHANGED = 'DATA_MAGAZZINO_CHANGED_'+scene;
this.DATI_STORICO_MAGAZZINO = 'DATI_STORICO_MAGAZZINO_'+scene;


this.itemsUrl = itemsUrl;
this.preparaItem = preparaItem;
this.rigaTestataUrl = rigaTestataUrl;
this.stockMessageQueue = stockMessageQueue;

this.pushMessage = (element) => {return {type: this.PUSH_MESSAGE, element: element}}
this.shiftMessage = () => {return {type: this.SHIFT_MESSAGE}}
this.onEAN = onEAN;



//Mi serve per poter gestire un eventuale cambio data o altre info dalla testata...
this.listenTestata = (params, itemId) =>  
{
const rigaTestataUrl = this.rigaTestataUrl;
const typeTestataChanged = this.TESTATA_CHANGED;
const typeListenTestata = this.LISTEN_TESTATA;

return function(dispatch, getState) {
	  //semplicemente mi aggancio alla testata...

	   
	  const url = urlFactory(getState,rigaTestataUrl, params, itemId);
			      			 if (url)
							      {
							      Firebase.database().ref(url).on('value', snapshot =>
							          { 
							          	const riga = (snapshot.val()) ? {...snapshot.val(), 'key': itemId} : null//Per discernere la cancellazione...
							          	dispatch(
							          			{
							          			type: typeTestataChanged,
							          			payload: riga
							          			}
							          			)
							          	 }
							    	  )
						      	dispatch(
						      		{type: typeListenTestata,
						      		object: {params: params, itemId: itemId}
						      		}
						      		)
						      	
						    		}
						      else dispatch(
						      		{type: typeListenTestata,
						      		object: null
						      		}
						      		)
	   
  }
}


this.setReadOnlyForm = () =>
{
	return ({'type': this.SET_READ_ONLY_FORM});
}


this.unlistenTestata = (params, itemId) =>
{
const rigaTestataUrl = this.rigaTestataUrl;
const typeOffListenTestata = this.OFF_LISTEN_TESTATA;

	
return function(dispatch, getState) {

      Firebase.database().ref(urlFactory(getState,rigaTestataUrl, params, itemId)).off();
      dispatch(
      		{
      		type: typeOffListenTestata,
      		object: {params: params, itemId: itemId}
      		}	
      	)
    }	
}

this.setFilter = (name, value) =>
{
   return({type: this.SET_FILTER,
   	name: name,
   	value: value
   })	
}

this.resetFilter = () =>
{
   return({type: this.RESET_FILTER,
   	
   })	
}


this.focusSet = () =>
{return({
  type: this.FOCUS_SET,
  
   }
  );
};	


this.reset = (params, idItem) => {
  const typeReset = this.RESET;
  const rigaTestataUrl = this.rigaTestataUrl;
  const itemsUrl = this.itemsUrl;
  
  return function(dispatch, getState) {
  	
   Firebase.database().ref(urlFactory(getState,itemsUrl, params, idItem)).off();
   
   //E non osservo più la riga di testata...
    Firebase.database().ref(urlFactory(getState,rigaTestataUrl, params, idItem)).off();
    
    dispatch({type: typeReset});
    
  }
}


this.setTableWindowHeight = (tableWindowHeight) =>
{return({
  type: this.SET_TABLE_WINDOW_HEIGHT,
  tableWindowHeight: tableWindowHeight
   }
  );
};	



this.foundCatalogItem = (ean,item) =>
{
//Qui prendo il valore dello stock a magazzino... se richiesto.
let type = this.FOUND_CATALOG_ITEM;
if (getStock) 
{
	return function(dispatch, getState) {
       	const url = urlFactory(getState,'magazzino',null,ean);
		Firebase.database().ref(url).once('value', snapshot => {
		 let itemCpy = {...item, ean: ean, stock: snapshot.val() ? snapshot.val().pezzi : 0}
	      dispatch({
	        type: type,
	        item: itemCpy
	      })
	      });
	 }   
}
else return({
  type: this.FOUND_CATALOG_ITEM,
  item: {...item, ean: ean}
   }
  );
};


this.foundCloudItem = (ean,item) =>
{ const type = this.FOUND_CLOUD_ITEM;
  const updateCatalogItem = this.updateCatalogItem;
  const updateGeneralCatalogItem = this.updateGeneralCatalogItem;
  //Qui inserisco il caricamento dell'immagine da internet...
  return function(dispatch) {
	                                			
  if (item.imgUrl)
  	  {
  	      item.imgFullName = "images/books/"+ean+'.jpg';
  	      new Promise( function (resolve, reject) {
		  request.get(item.imgUrl).responseType('blob').then(
	                  (response) => {
	                                
	                                var fileRef = Firebase.storage().ref().child(item.imgFullName);
	                                fileRef.put(response.req.xhr.response).then(
    									function(snapshot) {
    										let url = snapshot.downloadURL;
    										item['imgFirebaseUrl'] = url;
  	    									item['ean'] = ean; //La ricerca non lo contiene...
  	    									if (!item['iva']) item['iva'] = 'a0'; //Default
											dispatch({type: type,item});	
											dispatch(updateGeneralCatalogItem(item)); //Persisto il risultato del cloud...anche nella cache e in locale
											dispatch(updateCatalogItem(item)); //Persisto il risultato del cloud...anche nella cache e in locale
    									});
 	                           
	                            	}
	                  )
	          })
	}
   else {
	     item['ean'] = ean; //La ricerca non lo contiene...
  	     if (!item['iva']) item['iva'] = 'a0'; //Default
	   dispatch({type: type,item});	
	   dispatch(updateGeneralCatalogItem(item)); //Persisto il risultato del cloud...anche nella cache e in locale
	   dispatch(updateCatalogItem(item)); //Persisto il risultato del cloud...anche nella cache e in locale
		}
  }	
}

this.foundGeneralCatalogItem = (ean,item) =>
{ const type = this.FOUND_CLOUD_ITEM;
  const updateCatalogItem = this.updateCatalogItem;
  
	return function(dispatch) {
  	     item['ean'] = ean; //La ricerca non lo contiene...
	   dispatch({type: type,item});	
	   dispatch(updateCatalogItem(item)); //Persisto il risultato del catalogo generale...in locale
	   
	}
}

//Copro anche il caso dei ritorni parziali... 
this.notFoundCloudItem = (ean,item) =>
{const type = this.NOT_FOUND_CLOUD_ITEM;
	return function(dispatch) {
       item['ean'] = ean;
  	   dispatch({type: type, item:item});
  	   dispatch({type: 'NOT_FOUND_CLOUD_ITEM_CATALOGO', item:item})
	}
}


this.notFoundCatalogItem = () => 
{return({
  type: this.NOT_FOUND_CATALOG_ITEM,
   }
  )
}

this.notFoundGeneralCatalogItem = () => 
{return({
  type: this.NOT_FOUND_GENERAL_CATALOG_ITEM,
   }
  )
}


this.searchCloudItem = (ean) =>
{ 
const type = this.SEARCH_CLOUD_ITEM;
const foundCloudItem = this.foundCloudItem;
  const notFoundCloudItem = this.notFoundCloudItem;
 
  return function(dispatch) {
  	   dispatch({type: type});
  	  //Non cerco nel cloud per codici interni
  	  if (!isInternalEAN(ean)) 
  	  {
  	      var promise = new Promise( function (resolve, reject) {
		  request.get('https://linode.hermanfenderson.com/ibs.php?ean='+ean).then(
	                  (response) => {
	                                var book = JSON.parse(response.text);
	                                if (isComplete(book)) dispatch(foundCloudItem(ean,book));
	                                else dispatch(notFoundCloudItem(ean,{}));
	                                resolve(book, ean);
	                             }
	                  )
	          })
	  return promise;   
	  }
	 //Codice interno vergine... 
	 else dispatch(notFoundCloudItem(ean,{}))
  }
}


this.searchGeneralCatalogItem = (ean) =>
  { 
  //Problemi di casting...
  const type=this.SEARCH_CATALOG_ITEM;
  const foundGeneralCatalogItem = this.foundGeneralCatalogItem;
  const notFoundGeneralCatalogItem = this.notFoundGeneralCatalogItem;
  const searchCloudItem = this.searchCloudItem;
  
   return function(dispatch) {
   dispatch({type: type});
      var promise = new Promise( function (resolve, reject) {
          Firebase.database().ref('catalogo/'+ean).once('value').then(
                 (payload) => {
                       if (payload.val()) dispatch(foundGeneralCatalogItem(ean,payload.val()));
                       else {
                       		dispatch(notFoundGeneralCatalogItem());
                       		dispatch(searchCloudItem(ean));
                    		}
                       resolve(payload);}                
                 )})        
          return promise;
  }       
}


//Item è un oggetto con una chiave ean dentro... la trasformo nella chiave del catalogo
this.updateGeneralCatalogItem = (item) =>
{
  const type = 	this.UPDATE_GENERAL_CATALOG_ITEM;
  const ean = item.ean;
  const slicedItem = {...item};
  delete slicedItem.ean;
  return function(dispatch) {
    Firebase.database().ref('catalogo/'+ean).update(slicedItem).then(response => {
      dispatch({
        type: type,
        item: item
      });
    });
  }
}


this.searchCatalogItem = (ean) =>
  { 
  //Problemi di casting...
  const type=this.SEARCH_CATALOG_ITEM;
  const foundCatalogItem = this.foundCatalogItem;
  const notFoundCatalogItem = this.notFoundCatalogItem;
   const searchGeneralCatalogItem = this.searchGeneralCatalogItem;
 
   return function(dispatch, getState) {
   dispatch({type: type});
      var promise = new Promise( function (resolve, reject) {
          Firebase.database().ref(urlFactory(getState, 'catalogoLocale',null,ean)).once('value').then(
                 (payload) => {
                       if (payload.val()) dispatch(foundCatalogItem(ean,payload.val()));
                       else {
                       		dispatch(notFoundCatalogItem());
                       		dispatch(searchGeneralCatalogItem(ean));
                    		}
                       resolve(payload);}                
                 )})        
          return promise;
  }       
}


//Item è un oggetto con una chiave ean dentro... la trasformo nella chiave del catalogo
this.updateCatalogItem = (item) =>
{
  const type = 	this.UPDATE_CATALOG_ITEM;
  const ean = item.ean;
  const slicedItem = {...item};
  delete slicedItem.ean;
  return function(dispatch, getState) {
    Firebase.database().ref(urlFactory(getState,'catalogoLocale',null,ean)).update(slicedItem).then(response => {
      dispatch({
        type: type,
        item: item
      });
    });
  }
}




//Funzioni VERIFICATE
//Se aggiungo una riga scrollo la tabella fino in basso... una delle poche concessioni alla presentation qui...

this.toggleTableScroll = (toggle) => {
 return {
	    type: this.TOGGLE_TABLE_SCROLL,
	    toggle: toggle
	  }  
	}
	
this.setTableScrollByKey = (key) => {
 return {
	    type: this.SET_TABLE_SCROLL_BY_KEY,
	    key: key
	  }  
	}	

this.resetTable = () => {
 return {
	    type: this.RESET_TABLE,
	  }  
	}


//Genero tre listener... come un'unica funzione...
this.listenItem = (params) => {
 const type1 = this.ADDED_ITEM;
   const type2 = this.CHANGED_ITEM;
   const type3 = this.DELETED_ITEM;
   const type4 = this.INITIAL_LOAD_ITEM;
   const typeListen = this.LISTEN_ITEM;
   const onEAN = this.onEAN
   const itemsUrl = this.itemsUrl;
   const scene = this.scene;
  return function(dispatch, getState) {
  	if (getListeningMagazzino(getState()) === null && scene !=='MAGAZZINO') //Ascolto il magazzino... serve a farlo al refresh...
		{    
				dispatch(magazzinoFA.listenItem());
		}
	dispatch(stdListenItem({ added_item: type1,
					changed_item: type2,
					deleted_item: type3,
					initial_load_item: type4,
					listen_item: typeListen,
					useTimestamp : onEAN,
					itemsUrl : itemsUrl,
					urlParams : params,}));	
  }
}


//Non ritorna nessuna azione e non crea nessuna actionCreator
this.offListenItem = (params, listeners=null) =>
{   
	const itemsUrl = this.itemsUrl;
    const typeUnlisten = this.OFF_LISTEN_ITEM;
	
	return function(dispatch, getState) {
		dispatch(stdOffListenItem({
			            listeners: listeners,
			            itemsUrl: itemsUrl,
			            urlParams: params,
			            off_listen_item: typeUnlisten,
						}));

	 }
    
}


this.stockMessageQueueListener = (valori) =>
{
//Riscritto per gestire il timestamp...
//Qui se non sto ascoltando i magazzini... devo cominciare a farlo...!
	const type1 = this.ADD_EAN_LISTENER;
	 let now = getServerTime(Firebase.database().ref('/'))();
    return ({type: type1, ean: valori.ean, timestamp: now })  
}

this.aggiungiItem = (params, valori) => {
  const typeAdd =  this.ADD_ITEM;
  var nuovoItem = {...valori};
  const itemsUrl = this.itemsUrl;
  const stockMessageQueue = this.stockMessageQueue;
  const stockMessageQueueListener = this.stockMessageQueueListener;
  const toggleTableScroll = this.toggleTableScroll;
   addCreatedStamp(nuovoItem);
   this.preparaItem(nuovoItem);
    return function(dispatch,getState) {
   
  dispatch(toggleTableScroll(true));    //Mi metto alla fine della tabella
   var ref; 
    if(!onEAN) ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params)).push();
    else ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params, valori.ean));
    ref.set(nuovoItem);
   dispatch(
   	{
   		type: typeAdd,
   		key: ref.key
   	}
   	)  	
   if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));	
   if (scene==='INVENTARIO') aggiornaRigheInventario(params, getState, ref.key);

   return(ref.key);
  }
  
}

this.aggiornaItem = (params,itemId, valori) => {
    const typeChange = this.CHANGE_ITEM;
 	 const stockMessageQueue = this.stockMessageQueue;
 const stockMessageQueueListener = this.stockMessageQueueListener;
  
    var nuovoItem = {...valori};
      addChangedStamp(nuovoItem);
   this.preparaItem(nuovoItem);
    const itemsUrl = this.itemsUrl;
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
   	if (scene==='INVENTARIO') aggiornaRigheInventario(params, getState, itemId);

   	 return(itemId); 
  }
 
}




//Una forzatura chiedere ean come parametro aggiuntivo in alcuni casi......ma mi evito una chiamata del tutto inutile
this.deleteItem = (params, itemId, valori=null) => {
const typeDelete = this.DELETE_ITEM;
const itemsUrl = this.itemsUrl;
const stockMessageQueue = this.stockMessageQueue;
 const stockMessageQueueListener = this.stockMessageQueueListener;
 const scene = this.scene;

  return function(dispatch, getState) {
    Firebase.database().ref(urlFactory(getState,itemsUrl,params, itemId)).remove();
     dispatch(
					{
   					type: typeDelete,
   					key: itemId
   					}
   					)   
   	if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));		
    if (scene==='INVENTARIO') aggiornaRigheInventario(params, getState, itemId);
    };
  }
	
//Pinnare una riga
this.togglePin = (params, itemId, valori, pinnedField) =>
{
	  const typeTogglePin = this.TOGGLE_PIN_ITEM;
	   var nuovoItem = {...valori, [pinnedField]: !valori[pinnedField]};
      const itemsUrl = this.itemsUrl;
      return function(dispatch,getState) {

    const ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params, itemId));
    ref.update(nuovoItem);
    dispatch(
   	{
   		type: typeTogglePin,
   		key: ref.key
   	}
   	)   
 
	}
}



this.setSelectedItem = (row) => {
	  return {
	    type: this.SET_SELECTED_ITEM,
	    row
	  }  
	}

this.resetEditedItem = () => {
	  return {
	    type: this.RESET_EDITED_ITEM,
	  }  
	}

//Funzione chiamata quando cambia un campo del form...
//Mando un oggetto nel formato... campo e valore
this.changeEditedItem = (name,value) => {
	   	return {
			type: this.CHANGE_EDITED_ITEM,
	    	name: name,
	    	value: value
			}
	}






//Azione richiamata sia perchè il campo EAN è stato attivato per "codice breve"
//Sia perchè a campi validi... si può scrivere...
//this.submitEditedItem = (isValid, bollaId, valori, selectedItem) => {


this.submitEditedItem = (isValid,selectedItem,params,valori) => {
	      const type = this.SUBMIT_EDITED_ITEM;
	      const aggiornaItem = this.aggiornaItem;
	      const aggiungiItem = this.aggiungiItem;
	      var key = null;
	      const itemId = selectedItem ? selectedItem.key : null;
	      return function(dispatch, getState) {
			dispatch({type: type});
			if (selectedItem && isValid) key=dispatch(aggiornaItem(params, itemId, valori));
			else if(isValid) key=dispatch(aggiungiItem(params,valori));
			return(key);
	      }
	}
	
	
this.datiStoricoMagazzino = (date) => {
	 const DATI_STORICO_MAGAZZINO = this.DATI_STORICO_MAGAZZINO;
	 return function(dispatch, getState) {
//	 	let storicoMagazzinoRef = Firebase.database().ref(urlFactory(getState, 'allStoricoMagazzino'));
//	 	let dateStoricoRef = Firebase.database().ref(urlFactory(getState, 'dateStoricoMagazzino'));
	 	
	 	let magazzinoRef = Firebase.database().ref(urlFactory(getState, 'magazzino'));
	 	let eanInfo = {};
	 	Firebase.database().ref(urlFactory(getState, 'registroData')).once('value', snapshot => {
	 				let registroData = Object.entries(snapshot.val());
			    	
			    	//Update a chunk di date...
			    	 for (let i=0; i<registroData.length; i++) 
			        	{
			        	 let currentData = registroData[i][0];
			              if(currentData > date - 1) break; //Salto fuori se ho raggiunto la data richiesta
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
			        	//storicoMagazzinoRef.child(currentData).update({...eanInfo});
			        	//dateStoricoRef.child(currentData).update(Firebase.database.ServerValue.TIMESTAMP);
			        	
			        //	promises.push(refRadix.child('storicoMagazzino/'+currentData).update({...eanInfo}));
			        	}
			        	dispatch ({type: DATI_STORICO_MAGAZZINO, date: date, values: eanInfo}	);	
			        	
			        	//magazzinoRef.update({...eanInfo});
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

	
	

//Metodi per recuperare lo storico magazzino
this.searchDataMagazzino = (dataOsservata) =>
{
	const type = this.DATA_MAGAZZINO_CHANGED;
    const scene = this.scene;	
    const listenStoricoMagazzino = this.listenStoricoMagazzino;
    const unListenStoricoMagazzino = this.unListenStoricoMagazzino;
    
return function(dispatch, getState) {
	const url = urlFactory(getState,'dateStoricoMagazzino', null);
	const upto = (dataOsservata - 1).toString();
	Firebase.database().ref(url).orderByKey().endAt(upto).limitToLast(1).on('value', snapshot => {
	let dataMagazzino = Object.keys(snapshot.val())[0];
	let oldDataMagazzino = getDataMagazzino(getState(), scene);
	if (dataMagazzino !== oldDataMagazzino)
		{dispatch({
		        type: type,
		        dataMagazzino: dataMagazzino
		      })
		 //Se stavo già ascoltando qualcosa...     
		 if (oldDataMagazzino > 0) dispatch(unListenStoricoMagazzino(oldDataMagazzino));
		 //Carico in tabella specifica tutti gli stock per quella data...
		 console.log(dataMagazzino);
		 dispatch(listenStoricoMagazzino(dataMagazzino));
		}     
	})
	
	}
}

this.listenStoricoMagazzino = (dataMagazzino) =>
{
	
//Genero tre listener... come un'unica funzione...
    const type1 = this.ADDED_STORICO_MAGAZZINO;
	const type2 = this.CHANGED_STORICO_MAGAZZINO;
	const type3 = this.DELETED_STORICO_MAGAZZINO;
	const type4 = this.INITIAL_LOAD_STORICO_MAGAZZINO;
	const type = this.LISTEN_STORICO_MAGAZZINO;
	
   
   return function(dispatch, getState) {
  	const url = urlFactory(getState,'storicoMagazzino', dataMagazzino);
  	if (url)
    {  
       
       
       let now = getServerTime(Firebase.database().ref('/'))();
      //Ragiono per timestamp
      const listener_added = Firebase.database().ref(url).orderByChild('createdAt').startAt(now).on('child_added', snapshot => {
	      dispatch({
	        type: type1,
	        payload: snapshot
	      })
	      if (scene==='INVENTARIO') aggiornaOccorrenzeInventario(getState);
	      });
	   const listener_changed = Firebase.database().ref(url).on('child_changed', snapshot => {
	      dispatch({
	        type: type2,
	        payload: snapshot
	      })
	      if (scene==='INVENTARIO') aggiornaOccorrenzeInventario(getState);
	     
	   });
	   const listener_removed = Firebase.database().ref(url).on('child_removed', snapshot => {
	      dispatch({
	        type: type3,
	        payload: snapshot
	      })
	       if (scene==='INVENTARIO') aggiornaOccorrenzeInventario(getState);
	     
	   });
	   Firebase.database().ref(url).once('value', snapshot => {
	      dispatch({
	        type: type4,
	        payload: snapshot
	      }) 
	      if (scene==='INVENTARIO') aggiornaOccorrenzeInventario(getState);
	    });
	   dispatch({
	   	type: type,
	   	params: dataMagazzino,
	   	listeners: {added: listener_added,changed: listener_changed, removed: listener_removed} 
	   })
	}   
	else dispatch({
	   	type: type,
	   	params: null,
	   })   
  }
  
}

this.unListenStoricoMagazzino = (dataMagazzino) =>
{
const type = this.UNLISTEN_STORICO_MAGAZZINO;
	
return function(dispatch, getState) {	
	Firebase.database().ref(urlFactory(getState,'storicoMagazzino', dataMagazzino)).off();
	
		dispatch({
		   	type: type,
		   	params: dataMagazzino
		   })

	}
}

}

//Funzioni specifiche di scena..
const aggiornaRigheInventario = (params, getState, itemId) =>
    	{
   		const idInventario = params;
    	let updatedTotali = {righe: getState().inventario.itemsArray.length, lastActionKey: itemId};
    	Firebase.database().ref(urlFactory(getState,'totaliInventario', idInventario)).update(updatedTotali);
    	};

const aggiornaOccorrenzeInventario = (getState) =>
    	{
		let updatedTotali = {magazzino: getState().inventario.totaleOccorrenze};
		let idInventario = getState().inventario.listeningItem;
	    if (idInventario) Firebase.database().ref(urlFactory(getState,'totaliInventario', idInventario)).update(updatedTotali);
		}






