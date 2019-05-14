import {FormActions} from '../helpers/formActions';
import {eanArrayFromSubEanTree} from '../helpers/ordiniAperti';

export const SCENE = 'ORDINIAPERTI';
export const SET_ORDINIAPERTI_PER_EAN = 'SET_ORDINIAPERTI_PER_EAN';



//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   
     }


export function setOrdiniApertiperEAN(subEanTree, qty) {
	let eanArray = eanArrayFromSubEanTree(subEanTree,qty);
	return {
		eanArray: eanArray
	}	
}

//METODI DEL FORM
export const ordiniApertiFA = new FormActions(SCENE, preparaItem, 'ordiniAperti');
