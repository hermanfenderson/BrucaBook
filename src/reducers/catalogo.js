
//In prima istanza deve "solo" gestire un form libero
import FormReducer from '../helpers/formReducer'

import {SUBMIT_EDITED_CATALOG_ITEM,  RESET_EDITED_CATALOG_ITEM} from '../actions/catalogo';


import {isValidEAN, generateEAN} from '../helpers/ean';
import {isValidBookCode, isAmount} from '../helpers/validators';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, noErrors, eanState, updateEANErrors} from '../helpers/form';
const FOUND_CATALOG_ITEM = 'FOUND_CATALOG_ITEM_CATALOGO';
const NOT_FOUND_CLOUD_ITEM = 'NOT_FOUND_CLOUD_ITEM_CATALOGO';
const FOUND_CLOUD_ITEM = 'FOUND_CLOUD_ITEM_CATALOGO';



const editedCatalogValuesInitialState = 
	  {			ean: '',
				titolo: '',
				autore: '',
				editore: '',
				prezzoListino: '',
				iva: '',
				imgUrl: '',
				imgFirebaseUrl: ''
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedCatalogValuesInitialState, {} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
	return initialStateHelper(eiis,{ selectedCatalogItem: null, saveGeneral: false});
    }
    


    
    
    

//Metodi reducer per le Form
const catalogoR = new FormReducer('CATALOGO', foundCompleteItem, null, null, initialState); 

function foundCompleteItem(editedItem, action) 
	{   
		let cei = editedItemCopy(editedItem);
		cei.values = {...cei.values, ...action.item}
        /*
       	//Copio l'esito della ricerca...
    	cei.values.titolo = action.item.titolo;
    	cei.values.autore = action.item.autore;
    	cei.values.prezzoListino = action.item.prezzoListino;
    	if ('editore' in cei.values) cei.values.editore = action.item.editore;
    	*/
    	
    	//Il form e' potenzialmente valido... sgancio gli errori...
    	//Se sono qui... EAN è sicuramente valido...
        noErrors(cei,'ean');
        noErrors(cei,'form');
        noErrors(cei,'prezzoUnitario');
      	 cei.isValid = isValidEditedItem(cei);
      	 
       return(cei);
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
  errMgmt(ceci, 'imgFirebaseUrl','loading','Attendi upload per salvare', (ceci.values.imgFirebaseUrl === 'uploading'), false);
   

   
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
    
  /*    
   case CHANGE_EDITED_CATALOG_ITEM:
      	newState =  {...state, editedCatalogItem: transformAndValidateEditedCatalogItem(editedItemCopy(state.editedCatalogItem), action.name, action.value)};
		break;
  
  */
  
   case SUBMIT_EDITED_CATALOG_ITEM:
	    //Posso sottomettere il form se lo stato della riga è valido
		console.log("Sono qui");	
		if (state.editedItem.isValid)
	    	{
	        
	    	newState = {...state, saveGeneral: false, editedItem: {...editedItemInitialState()}}; //Reset dello stato della riga bolla...basta la copia superficiale
	    	}
	    else //Altrimenti
	    	{   let tbcEditedCatalogItem = {...state.editedItem};
                let ceci = tbcEditedCatalogItem ;
	    		//Se il form è invalid... e EAN non è valido... correggo EAN...
	    		if (isValidEAN(state.editedItem.values.ean)) 
	    		     {
	    		     	//Mostro gli errori del form...a partire dai non presenti...
	    		     	 errMgmt(ceci, 'titolo','emptyField','Campo obbligatorio', ceci.values.titolo.length===0);
						errMgmt(ceci, 'autore','emptyField','Campo obbligatorio', ceci.values.autore.length===0);
							errMgmt(ceci, 'editore','emptyField','Campo obbligatorio', ceci.values.editore.length===0);
                        errMgmt(ceci, 'prezzoListino','invalidAmount', 'Importo (19.99)',((value) => {return !isAmount(value)})(ceci.values.prezzoListino));
    	
	    		        //errMgmt(tbcEditedCatalogItem, 'form', 'bookNotFound', 'EAN non presente in catalogo', true, true);
	    		     }
	    			
	    	     
	    	    else {
	    			if (isValidBookCode(state.editedItem.values.ean)) //Altrimenti parto alla ricerca di un codice breve
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
	    	        console.log(tbcEditedCatalogItem.errorMessages);
	    	         //
	    			newState = {...state, editedItem: tbcEditedCatalogItem};	
	    	}
        break;
     case 'SHOW_CATALOG_FORM_ERRORS':
     	{
     	 let tbcEditedCatalogItem = {...state.editedItem};
         let ceci = tbcEditedCatalogItem ;
	    		
     	 errMgmt(ceci, 'titolo','emptyField','Campo obbligatorio', ceci.values.titolo.length===0);
		 errMgmt(ceci, 'autore','emptyField','Campo obbligatorio', ceci.values.autore.length===0);
		 errMgmt(ceci, 'editore','emptyField','Campo obbligatorio', ceci.values.editore.length===0);
         errMgmt(ceci, 'prezzoListino','invalidAmount', 'Importo (19.99)',((value) => {return !isAmount(value)})(ceci.values.prezzoListino));
    	 newState = {...state, editedItem: ceci};
     	}
     	break;
     case FOUND_CATALOG_ITEM:
     case NOT_FOUND_CLOUD_ITEM:	
     case FOUND_CLOUD_ITEM:
        let tbc3EditedCatalogItem = editedItemCopy(state.editedItem);
    	tbc3EditedCatalogItem.loading = false;
    	let saveGeneral =  (action.type === NOT_FOUND_CLOUD_ITEM) ? true : false;
    	
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
    	if (action.item.imgFirebaseUrl) tbc3EditedCatalogItem.values.imgFirebaseUrl = action.item.imgFirebaseUrl; 
    	else  tbc3EditedCatalogItem.values.imgFirebaseUrl = '';
    
    	tbc3EditedCatalogItem.values.iva = 'a0'; //Eventualmente la cambi in anagrafica...
    	
     	
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
        newState = {...state, editedItem: tbc3EditedCatalogItem, saveGeneral: saveGeneral};
        break;
    
    
    case RESET_EDITED_CATALOG_ITEM:
   	    newState = {...state, editedItem: {...editedItemInitialState()}}; 
   	    break;
   	    
    default:
        newState = catalogoR.updateState(state,action,editedItemInitialState, transformAndValidateEditedCatalogItem);
        //newState =  state;
    	break;
   
  }
 return newState;
}

 export const getEditedCatalogItem = (state) => {return state.editedItem};  
 export const getSaveGeneral = (state) => {return state.saveGeneral};  
 

