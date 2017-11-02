
//In prima istanza deve "solo" gestire un form libero
import {CHANGE_EDITED_CATALOG_ITEM, SUBMIT_EDITED_CATALOG_ITEM, SEARCH_CATALOG_ITEM, RESET_EDITED_CATALOG_ITEM,
FOUND_CATALOG_ITEM, NOT_FOUND_CATALOG_ITEM, NOT_FOUND_CLOUD_ITEM } from '../actions/catalogo';
import {isValidEAN, generateEAN} from '../helpers/ean';
import {isValidBookCode, isAmount} from '../helpers/validators';
import {errMgmt, editedItemInitialState, editedItemCopy, isValidEditedItem, noErrors, eanState, updateEANErrors} from '../helpers/form';

const editedCatalogItemValuesInitialState = 
	  {			ean: '',
				titolo: '',
				autore: '',
				editore: '',
				prezzoListino: '',
				imgUrl: ''	
	};


const editedCatalogItemInitialState = () => {
	return({...editedItemInitialState(editedCatalogItemValuesInitialState)}); 
}




const initialState = () => {

	return {
		    selectedCatalogItem: null,
			editedCatalogItem: {...editedCatalogItemInitialState()}
	    	}
    }
    
function transformAndValidateEditedCatalogItem(changedEditedCatalogItem, name, value)
{  	
	changedEditedCatalogItem.values[name] = value;
	
  //VALIDAZIONE Ricontrollo tutti i campi...a ogni change
   var ceci = changedEditedCatalogItem;	
  
  //I messaggi vengono ricalcolati a ogni iterazione...
    changedEditedCatalogItem.errorMessages = {};
    
     //Se tocco EAN il form è svalido sempre 
   if (name === 'ean') 
        {
        //Aggiorno lo stato di EAN
        eanState(ceci);
        //cancello provvisoriamente tutti gli error
        noErrors(ceci, 'ean');
		//E cancello i campi del libro...
		ceci.values.titolo = '';
		ceci.values.autore = '';
		ceci.values.editore = '';
		
		ceci.values.prezzoListino = '';
		//Rivaluto gli errori e cosa mostrare
	    updateEANErrors(ceci);
		}
   
    
   errMgmt(ceci, 'titolo','emptyField','Campo obbligatorio', ceci.values.titolo.length===0, false);
   errMgmt(ceci, 'autore','emptyField','Campo obbligatorio', ceci.values.autore.length===0, false);
  errMgmt(ceci, 'editore','emptyField','Campo obbligatorio', ceci.values.editore.length===0, false);


   
   	errMgmt(ceci, 'prezzoListino','invalidAmount','Importo (19.99)',  
   	    ((value) => {return !isAmount(value)})(ceci.values.prezzoListino), 
   	    ((value) => {return (value.length>0 && !isAmount(value))})(ceci.values.prezzoListino));
   	    
    
    //Se ho anche solo un errore... sono svalido.
    ceci.isValid = isValidEditedItem(ceci);
    return changedEditedCatalogItem;
}


