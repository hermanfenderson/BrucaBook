import {FormActions} from '../helpers/formActions';

export const SCENE = 'ELENCOBOLLE';
export const RESET_ELENCOBOLLE = 'RESET_ELENCOBOLLE';
export const SET_READ_ONLY_BOLLA_FORM = 'SET_READ_ONLY_BOLLA_FORM';


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


export function resetElencoBolle() {
return{type: RESET_ELENCOBOLLE};
  }

//METODI DEL FORM
export const bollaFA = new FormActions(SCENE, preparaItem, 'rigaElencoBolle', 'righeElencoBolle','');

//Se devo fare override.... definisco metodi alternativi qui...


