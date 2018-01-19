import {FormActions} from '../helpers/formActions';

export const SCENE = 'FORNITORI';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
//   	riga['dataInventario'] = riga['dataInventario'].valueOf();
//   	riga['data'] = riga['dataInventario']; 
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	//if ('totali' in riga) {delete riga.totali}
   	//IN questo caso... calcolo un pezzo di totali...spostata...
   	
//   	if (!riga['totali']) riga['totali'] = {magazzino: store.getState().magazzino.itemsArray.length, righe: 0}
   	
    
     }




//METODI DEL FORM
export const fornitoriFA = new FormActions(SCENE, preparaItem, 'fornitori');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...

