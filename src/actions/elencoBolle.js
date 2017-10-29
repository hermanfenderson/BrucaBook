//Ci metto anche i metodi rigaBolla...

import {addCreatedStamp,addChangedStamp} from '../helpers/firebase';
export const SCENE = 'ELENCOBOLLE';
export const RESET_ELENCOBOLLE = 'RESET_ELENCOBOLLE';
export const GOTO_BOLLA = 'GOTO_BOLLA';

import {FormActions} from '../helpers/formActions';
import {STORE_MEASURE} from './index';


import Firebase from 'firebase';

//Questa genera i path... e mi dorvrebbe aggiungere flessibilità...
import {urlFactory} from '../helpers/firebase';

export const SET_READ_ONLY_BOLLA_FORM = 'SET_READ_ONLY_BOLLA_FORM';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataDocumento'] = riga['dataDocumento'].valueOf();
   	riga['dataCarico'] = riga['dataCarico'].valueOf();
    
     }


export const setReadOnlyBollaForm = () =>
{
	return ({'type': SET_READ_ONLY_BOLLA_FORM});
}

export const gotoBolla = () =>
{
	return ({'type': GOTO_BOLLA});
}

export function resetElencoBolle() {
return{type: RESET_ELENCOBOLLE};
  }

//METODI DEL FORM
export const bollaFA = new FormActions(SCENE, preparaItem, 'rigaElencoBolle', 'righeElencoBolle','');

//Se devo fare override.... definisco metodi alternativi qui...


