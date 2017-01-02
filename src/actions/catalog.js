import Firebase from 'firebase';
import request from 'superagent';
import { actions } from 'react-redux-form';


export const UPDATE_CATALOG_ITEM = 'UPDATE_CATALOG_ITEM';
export const SEARCH_CATALOG_ITEM = 'SEARCH_CATALOG_ITEM';
export const SET_CATALOG_STATE = 'SET_CATALOG_STATE';
export const SET_CATALOG_ITEM = 'SET_CATALOG_ITEM';
export const SET_CATALOG_EAN = 'SET_CATALOG_EAN';


export const IDLE = 'IDLE';
export const SEARCH = 'SEARCH';
export const FAIL = 'FAIL';
export const ABORT = 'ABORT';
export const INCOMPLETE = 'INCOMPLETE';
export const OK = 'OK';

//Gestione degli stati...
export function setStatus(status, statusText = "")
{
  return(
    {type: SET_CATALOG_STATE,
     status: status,
     statusText: statusText
    }
  )
}

export function setCatalogItem(item)
{return({
  type: SET_CATALOG_ITEM,
  item: item
   }
  )
}

export function setCatalogEAN(ean)
{return({
  type: SET_CATALOG_EAN,
  ean: ean
  })
}

export function searchIBSItem(ean)
{
  return function(dispatch) {
          dispatch(setStatus(SEARCH,"Ricerca in IBS"));
          dispatch(setCatalogEAN(ean));
          var promise = new Promise( function (resolve, reject) {
	  request.get('https://linode.hermanfenderson.com/ibs.php?ean='+ean).then(
                  (response, ean) => {
                                var book = JSON.parse(response.text);
                                dispatch(setStatus(OK,"Ricerca in IBS terminata"));
                                dispatch(setCatalogItem(book));
                                resolve(book, ean);
                             }
                  )
          })
	  return promise;   
 }
}


export function searchCatalogItem(ean)
  { 
  return function(dispatch) {
      dispatch(setStatus(SEARCH,"Ricerca in catalogo"));
      dispatch(setCatalogEAN(ean));
      var promise = new Promise( function (resolve, reject) {
          Firebase.database().ref('catalogo/'+ean).once('value').then(
                 (payload) => {
                       if (payload.val()) 
                    		{dispatch(setStatus(OK,"Ricerca OK in catalogo"));
                    		dispatch(setCatalogItem(payload.val()));
                    		}
                       else dispatch(setStatus(FAIL,"Ricerca fallita in catalogo"));
                       resolve(payload);}                
                 )})        
          return promise;
  }       
}

export function fillFormWithItem(ean,row)
{ return function(dispatch) {
  dispatch(actions.change('form2.itemCatalog.ean', ean));
  dispatch(actions.change('form2.itemCatalog.titolo', row.titolo));
  dispatch(actions.change('form2.itemCatalog.autore', row.autore));
    dispatch(actions.change('form2.itemCatalog.editore', row.editore));
  dispatch(actions.change('form2.itemCatalog.prezzoListino', row.prezzoListino));
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
      console.log(response); 
      dispatch({
        type: UPDATE_CATALOG_ITEM
      });
    });
  }
}
