import Firebase from 'firebase';

import {FormActions} from '../helpers/formActions';
import {urlFactory, addCreatedStamp, addChangedStamp} from '../helpers/firebase';

export const SCENE = 'INVENTARIO';
export const GENERA_RIGHE_INVENTARIO = 'GENERA_RIGHE_INVENTARIO';

export const LISTEN_REGISTRO_EAN = 'LISTEN_REGISTRO_EAN';
export const UNLISTEN_REGISTRO_EAN = 'UNLISTEN_REGISTRO_EAN';
export const ADDED_REGISTRO_EAN = 'ADDED_REGISTRO_EAN';
export const CHANGED_REGISTRO_EAN = 'CHANGED_REGISTRO_EAN';
export const DELETED_REGISTRO_EAN = 'DELETED_REGISTRO_EAN';

//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
      riga['pezzi'] = parseInt(riga['pezzi'],10) || 0;
      riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
   }

   


//METODI DEL FORM
//Il true... indica che voglio la gestione dello stock nei messaggi informativi
export const rigaInventarioFA = new FormActions(SCENE, preparaItem, 'righeInventario','righeElencoInventari', true, true, true);

//Se devo fare override.... definisco metodi alternativi qui...



export function generaRighe(inventarioId, dataInventario)
{
//Seleziono tutto il magazzino... riga per riga devo decidere cosa fare..
//Se non c'e la riga nell'elenco...la aggiungo con pinned true
return function(dispatch, getState) {
	const url = urlFactory(getState,'magazzino', null);
	Firebase.database().ref(url).once('value', snapshot => {
		  const righe = getState().inventario.registroEAN;
		  const index = getState().inventario.itemsArrayIndex;
		  const stock2 = getState().inventario.stock;
		  console.log(stock2);
		  for (var propt in righe) 
			{
			 let stock = stock2[propt];
			 if (!(index[propt]>=0) && (stock !== 0)) 
				{   let row = {...snapshot.val()[propt], ean: propt, pinned: true, pezzi: 0, stock: stock }
				    
					dispatch(rigaInventarioFA.aggiungiItem(inventarioId,row));
				}
			}
	      dispatch({
	        type: GENERA_RIGHE_INVENTARIO,
	        payload: snapshot
	      })
		});    
	}

}


   
export function listenRegistroEAN(idInventario)
{
	
//Genero tre listener... come un'unica funzione...

   
   return function(dispatch, getState) {
  	const url = urlFactory(getState,'registroEAN');
  	if (url)
    {  
    
       const listener_added = Firebase.database().ref(url).on('child_added', snapshot => {
	      dispatch({
	        type: ADDED_REGISTRO_EAN,
	        payload: snapshot
	      })
	      let updatedTotali = {magazzino: getState().inventario.totaleOccorrenze};
	      Firebase.database().ref(urlFactory(getState,'totaliInventario', idInventario)).update(updatedTotali);
 

  
	      });
	   const listener_changed = Firebase.database().ref(url).on('child_changed', snapshot => {
	      dispatch({
	        type: CHANGED_REGISTRO_EAN,
	        payload: snapshot
	      })
	         let updatedTotali = {magazzino: getState().inventario.totaleOccorrenze};
	      Firebase.database().ref(urlFactory(getState,'totaliInventario', idInventario)).update(updatedTotali);
 
	   });
	   const listener_removed = Firebase.database().ref(url).on('child_removed', snapshot => {
	      dispatch({
	        type: DELETED_REGISTRO_EAN,
	        payload: snapshot
	      })
	         let updatedTotali = {magazzino: getState().inventario.totaleOccorrenze};
	      Firebase.database().ref(urlFactory(getState,'totaliInventario', idInventario)).update(updatedTotali);
 
	   });
	   dispatch({
	   	type: LISTEN_REGISTRO_EAN,
	   	params: '',
	   	listeners: {added: listener_added,changed: listener_changed, removed: listener_removed} 
	   })
	}   
	else dispatch({
	   	type: LISTEN_REGISTRO_EAN,
	   	params: null,
	   })   
  }
  
}

//Uso il fatto che id ha già il path giusto... trucchismo...
export function unlistenRegistroEAN()
{
return function(dispatch, getState) {	
	Firebase.database().ref(urlFactory(getState,'registroEAN')).off();
		dispatch({
		   	type: UNLISTEN_REGISTRO_EAN,
		   	params: ''
		   })

	}
}

 rigaInventarioFA.aggiungiItem = (params, valori) => {
  const typeAdd =  rigaInventarioFA.ADD_ITEM;
  var nuovoItem = {...valori};
  const itemsUrl = rigaInventarioFA.itemsUrl;
  const stockMessageQueue = rigaInventarioFA.stockMessageQueue;
  const stockMessageQueueListener = rigaInventarioFA.stockMessageQueueListener;
  const toggleTableScroll = rigaInventarioFA.toggleTableScroll;
   addCreatedStamp(nuovoItem);
   rigaInventarioFA.preparaItem(nuovoItem);
    return function(dispatch,getState) {
   
   dispatch(toggleTableScroll(true));    //Mi metto alla fine della tabella
   var ref; 
    ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params)).push();
    ref.set(nuovoItem);
    
    
   dispatch(
   	{
   		type: typeAdd,
   		key: ref.key
   	}
   	)  	
   if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));	
   const idInventario = params;
   let updatedTotali = {righe: getState().inventario.itemsArray.length, lastActionKey: ref.key};
   Firebase.database().ref(urlFactory(getState,'totaliInventario', idInventario)).update(updatedTotali);
   
   return(ref.key);
  }
  
}

 rigaInventarioFA.aggiornaItem = (params,itemId, valori) => {
    const typeChange = rigaInventarioFA.CHANGE_ITEM;
 	 const stockMessageQueue = rigaInventarioFA.stockMessageQueue;
 const stockMessageQueueListener = rigaInventarioFA.stockMessageQueueListener;
  
    var nuovoItem = {...valori};
      addChangedStamp(nuovoItem);
   rigaInventarioFA.preparaItem(nuovoItem);
    const itemsUrl = rigaInventarioFA.itemsUrl;
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
   	const idInventario = params;

    let updatedTotali = {righe: getState().inventario.itemsArray.length, lastActionKey: itemId};
   Firebase.database().ref(urlFactory(getState,'totaliInventario', idInventario)).update(updatedTotali);
     	 return(itemId); 
  }
 
}




//Una forzatura chiedere ean come parametro aggiuntivo in alcuni casi......ma mi evito una chiamata del tutto inutile
 rigaInventarioFA.deleteItem = (params, itemId, valori=null) => {
const typeDelete = rigaInventarioFA.DELETE_ITEM;
const itemsUrl = rigaInventarioFA.itemsUrl;
const stockMessageQueue = rigaInventarioFA.stockMessageQueue;
 const stockMessageQueueListener = rigaInventarioFA.stockMessageQueueListener;
  

  return function(dispatch, getState) {
    Firebase.database().ref(urlFactory(getState,itemsUrl,params, itemId)).remove();
      dispatch(
					{
   					type: typeDelete,
   					key: itemId
   					}
   					)   
   	if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));		
   const idInventario = params;

    let updatedTotali = {righe: getState().inventario.itemsArray.length, lastActionKey: itemId};
   Firebase.database().ref(urlFactory(getState,'totaliInventario', idInventario)).update(updatedTotali);

    };
  }


