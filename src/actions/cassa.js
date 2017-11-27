import {FormActions} from '../helpers/formActions';
import Firebase from 'firebase';
import {urlFactory} from '../helpers/firebase';
import { browserHistory } from 'react-router';

export const SCENE = 'CASSA';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
   	
     
   }

   



//METODI DEL FORM
export const cassaFA = new FormActions(SCENE, preparaItem, 'righeElencoScontrini','righeElencoCasse');


//Se devo fare override.... definisco metodi alternativi qui...
//Devo proprio scriverla del tutto diversa...
//var aggiungiItemSuper = cassaFA.aggiungiItem;
cassaFA.aggiungiItem = (params, valori) => {
	//Prendo il numero scontrino e la data cassa dalla cassa madre...
	const anno = params[0];
	const mese = params[1];
	const cassa = params[2];
	var numero = null;
	var dataCassa = null;
		
	return function(dispatch,getState) 
	   {
	   	const refCassa = Firebase.database().ref(urlFactory(getState,'righeElencoCasse',[anno,mese],cassa));
		refCassa.transaction( function(cassa) {
    		if (cassa) 
    			{
    			cassa.ultimoScontrino++;
    			numero = cassa.ultimoScontrino;
    			dataCassa = cassa.dataCassa;
    			}
    		return cassa;
			}).then(function(success) {
			
			valori.numero = numero;
			valori.dataCassa = dataCassa;
			const typeAdd =  cassaFA.ADD_ITEM;
			var nuovoItem = {...valori};
			const toggleTableScroll = cassaFA.toggleTableScroll;
			dispatch(toggleTableScroll(true));    //Mi metto alla fine della tabella
    	    const ref  = Firebase.database().ref(urlFactory(getState,'righeElencoScontrini', [anno,mese,cassa])).push();
    		ref.set(nuovoItem);
			dispatch(
   					{
   					type: typeAdd,
   					key: ref.key
   					}
   					)  	
			nuovoItem['key'] = ref.key;
			dispatch(cassaFA.setSelectedItem(nuovoItem));
			})

			//Non mi serve chiamare la funzione originale...
			//dispatch(aggiungiItemSuper(params, valori));
		
			
}
}



