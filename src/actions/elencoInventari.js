import {FormActions} from '../helpers/formActions';

export const SCENE = 'ELENCOINVENTARI';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataInventario'] = riga['dataInventario'].valueOf();
   	riga['data'] = riga['dataInventario']; 
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	if ('totali' in riga) {delete riga.totali}
   	
    
     }








//METODI DEL FORM
export const inventarioFA = new FormActions(SCENE, preparaItem, 'righeElencoInventari');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...


	

