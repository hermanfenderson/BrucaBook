import {FormActions} from '../helpers/formActions';
import {moment2period} from '../helpers/form';

export const SCENE = 'ELENCORESE';
export const SET_PERIOD_ELENCORESE = 'SET_PERIOD_ELENCORESE'


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataDocumento'] = riga['dataDocumento'].valueOf();
   	riga['dataScarico'] = riga['dataScarico'].valueOf();
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	if ('totali' in riga) {delete riga.totali}
   	
    
     }




export const setPeriodElencoRese = (moment) =>
{
	const period = moment2period(moment);
	return(
		 {
		 	'type': SET_PERIOD_ELENCORESE,
		 	period: period
		 }
		)
}




//METODI DEL FORM
export const resaFA = new FormActions(SCENE, preparaItem, 'righeElencoRese');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...


	

