import {FormActions} from '../helpers/formActions';

export const SCENE = 'ORDINIAPERTI';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   
     }




//METODI DEL FORM
export const ordiniApertiFA = new FormActions(SCENE, preparaItem, 'ordiniAperti');
