import {FormActions} from '../helpers/formActions';
import Firebase from 'firebase';
import {urlFactory, addCreatedStamp,addChangedStamp} from '../helpers/firebase';

import moment from 'moment';
export const SCENE = 'CASSA';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
   	riga['oraScontrino'] = riga['oraScontrino'].valueOf();
   	
     
   }

   



//METODI DEL FORM
export const cassaFA = new FormActions(SCENE, preparaItem, 'righeElencoScontrini','righeElencoCasse');


//Se devo fare override.... definisco metodi alternativi qui...
//Devo proprio scriverla del tutto diversa...
cassaFA.aggiungiItem = (params, valori) => {
	//Prendo il numero scontrino e la data cassa dalla cassa madre...
	const anno = params[0];
	const mese = params[1];
	const cassa = params[2];
	var numero = null;
	var dataCassa = null;
	var oraScontrino = null;
		
	return function(dispatch,getState) 
	   {
	   	const refCassa = Firebase.database().ref(urlFactory(getState,'righeElencoCasse',[anno,mese],cassa));
		refCassa.transaction( function(cassa) {
    		if (cassa) 
    			{
    			cassa.ultimoScontrino++;
    			numero = cassa.ultimoScontrino;
    			dataCassa = cassa.dataCassa;
    			oraScontrino = moment(dataCassa);
    			oraScontrino.hour(moment().hour());
    			oraScontrino.minute(moment().minute());
    			console.log(oraScontrino);
    			}
    		return cassa;
			}).then(function(success) {
			
			valori.numero = numero;
			valori.dataCassa = dataCassa;
			valori.oraScontrino = oraScontrino.valueOf();
			const typeAdd =  cassaFA.ADD_ITEM;
			var nuovoItem = {...valori};
			addCreatedStamp(nuovoItem);
			preparaItem(nuovoItem);
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

cassaFA.aggiornaItem = (params,itemId, valori) => {
	//Prendo la data cassa dalla cassa madre...
	//Neu valori... trovo anche il vecchio numeroScontrino... che poi dovro' togliere...
	const anno = params[0];
	const mese = params[1];
	const cassa = params[2];
	const oldNumero = valori['oldNumero'];
	const numeroKey = valori['numeroKey'];
   
	delete valori['oldNumero']; //Non mi serve più
	delete valori['numeroKey']; //Non mi serve più
	
	
	const numero = valori['numero'];

	return function(dispatch,getState) 
	   {
	   	const refCassa = Firebase.database().ref(urlFactory(getState,'righeElencoCasse',[anno,mese],cassa));
		refCassa.transaction( function(cassa) {
    		if (cassa) 
    			{
    			if (numero > cassa.ultimoScontrino) cassa.ultimoScontrino = numero;
    			}
    		return cassa;
			}).then(function(success) {
			
		   const typeChange =  cassaFA.CHANGE_ITEM;
			var nuovoItem = {...valori};
			addChangedStamp(nuovoItem);
			preparaItem(nuovoItem);
  
			var ref  = Firebase.database().ref(urlFactory(getState,'righeElencoScontrini', [anno,mese,cassa], itemId));
           ref.update(nuovoItem);
			dispatch(
   					{
   					type: typeChange,
   					key: ref.key
   					}
   					)  	
			nuovoItem['key'] = ref.key;
			dispatch(cassaFA.setSelectedItem(nuovoItem));
			
			//Se devo swappare i numeri lo faccio qui...
			
			if (numeroKey)
				{
				ref  = Firebase.database().ref(urlFactory(getState,'righeElencoScontrini', [anno,mese,cassa], numeroKey));	
				ref.update({'numero' : oldNumero});	
				}
			
			})



			//Non mi serve chiamare la funzione originale...
			//dispatch(aggiungiItemSuper(params, valori));
		
		}
}