export default function catalog(state = initialState(), action) {
  var newState;
  switch (action.type) {
    
      
   case CHANGE_EDITED_CATALOG_ITEM:
      	newState =  {...state, editedCatalogItem: transformAndValidateEditedCatalogItem(editedItemCopy(state.editedCatalogItem), action.name, action.value)};
		break;
  
  
   case SUBMIT_EDITED_CATALOG_ITEM:
	    //Posso sottomettere il form se lo stato della riga è valido
			
		if (state.editedCatalogItem.isValid)
	    	{
	    	newState = {...state, editedCatalogItem: {...editedCatalogItemInitialState()}}; //Reset dello stato della riga bolla...basta la copia superficiale
	    	}
	    else //Altrimenti
	    	{   let tbcEditedCatalogItem = {...state.editedCatalogItem};
                let ceci = tbcEditedCatalogItem ;
	    		//Se il form è invalid... e EAN non è valido... correggo EAN...
	    		if (isValidEAN(state.editedCatalogItem.values.ean)) 
	    		     {
	    		     	//Mostro gli errori del form...a partire dai non presenti...
	    		     	 errMgmt(ceci, 'titolo','emptyField','Campo obbligatorio', ceci.values.titolo.length===0);
						errMgmt(ceci, 'autore','emptyField','Campo obbligatorio', ceci.values.autore.length===0);
							errMgmt(ceci, 'editore','emptyField','Campo obbligatorio', ceci.values.editore.length===0);
                        errMgmt(ceci, 'prezzoListino','invalidAmount', 'Importo (19.99)',((value) => {return !isAmount(value)})(ceci.values.prezzoListino));
    	
	    		        //errMgmt(tbcEditedCatalogItem, 'form', 'bookNotFound', 'EAN non presente in catalogo', true, true);
	    		     }
	    			
	    	     
	    	    else {
	    			if (isValidBookCode(state.editedCatalogItem.values.ean)) //Altrimenti parto alla ricerca di un codice breve
	    				{
	    				ceci.values.ean = generateEAN(ceci.values.ean);
	    				ceci.eanState = 'VALID'; //Valido per definizione...appena generato
	    	        	ceci.loading = true;
	    				}
	    			else
	    				{
	    				//Se arrivo qui è un codice troppo lungo per codice e troppo corto per EAN
	    				if (ceci.eanState === 'FILL') 
	    					errMgmt(ceci, 'ean','invalidEAN','codice (max. 8) o EAN (13) ',true);
  
	    				// updateEANErrors(cerb); //Serve???
	    				}
	    			}
	    	         
	    	         //
	    			newState = {...state, editedCatalogItem: tbcEditedCatalogItem};	
	    	}
        break;
    	 
    case SEARCH_CATALOG_ITEM:
    	let tbc2EditedCatalogItem = editedItemCopy(state.editedCatalogItem);
    	tbc2EditedCatalogItem.loading = true;
    	newState = {...state, editedCatalogItem: tbc2EditedCatalogItem};
    	break;
    
    
    case NOT_FOUND_CATALOG_ITEM:
    	let tbc4EditedCatalogItem = editedItemCopy(state.editedCatalogItem);
    	tbc4EditedCatalogItem.loading = false;
    	newState = {...state, editedCatalogItem: tbc4EditedCatalogItem};
    	break;
    
  
     case FOUND_CATALOG_ITEM:
     case NOT_FOUND_CLOUD_ITEM:	
        let tbc3EditedCatalogItem = editedItemCopy(state.editedCatalogItem);
    	tbc3EditedCatalogItem.loading = false;
    	newState = {...state, editedCatalogItem: tbc3EditedCatalogItem};
    	
    	//Copio l'esito della ricerca...
    	tbc3EditedCatalogItem.values.ean = action.item.ean;
    	if (action.item.titolo) tbc3EditedCatalogItem.values.titolo = action.item.titolo; 
    	else  tbc3EditedCatalogItem.values.titolo = '';
    	if (action.item.autore) tbc3EditedCatalogItem.values.autore = action.item.autore;
    	else  tbc3EditedCatalogItem.values.autore = '';
    	if (action.item.editore) tbc3EditedCatalogItem.values.editore = action.item.editore;
    	else  tbc3EditedCatalogItem.values.editore = '';
    	if (action.item.prezzoListino) tbc3EditedCatalogItem.values.prezzoListino = action.item.prezzoListino;
    	else  tbc3EditedCatalogItem.values.prezzoListino = '';
    	
    	
     	
    	//Il form e' potenzialmente valido... valuto gli errori...
    	errMgmt(tbc3EditedCatalogItem, 'titolo','emptyField','Campo obbligatorio', tbc3EditedCatalogItem.values.titolo.length===0,false);
		errMgmt(tbc3EditedCatalogItem, 'autore','emptyField','Campo obbligatorio', tbc3EditedCatalogItem.values.autore.length===0,false);
		errMgmt(tbc3EditedCatalogItem, 'editore','emptyField','Campo obbligatorio', tbc3EditedCatalogItem.values.editore.length===0,false);
    	
    	//Se sono qui... EAN è sicuramente valido...
        
    	errMgmt(tbc3EditedCatalogItem, 'ean', 'invalidEAN': 'EAN non valido', false, false);
    	//E ho anche il prezzo
    
    	errMgmt(tbc3EditedCatalogItem, 'prezzoListino','invalidAmount', 'Importo (19.99)',((value) => {return !isAmount(value)})(tbc3EditedCatalogItem.values.prezzoListino),  false);
    	//Valuto se sono valido... 
    
    	 tbc3EditedCatalogItem.isValid = isValidEditedItem(tbc3EditedCatalogItem);
    
    		//Salvo il nuovo stato...
        newState = {...state, editedCatalogItem: tbc3EditedCatalogItem};
        break;
    
    case RESET_EDITED_CATALOG_ITEM:
   	    newState = {...state, editedCatalogItem: {...editedCatalogItemInitialState()}}; 
   	    break;
   	    
    default:
        newState =  state;
    	break;
   
  }
 return newState;
}

 export const getEditedCatalogItem = (state) => {return state.editedCatalogItem};  


