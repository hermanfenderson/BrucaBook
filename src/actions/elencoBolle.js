import {FormActions} from '../helpers/formActions';
import moment from 'moment';
import Firebase from 'firebase';

import {addCreatedStamp,addChangedStamp,urlFactory} from '../helpers/firebase';

export const SCENE = 'ELENCOBOLLE';
export const RESET_ELENCOBOLLE = 'RESET_ELENCOBOLLE';
export const SET_READ_ONLY_BOLLA_FORM = 'SET_READ_ONLY_BOLLA_FORM';
export const SET_PERIOD_ELENCOBOLLE = 'SET_PERIOD_ELENCOBOLLE'


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataDocumento'] = riga['dataDocumento'].valueOf();
   	riga['dataCarico'] = riga['dataCarico'].valueOf();
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	if ('totali' in riga) {delete riga.totali}
   	
    
     }


export const setReadOnlyBollaForm = () =>
{
	return ({'type': SET_READ_ONLY_BOLLA_FORM});
}


export const setPeriodElencoBolle = (period) =>
{
	return(
		 {
		 	'type': SET_PERIOD_ELENCOBOLLE,
		 	period: period
		 }
		)
}


export function resetElencoBolle() {
return{type: RESET_ELENCOBOLLE};
  }

//METODI DEL FORM
export const bollaFA = new FormActions(SCENE, preparaItem, 'rigaElencoBolle', 'righeElencoBolle','');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...


bollaFA.submitEditedItem = (isValid,selectedItem,urlObject,valori) => {
	      const type = bollaFA.SUBMIT_EDITED_ITEM;
	      return function(dispatch, getState) {
			dispatch({type: type});
			if (isValid)
			{
				const anno=moment(valori.dataDocumento).year();
				const mese=moment(valori.dataDocumento).month() + 1; //Non zero based
				var nuovoItem = {...valori};
				selectedItem ? addChangedStamp(nuovoItem) : addCreatedStamp(nuovoItem);  
				bollaFA.preparaItem(nuovoItem);
			    var urlObjectPeriodo = {'anno': anno, 'mese': mese}; //Lo persisto  anche nella bolla singola
				const key = selectedItem ? selectedItem.key : Firebase.database().ref(urlFactory(getState,'righeElencoBolle', urlObjectPeriodo)).push().key;
				var urlObjectPeriodoItem = {...urlObjectPeriodo, 'bollaId': key, 'itemId': key};
				Firebase.database().ref(urlFactory(getState,'periodoBolla', urlObjectPeriodoItem)).update(urlObjectPeriodo);
				Firebase.database().ref(urlFactory(getState,'rigaElencoBolle', urlObjectPeriodoItem)).update(nuovoItem);
					
				
				//Caso aggiornamento
				if (selectedItem && isValid) 
					{
					const oldAnno = moment(selectedItem.dataDocumento,"DD/MM/YYYY").year();
					const oldMese = moment(selectedItem.dataDocumento,"DD/MM/YYYY").month()+1;
					
					if ((anno !== oldAnno) || (mese !== oldMese))
							{
							urlObjectPeriodoItem.anno = oldAnno;
							urlObjectPeriodoItem.mese = oldMese;
							Firebase.database().ref(urlFactory(getState,'rigaElencoBolle', urlObjectPeriodoItem)).remove();
							}          
		    		}			
			  }	
	      }
	}
	




//Ripristinata a prima del magazzino...
bollaFA.deleteItem = (urlObject, valori) => {
 const anno=moment(valori.dataDocumento, "DD/MM/YYYY").year();
  const mese=moment(valori.dataDocumento, "DD/MM/YYYY").month()+1;
  const urlObjectPeriod = {...urlObject, 'anno': anno, 'mese': mese, 'bollaId': urlObject.itemId}; //Lo persisto  anche nella bolla singola
  console.log(urlObjectPeriod);					     
  return function(dispatch, getState) {
  	Firebase.database().ref(urlFactory(getState,'bolla', urlObjectPeriod)).remove();
  Firebase.database().ref(urlFactory(getState,'rigaElencoBolle', urlObjectPeriod)).remove()
    };
  }
	
	