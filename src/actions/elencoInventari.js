import {FormActions} from '../helpers/formActions';
import Firebase from 'firebase';
import {urlFactory, addCreatedStamp} from '../helpers/firebase'

export const SCENE = 'ELENCOINVENTARI';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataInventario'] = riga['dataInventario'].valueOf();
   	riga['data'] = riga['dataInventario']; 
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	//if ('totali' in riga) {delete riga.totali}
   	//IN questo caso... calcolo un pezzo di totali...spostata...
   	
//   	if (!riga['totali']) riga['totali'] = {magazzino: store.getState().magazzino.itemsArray.length, righe: 0}
   	
    
     }








//METODI DEL FORM
export const inventarioFA = new FormActions(SCENE, preparaItem, 'righeElencoInventari');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...

inventarioFA.aggiungiItem = (params, valori) => { 
	return function(dispatch, getState) {

	const url = urlFactory(getState,'magazzino', null);
	Firebase.database().ref(url).once('value', snapshot => {
	    const righe = snapshot.val();
	    let totale = 0;
	    for (var propt in righe)
	    	{
	    		if (righe[propt].pezzi !== 0) totale++;
	    	}
	    let nuovoItem = {...valori};
	    nuovoItem.totali = {magazzino: totale, righe: 0};
	    
		const typeAdd = 'ADD_ITEM_ELENCOINVENTARI';
		const itemsUrl = 'righeElencoInventari';
		addCreatedStamp(nuovoItem);
		preparaItem(nuovoItem);
		dispatch(inventarioFA.toggleTableScroll(true));    //Mi metto alla fine della tabella
		var ref; 
	    ref  =  Firebase.database().ref(urlFactory(getState,itemsUrl, params)).push();
	    ref.set(nuovoItem);
		dispatch(
	   	{
	   		type: typeAdd,
	   		key: ref.key
	   	}
	   	)  	
	})
  }
}
