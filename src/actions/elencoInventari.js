import {FormActions} from '../helpers/formActions';
import {setDay} from '../helpers/form';

export const SCENE = 'ELENCOINVENTARI';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataInventario'] = setDay(riga['dataInventario']);
   	riga['data'] = riga['dataInventario']; 
  
    
     }








//METODI DEL FORM
export const inventarioFA = new FormActions(SCENE, preparaItem, 'righeElencoInventari');


