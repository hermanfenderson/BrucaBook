/*
import Firebase from 'firebase';
import request from 'superagent';
import {isComplete} from '../helpers/catalog'
import {isInternalEAN} from '../helpers/ean'
*/
import {FormActions} from '../helpers/formActions';

export const SCENE = 'CATALOGO';


export const SUBMIT_EDITED_CATALOG_ITEM = 'SUBMIT_EDITED_CATALOG_ITEM_CATALOGO';
export const RESET_EDITED_CATALOG_ITEM = 'RESET_EDITED_CATALOG_ITEM_CATALOGO';


export const catalogoFA = new FormActions(SCENE, null, 'catalogoLocale');





//Azione richiamata sia perchè il campo EAN è stato attivato per "codice breve"
//Sia perchè a campi validi... si può scrivere...

export const submitEditedCatalogItem = (isValid, item, scene, saveGeneral) => {
      return function(dispatch, getState) {
		if(isValid)	
		    {   item['prezzoListino'] = parseFloat(item['prezzoListino']).toFixed(2); //Formato corretto...
		    	dispatch(catalogoFA.updateCatalogItem(item))
		    	if (saveGeneral) dispatch(catalogoFA.updateGeneralCatalogItem(item))
		    };

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



