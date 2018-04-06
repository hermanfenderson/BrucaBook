import {FormActions} from '../helpers/formActions';

export const SCENE = 'RESA_LIBERA';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
     riga['sconto1'] = parseInt(riga['sconto1'],10) || 0;
     riga['sconto2'] = parseInt(riga['sconto2'],10) || 0;
     riga['sconto3'] = parseInt(riga['sconto3'],10) || 0;
      riga['pezzi'] = parseInt(riga['pezzi'],10) || 0;
      riga['gratis'] = parseInt(riga['gratis'],10) || 0;
      riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
     riga['prezzoTotale'] = parseFloat(riga['prezzoTotale']).toFixed(2);
   }

   



//METODI DEL FORM
//Il true... indica che voglio la gestione dello stock nei messaggi informativi
export const rigaResaFA = new FormActions(SCENE, preparaItem, 'righeResa','righeElencoRese', true);


//Se devo fare override.... definisco metodi alternativi qui...


