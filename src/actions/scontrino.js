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
     //Elimino i riferimenti ai totali (che vengono calcolati e non vanno persistiti... e al tipo che serve solo in visualizzazione)
     	if ('totali' in riga) {delete riga.totali};
     	if ('tipo' in riga) {delete riga.tipo};
     	
    
   }

   



//METODI DEL FORM
export const rigaScontrinoFA = new FormActions(SCENE, preparaItem, 'righeScontrino','righeElencoScontrini', true);

//Se devo fare override.... definisco metodi alternativi qui...


