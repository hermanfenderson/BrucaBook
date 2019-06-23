import {FormActions} from '../helpers/formActions';

export const SCENE = 'ORDINE';
export const SET_ORDINI_MODAL_VISIBLE = 'SET_ORDINI_MODAL_VISIBLE';

//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
     riga['sconto'] = parseInt(riga['sconto'],10) || 0;
      riga['pezzi'] = parseInt(riga['pezzi'],10) || 0;
      riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
     riga['prezzoTotale'] = parseFloat(riga['prezzoTotale']).toFixed(2);
   }

   
export function setOrdiniModalVisible(visible) 
	{
		return ({type: SET_ORDINI_MODAL_VISIBLE, visible: visible})
	}



//METODI DEL FORM
//Il true... indica che voglio la gestione dello stock nei messaggi informativi
export const rigaOrdineFA = new FormActions(SCENE, preparaItem, 'righeOrdine','righeElencoOrdini', true);

//Se devo fare override.... definisco metodi alternativi qui...


