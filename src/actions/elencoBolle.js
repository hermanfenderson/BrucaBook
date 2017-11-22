import {FormActions} from '../helpers/formActions';
import moment from 'moment';
import Firebase from 'firebase';

import {addCreatedStamp,addChangedStamp,urlFactory} from '../helpers/firebase';
import {moment2period} from '../helpers/form';

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


export const setPeriodElencoBolle = (moment) =>
{
	const period = moment2period(moment);
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
export const bollaFA = new FormActions(SCENE, preparaItem, 'righeElencoBolle');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...


	

