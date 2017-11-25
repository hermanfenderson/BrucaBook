import {FormActions} from '../helpers/formActions';

export const SCENE = 'SCONTRINO';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
     riga['sconto'] = parseInt(riga['sconto'],10) || 0;
      riga['pezzi'] = parseInt(riga['pezzi'],10) || 0;
     riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
     riga['prezzoTotale'] = parseFloat(riga['prezzoTotale']).toFixed(2);
   }

   



//METODI DEL FORM
export const scontrinoFA = new FormActions(SCENE, preparaItem, 'righeScontrino','righeElencoScontrini');

//Se devo fare override.... definisco metodi alternativi qui...

