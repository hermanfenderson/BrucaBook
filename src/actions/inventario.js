import Firebase from 'firebase';

import {FormActions} from '../helpers/formActions';
import {urlFactory} from '../helpers/firebase'

export const SCENE = 'INVENTARIO';
export const GENERA_RIGHE_INVENTARIO = 'GENERA_RIGHE_INVENTARIO';

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


export function generaRighe(inventarioId)
{
//Seleziono tutto il magazzino... riga per riga devo decidere cosa fare..
//Se non c'e la riga nell'elenco...la aggiungo con pinned true
return function(dispatch, getState) {
	const url = urlFactory(getState,'magazzino', null);
	Firebase.database().ref(url).once('value', snapshot => {
		  const righe = snapshot.val();
		  const index = getState().inventario.itemsArrayIndex;
		  for (var propt in righe) 
			{
			 if (!(index[propt]>=0) && (righe[propt].pezzi !== 0)) 
				{   let row = {...righe[propt], ean: propt, pinned: true, pezzi: 0, stock: righe[propt].pezzi }
				    
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
