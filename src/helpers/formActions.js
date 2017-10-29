//Questo helper genera azioni data una "scene"
//action per il form Rigabolla
import {addCreatedStamp,addChangedStamp} from './firebase';
import Firebase from 'firebase';
import request from 'superagent';
import {isComplete} from './catalog';

import {urlFactory} from './firebase';
import {isInternalEAN} from './ean';

export function FormActions(scene,  preparaItem, itemUrl, itemsUrl, totaliUrl) {
//Azioni legate ad azioni di ricerca
this.UPDATE_CATALOG_ITEM = 'UPDATE_CATALOG_ITEM_'+scene;
this.SEARCH_CATALOG_ITEM = 'SEARCH_CATALOG_ITEM_'+scene;
this.SEARCH_CLOUD_ITEM = 'SEARCH_CLOUD_ITEM_'+scene;
this.FOUND_CLOUD_ITEM = 'FOUND_CLOUD_ITEM_'+scene;
this.FOUND_CATALOG_ITEM = 'FOUND_CATALOG_ITEM_'+scene;
this.NOT_FOUND_CLOUD_ITEM = 'NOT_FOUND_CLOUD_ITEM_'+scene;
this.NOT_FOUND_CATALOG_ITEM = 'NOT_FOUND_CATALOG_ITEM_'+scene;
	
this.CHANGE_EDITED_ITEM = 'CHANGE_EDITED_ITEM_'+scene;
this.SUBMIT_EDITED_ITEM = 'SUBMIT_EDITED_ITEM_'+scene;
this.SET_SELECTED_ITEM = 'SET_SELECTED_ITEM_'+scene;
this.RESET_EDITED_ITEM = 'RESET_EDITED_ITEM_'+scene;
this.ADDED_ITEM = 'ADDED_ITEM_'+scene;
this.DELETED_ITEM = 'DELETED_ITEM_'+scene;
this.CHANGED_ITEM = 'CHANGED_ITEM_'+scene;
this.TOTALI_CHANGED = 'TOTALI_CHANGED_'+scene;
this.TOGGLE_TABLE_SCROLL = 'TOGGLE_TABLE_SCROLL_'+scene;
this.itemUrl = itemUrl;
this.itemsUrl = itemsUrl;
this.totaliUrl = totaliUrl;
this.preparaItem = preparaItem;

//Funzioni da MIGRARE
this.foundCatalogItem = (item) =>
{return({
  type: this.FOUND_CATALOG_ITEM,
  item: item
   }
  );
};

this.foundCloudItem = (ean,item) =>
{ const type = this.FOUND_CLOUD_ITEM;
  const updateCatalogItem = this.updateCatalogItem;
	return function(dispatch) {
  	     item['ean'] = ean; //La ricerca non lo contiene...
	   dispatch({type: type,item});	
	   dispatch(updateCatalogItem(item)); //Persisto il risultato del cloud...
		
	}
}


//Copro anche il caso dei ritorni parziali... 
this.notFoundCloudItem = (ean,item) =>
{const type = this.NOT_FOUND_CLOUD_ITEM;
	return function(dispatch) {
       item['ean'] = ean;
  	   dispatch({type: type, item:item});
  	   dispatch({type: 'NOT_FOUND_CLOUD_ITEM', item:item})
	}
}

this.notFoundCatalogItem = () => 
{return({
  type: this.NOT_FOUND_CATALOG_ITEM,
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


this.searchCatalogItem = (ean) =>
  { 
  //Problemi di casting...
  const type=this.SEARCH_CATALOG_ITEM;
  const foundCatalogItem = this.foundCatalogItem;
  const notFoundCatalogItem = this.notFoundCatalogItem;
  const searchCloudItem = this.searchCloudItem;
  
   return function(dispatch) {
   dispatch({type: type});
      var promise = new Promise( function (resolve, reject) {
          Firebase.database().ref('catalogo/'+ean).once('value').then(
                 (payload) => {
                       if (payload.val()) dispatch(foundCatalogItem(payload.val()));
                       else {
                       		dispatch(notFoundCatalogItem());
                       		dispatch(searchCloudItem(ean));
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
  return function(dispatch) {
    Firebase.database().ref('catalogo/'+ean).update(slicedItem).then(response => {
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

this.listenTotaliChanged = (urlObject) =>
{
    const type = this.TOTALI_CHANGED;
    const totaliUrl = this.totaliUrl;
	 return function(dispatch, getState) {
    	Firebase.database().ref(urlFactory(getState,totaliUrl, urlObject)).on('value', snapshot => {
    		dispatch({
    		 type: type,
        	 payload: snapshot.val()
    		})
    	});
	}
}	


//Non ritorna nessuna azione e non crea nessuna actionCreator... per coerenza di architettura...
this.offListenTotaliChanged = (urlObject) =>
{   
	const totaliUrl = this.totaliUrl;
	return function(dispatch, getState) {
	Firebase.database().ref(urlFactory(getState,totaliUrl, urlObject)).off();
    };
}



//Genero tre listener... come un'unica funzione...
this.listenItem = (urlObject) => {
   const type1 = this.ADDED_ITEM;
   const type2 = this.CHANGED_ITEM;
   const type3 = this.DELETED_ITEM;
   
   const itemsUrl = this.itemsUrl;	
  return function(dispatch, getState) {
  	const url = urlFactory(getState,itemsUrl, urlObject);
  
    Firebase.database().ref(url).on('child_added', snapshot => {
      dispatch({
        type: type1,
        payload: snapshot
      })
    });
   Firebase.database().ref(url).on('child_changed', snapshot => {
      dispatch({
        type: type2,
        payload: snapshot
      })  
   });
   Firebase.database().ref(url).on('child_removed', snapshot => {
      dispatch({
        type: type3,
        payload: snapshot
      })  
   });
  }
}


//Non ritorna nessuna azione e non crea nessuna actionCreator
this.offListenItem = (urlObject) =>
{   const itemsUrl = this.itemsUrl;
	return function(dispatch, getState) {
	Firebase.database().ref(urlFactory(getState,itemsUrl, urlObject)).off();
    }
}




//Disattivata la componente che opera sul magazzino...
this.aggiungiItem = (urlObject,valori) => {
  var nuovoItem = {...valori};
  const itemsUrl = this.itemsUrl;
  const toggleTableScroll = this.toggleTableScroll;
   addCreatedStamp(nuovoItem);
   this.preparaItem(nuovoItem);
  return function(dispatch,getState) {
   
   dispatch(toggleTableScroll(true));    //Mi metto alla fine della tabella
   //DA CAPIRE COME GESTIRLO!!! 
    //Questa riga è stata modificata.. totali calcolati da una function...
    
    //Firebase.database().ref(prefissoNegozio(getState) +'bolle/' + bolla + '/righe').push().set(nuovaRigaBolla);
    Firebase.database().ref(urlFactory(getState,itemsUrl, urlObject)).push().set(nuovoItem);
  	
  }
}

//Idem...
this.aggiornaItem = (urlObject,valori) => {
	
    var nuovoItem = {...valori};
      addChangedStamp(nuovoItem);
   this.preparaItem(nuovoItem);
    const itemUrl = this.itemUrl;
      return function(dispatch,getState) {

    Firebase.database().ref(urlFactory(getState,itemUrl, urlObject)).update(nuovoItem).then(response => {
    });
  }
  
}

//Ripristinata a prima del magazzino...
this.deleteItem = (urlObject) => {
  const itemUrl = this.itemUrl;
  return function(dispatch, getState) {
  Firebase.database().ref(urlFactory(getState,itemUrl, urlObject)).remove().then(response => {
  })
    };
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

this.submitEditedItem = (isValid,selectedItem,urlObject,valori) => {
	      const type = this.SUBMIT_EDITED_ITEM;
	      const aggiornaItem = this.aggiornaItem;
	      const aggiungiItem = this.aggiungiItem;
	      const urlObj=urlObject;
	      if (selectedItem) urlObj['itemId'] = selectedItem.key;
	      return function(dispatch, getState) {
			dispatch({type: type});
			if (selectedItem && isValid) dispatch(aggiornaItem(urlObj,valori));
			else if(isValid) dispatch(aggiungiItem(urlObj,valori));
	      }
	}

}



