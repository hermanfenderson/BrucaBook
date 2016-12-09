import Firebase from 'firebase';

export const UPDATE_CATALOG_ITEM = 'UPDATE_CATALOG_ITEM';
export const SEARCH_CATALOG_ITEM = 'SEARCH_CATALOG_ITEM';

//Questa chiamata ritorna una promessa... non è una azione

export function searchCatalogItem(ean)
{
  return(Firebase.database().ref('catalogo/'+ean).once('value'))
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
