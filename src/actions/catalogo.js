
import Firebase from 'firebase';

import {FormActions} from '../helpers/formActions';
import {isValidEAN, generateEAN, isInternalEAN} from '../helpers/ean';
import {isValidBookCode} from '../helpers/validators';

export const SCENE = 'CATALOGO';


export const SUBMIT_EDITED_CATALOG_ITEM = 'SUBMIT_EDITED_CATALOG_ITEM_CATALOGO';
export const RESET_EDITED_CATALOG_ITEM = 'RESET_EDITED_CATALOG_ITEM_CATALOGO';

//La tabella a cui punto è direttamente magazzino...
export const catalogoFA = new FormActions(SCENE, null, 'magazzino');





//Azione richiamata sia perchè il campo EAN è stato attivato per "codice breve"
//Sia perchè a campi validi... si può scrivere...

export const submitEditedCatalogItem = (isValid, item, scene, saveGeneral) => {
      return function(dispatch, getState) {
		if(isValid)	
		    {   item['prezzoListino'] = parseFloat(item['prezzoListino']).toFixed(2); //Formato corretto...
		    
		      	//Salvo globalmente solo se sto facendo entry di un item nuovo... che non sia un codice interno. Altrimenti le modifiche sono tutte locali...
		    	if (saveGeneral && !isInternalEAN(item.ean) ) dispatch(catalogoFA.updateGeneralCatalogItem(item))
		    	
		    	  //Se e' nuovo a magazzino metto lo stock a zero...
		        let magazzinoIndex = getState().magazzino.itemsArrayIndex;
		        //Gestisco l'inserimento di una nuova riga...
		        if (magazzinoIndex[item.ean] === undefined) 
		        	{
		        	item.pezzi = 0;
		        	item.createdAt = Firebase.database.ServerValue.TIMESTAMP;
		        	}
		    	dispatch(catalogoFA.updateCatalogItem(item))
		    
		    }
		  //Pezzaccia per far comparire gli errori...  
         else if (isValidEAN(item.ean)) dispatch({type: 'SHOW_CATALOG_FORM_ERRORS'});
         else if(isValidBookCode(item.ean)) dispatch(catalogoFA.changeEditedItem('ean', generateEAN(item.ean)));
			
      dispatch({type: 'SUBMIT_EDITED_CATALOG_ITEM_'+scene, isValid:isValid, item:item});
      
      }
}	

export function resetEditedCatalogItem(scene)
	{
		return function(dispatch) {
		dispatch ({
			type: RESET_EDITED_CATALOG_ITEM,
			})
		if (scene) 	
			dispatch ({
			type: 'RESET_EDITED_CATALOG_ITEM_'+scene,
			})
		}
		
	}



