import {FormActions} from '../helpers/formActions';
import {moment2period} from '../helpers/form';

export const SCENE = 'ELENCOCASSE';
export const SET_PERIOD_ELENCOCASSE = 'SET_PERIOD_ELENCOCASSE'


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataCassa'] = riga['dataCassa'].valueOf();
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	if ('totali' in riga) {delete riga.totali}
   	
    
     }




export const setPeriodElencoCasse = (moment) =>
{
	const period = moment2period(moment);
	return(
		 {
		 	'type': SET_PERIOD_ELENCOCASSE,
		 	period: period
		 }
		)
}




//METODI DEL FORM
export const elencoCasseFA = new FormActions(SCENE, preparaItem, 'righeElencoCasse');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...


	

