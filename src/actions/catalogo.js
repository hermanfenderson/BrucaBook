import Firebase from 'firebase';
import request from 'superagent';
import {isComplete} from '../helpers/catalog'
import {isInternalEAN} from '../helpers/ean'

//Azioni legate ad azioni di ricerca
export const UPDATE_CATALOG_ITEM = 'UPDATE_CATALOG_ITEM';
export const SEARCH_CATALOG_ITEM = 'SEARCH_CATALOG_ITEM';
export const SEARCH_CLOUD_ITEM = 'SEARCH_CLOUD_ITEM';
export const FOUND_CLOUD_ITEM = 'FOUND_CLOUD_ITEM';
export const FOUND_CATALOG_ITEM = 'FOUND_CATALOG_ITEM';
export const NOT_FOUND_CLOUD_ITEM = 'NOT_FOUND_CLOUD_ITEM';
export const NOT_FOUND_CATALOG_ITEM = 'NOT_FOUND_CATALOG_ITEM';

//Azioni legate al form
export const CHANGE_EDITED_CATALOG_ITEM = 'CHANGE_EDITED_CATALOG_ITEM';
export const SUBMIT_EDITED_CATALOG_ITEM = 'SUBMIT_EDITED_CATALOG_ITEM';
export const RESET_EDITED_CATALOG_ITEM = 'RESET_EDITED_CATALOG_ITEM';


export function foundCatalogItem(item)
{return({
  type: FOUND_CATALOG_ITEM,
  item: item
   }
  )
}

export function foundCloudItem(ean,item)
{
	return function(dispatch) {
  	     item['ean'] = ean; //La ricerca non lo contiene...
	   dispatch({type: FOUND_CLOUD_ITEM,item});	
	   dispatch(updateCatalogItem(item)); //Persisto il risultato del cloud...
		
	}
}

//Copro anche il caso dei ritorni parziali...
export function notFoundCloudItem(ean,item)
{
	return function(dispatch) {
       item['ean'] = ean;
  	   dispatch({type: NOT_FOUND_CLOUD_ITEM, item:item});	
	}
}

export function notFoundCatalogItem()
{return({
  type: NOT_FOUND_CATALOG_ITEM,
   }
  )
}


export function searchCloudItem(ean)
{ 
  return function(dispatch) {
  	   dispatch({type: SEARCH_CLOUD_ITEM});
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


export function searchCatalogItem(ean)
  { 
   return function(dispatch) {
   dispatch({type: SEARCH_CATALOG_ITEM});
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
export function updateCatalogItem(item)
{
  const ean = item.ean;
  const slicedItem = {...item};
  delete slicedItem.ean;
  return function(dispatch) {
    Firebase.database().ref('catalogo/'+ean).update(slicedItem).then(response => {
      dispatch({
        type: UPDATE_CATALOG_ITEM,
        item: item
      });
    });
  }
}


//Funzione chiamata quando cambia un campo del form...
//Mando un oggetto nel formato... campo e valore
export function changeEditedCatalogItem(name,value) {
   	return {
		type: CHANGE_EDITED_CATALOG_ITEM,
    	name: name,
    	value: value
		}
}

//Azione richiamata sia perchè il campo EAN è stato attivato per "codice breve"
//Sia perchè a campi validi... si può scrivere...

export function submitEditedCatalogItem(isValid, item, scene) {
      return function(dispatch, getState) {
		if(isValid)	
		    {   item['prezzoListino'] = parseFloat(item['prezzoListino']).toFixed(2); //Formato corretto...
		    	dispatch(updateCatalogItem(item))
		    };

      dispatch({type: SUBMIT_EDITED_CATALOG_ITEM, isValid:isValid, item:item});
      if (scene) dispatch({type: 'SUBMIT_EDITED_CATALOG_ITEM_'+scene, isValid:isValid, item:item});
      
      }
}	

export function resetEditedCatalogItem(scene)
	{
		return function(dispatch) {
		dispatch ({
			type: RESET_EDITED_CATALOG_ITEM,
			})
		if (scene) 	
			dispatch ({
			type: 'RESET_EDITED_CATALOG_ITEM_'+scene,
			})
		}
		
	}



