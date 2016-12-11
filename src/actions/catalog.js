import Firebase from 'firebase';
import request from 'superagent';

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

export function searchIBSItem(ean, callback)
{
  return function(dispatch) {
          console.log(ean);
          dispatch(setStatus(SEARCH,"Ricerca in IBS"));
          dispatch(setCatalogEAN(ean));
          request.get('http://www.minenna.it/test.php?ean='+ean).then(
                  (response, ean) => {
                                console.log(response.text);
                                dispatch(setStatus(OK,"Ricerca in IBS terminata"));
                                dispatch(setCatalogItem(JSON.parse(response.text)));
                                callback(response, ean);
                             }
                  )
          }
  
}


export function searchCatalogItem(ean)
  { 
  return function(dispatch) {
      dispatch(setStatus(SEARCH,"Ricerca in catalogo"));
      var promise = new Promise( function (resolve, reject) {
          Firebase.database().ref('catalogo/'+ean).once('value').then(
                 (payload) => {
                       if (payload.val) dispatch(setStatus(OK,"Ricerca OK in catalogo"));
                       else dispatch(setStatus(FAIL,"Ricerca fallita in catalogo"));
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
      console.log(response); 
      dispatch({
        type: UPDATE_CATALOG_ITEM
      });
    });
  }
}
