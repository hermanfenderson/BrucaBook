import {FormActions} from '../helpers/formActions';
import {moment2period} from '../helpers/form';

export const SCENE = 'ELENCOBOLLE';
export const SET_PERIOD_ELENCOBOLLE = 'SET_PERIOD_ELENCOBOLLE'


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataDocumento'] = riga['dataDocumento'].valueOf();
   	riga['dataCarico'] = riga['dataCarico'].valueOf();
   	if (riga['dataRendiconto']) riga['dataRendiconto'] = riga['dataRendiconto'].valueOf();
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	if ('totali' in riga) {delete riga.totali}
   	
    
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




//METODI DEL FORM
export const bollaFA = new FormActions(SCENE, preparaItem, 'righeElencoBolle');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...


	

