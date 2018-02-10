import {FormActions} from '../helpers/formActions';
import {moment2period, setDay} from '../helpers/form';
import moment from 'moment';

export const SCENE = 'ELENCORESE';
export const SET_PERIOD_ELENCORESE = 'SET_PERIOD_ELENCORESE'


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataDocumento'] = setDay(riga['dataDocumento']);
   	riga['dataScarico'] = setDay(riga['dataScarico']);
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

//Setto bolla aperta o chiusa
export const setStato = (listeningTestata, testata, stato)	=> 
{   
let newTestata = {...testata, dataDocumento: moment(testata.dataDocumento), dataScarico: moment(testata.dataScarico), stato : stato};
return function(dispatch)
	{
	dispatch(resaFA.aggiornaItem(listeningTestata.params, listeningTestata.itemId, newTestata));
	}
}

