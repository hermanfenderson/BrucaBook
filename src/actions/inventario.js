import {FormActions} from '../helpers/formActions';

export const SCENE = 'INVENTARIO';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
      riga['pezzi'] = parseInt(riga['pezzi'],10) || 0;
      riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
   }

   



//METODI DEL FORM
//Il true... indica che voglio la gestione dello stock nei messaggi informativi
export const rigaInventarioFA = new FormActions(SCENE, preparaItem, 'righeInventario','righeElencoInventari', true, true, true);

//Se devo fare override.... definisco metodi alternativi qui...


