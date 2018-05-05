import Firebase from 'firebase';

import {FormActions} from '../helpers/formActions';
import {urlFactory} from '../helpers/firebase';

export const SCENE = 'INVENTARIO';
export const GENERA_RIGHE_INVENTARIO = 'GENERA_RIGHE_INVENTARIO';
export const DATA_MAGAZZINO_CHANGED = 'DATA_MAGAZZINO_CHANGED';
export const LISTEN_STORICO_MAGAZZINO_INVENTARIO = 'LISTEN_STORICO_MAGAZZINO_INVENTARIO';
export const UNLISTEN_STORICO_MAGAZZINO_INVENTARIO = 'UNLISTEN_STORICO_MAGAZZINO_INVENTARIO';
export const INITIAL_LOAD_STORICO_MAGAZZINO_INVENTARIO = 'INITIAL_LOAD_STORICO_MAGAZZINO_INVENTARIO';

export const ADDED_STORICO_MAGAZZINO_INVENTARIO = 'ADDED_STORICO_MAGAZZINO_INVENTARIO';
export const CHANGED_STORICO_MAGAZZINO_INVENTARIO = 'CHANGED_STORICO_MAGAZZINO_INVENTARIO';
export const DELETED_STORICO_MAGAZZINO_INVENTARIO = 'DELETED_STORICO_MAGAZZINO_INVENTARIO';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
      riga['pezzi'] = parseInt(riga['pezzi'],10) || 0;
      riga['prezzoListino'] = parseFloat(riga['prezzoListino']).toFixed(2);
   }

   

//Traccia per il seguito...
// Firebase.database().ref(dateStoricoMagazzino).orderByKey().endAt(dataInventario - 1).limitToLast(1).once
//Preso il valore so quale storicoMagazzino devo seguire in modo "convenzionale"
//A questo punto... devo ossevare aggiunte e cancellazioni...
//Se ho aggiunte...e ho una data che non mi interessa... me ne frego. Altrimenti comincio a seguire la nuova data
//Se ho cancellazioni... me ne frego a meno che non ha toccato proprio la data che stavo seguendo...e allora ricomiuncio...

//METODI DEL FORM
//Il true... indica che voglio la gestione dello stock nei messaggi informativi
export const rigaInventarioFA = new FormActions(SCENE, preparaItem, 'righeInventario','righeElencoInventari', true, true, true);


export function generaRighe(inventarioId, dataInventario)
{
//Seleziono tutto il magazzino... riga per riga devo decidere cosa fare..
//Se non c'e la riga nell'elenco...la aggiungo con pinned true
return function(dispatch, getState) {
	const url = urlFactory(getState,'magazzino', null);
	Firebase.database().ref(url).once('value', snapshot => {
		  const righe = getState().inventario.estrattoStoricoMagazzino;
		  const index = getState().inventario.itemsArrayIndex;
		  const stock2 = getState().inventario.stock;
		  const data = getState().inventario.testata.dataInventario;
    
		  for (var propt in righe) 
			{
			 let stock = stock2[propt];
			 if (!(index[propt]>=0) && (stock !== 0)) 
				{   let row = {...snapshot.val()[propt], ean: propt, pinned: true, pezzi: 0, stock: stock, data: data, dataInventario: data }
				    console.log(row);
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


