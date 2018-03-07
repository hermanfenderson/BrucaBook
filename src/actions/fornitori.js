import {FormActions} from '../helpers/formActions';

export const SCENE = 'FORNITORI';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   
     }




//METODI DEL FORM
export const fornitoriFA = new FormActions(SCENE, preparaItem, 'fornitori');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...

