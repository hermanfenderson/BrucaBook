//Ci metto dentro anche i metodi di rigaBolla...

import {ADDED_RIGA_BOLLA } from '../actions/bolla';
import {DELETED_RIGA_BOLLA } from '../actions/bolla';
import {CHANGED_RIGA_BOLLA, CHANGE_EDITED_RIGA_BOLLA, 
		SUBMIT_EDITED_RIGA_BOLLA, TOTALI_CHANGED, RESET_EDITED_RIGA_BOLLA } from '../actions/bolla';
import {SET_SELECTED_RIGA_BOLLA } from '../actions/bolla';
import {TABLE_BOLLA_WILL_SCROLL } from '../actions/bolla';
import {RESET_BOLLA } from '../actions/bolla';
import {SEARCH_CATALOG_ITEM, SEARCH_CLOUD_ITEM, FOUND_CATALOG_ITEM, FOUND_CLOUD_ITEM, NOT_FOUND_CATALOG_ITEM, 
		NOT_FOUND_CLOUD_ITEM, SUBMIT_EDITED_CATALOG_ITEM, RESET_EDITED_CATALOG_ITEM } from '../actions/catalogo';


import { childAdded, childDeleted, childChanged } from '../helpers/firebase';
import {isValidEAN, generateEAN} from '../helpers/ean';
import {isValidBookCode, isAmount, isNotNegativeInteger, isPositiveInteger, isPercentage} from '../helpers/validators';
import {errMgmt, editedItemInitialState, editedItemCopy, isValidEditedItem, showError, noErrors,eanState, updateEANErrors} from '../helpers/form';

const editedRigaBollaValuesInitialState = 
	  {			ean: '',
				titolo: '',
				autore: '',
				prezzoListino: '',
				sconto1: '',
				sconto2: '',
				sconto3: '',
				manSconto: false,
				prezzoUnitario: '',
				pezzi: '1',
				gratis: '',
				prezzoTotale: '',
				imgUrl: ''	
	};
	
const editedRigaBollaInitialState = () => {
	return(editedItemInitialState(editedRigaBollaValuesInitialState, {} ));
}




const initialState = () => {

	return {
			righeBollaArray: [],
			righeBollaArrayIndex: {},
		    tableBollaWillScroll: false,
			showCatalogModal: false,
			totali: {pezzi : 0, gratis : 0, prezzoTotale : 0.0},
			editedRigaBolla: {...editedRigaBollaInitialState()}
	    	}
    }
    
    

function discountPrice(prezzoListino, sconto1, sconto2, sconto3)
{  
  return ((1 - sconto1/100) *((1 - sconto2 /100) *((1 - sconto3/100) * prezzoListino))).toFixed(2);    
}  

//Si comporta diversamente nei vari casi...
function pricesMgmt(changedEditedRigaBolla, name)
{
	const prezzoListino = changedEditedRigaBolla.values['prezzoListino'];	
	const sconto1 = changedEditedRigaBolla.values['sconto1'];
	const sconto2 = changedEditedRigaBolla.values['sconto2'];
	const sconto3 = changedEditedRigaBolla.values['sconto3'];
	const pezzi = changedEditedRigaBolla.values['pezzi'];
	const manSconto = changedEditedRigaBolla.values['manSconto'];
	if (name !== 'prezzoUnitario' && sconto1>=0 && sconto2>=0 && sconto3>=0)
		{
		if (manSconto) changedEditedRigaBolla.values['prezzoUnitario'] = prezzoListino;
		else changedEditedRigaBolla.values['prezzoUnitario'] = discountPrice(prezzoListino, sconto1, sconto2, sconto3);
		}
	const prezzoUnitario = changedEditedRigaBolla.values['prezzoUnitario'];
	if (prezzoUnitario >=0 && pezzi>=0) changedEditedRigaBolla.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);	
}



//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaBolla(changedEditedRigaBolla, name, value)
{  	
	changedEditedRigaBolla.values[name] = value;
	
	//Gestione cambiamenti
    switch (name) {
		case 'sconto1':
		case 'sconto2':
	    case 'sconto3':
	    case 'manSconto':
	    case 'prezzoUnitario':
	    	if (changedEditedRigaBolla.values['prezzoListino'] > 0) pricesMgmt(changedEditedRigaBolla, name);
		break;		
		case 'pezzi':
			const pezzi = changedEditedRigaBolla.values['pezzi'];
			const prezzoUnitario = changedEditedRigaBolla.values['prezzoUnitario'];
			if (prezzoUnitario >=0 && pezzi>=0) changedEditedRigaBolla.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);
	    break;
		
		default:
		break;
		
	}
	
  //VALIDAZIONE Ricontrollo tutti i campi...a ogni change
   var cerb = changedEditedRigaBolla;	
  
  //I messaggi vengono ricalcolati a ogni iterazione...
    changedEditedRigaBolla.errorMessages = {};
   
   //Se tocco EAN il form è svalido sempre 
   if (name === 'ean') 
        {
        //Aggiorno lo stato di EAN
        eanState(cerb);
        //cancello provvisoriamente tutti gli error
        noErrors(cerb, 'ean');
		//E cancello i campi del libro...
		cerb.values.titolo = '';
		cerb.values.autore = '';
		cerb.values.prezzoListino = '';
		//Rivaluto gli errori e cosa mostrare
	    updateEANErrors(cerb);
		}

  
		
   errMgmt(cerb, 'sconto1','invalidPercentage','0-99',  ((value) => {return !isPercentage(value)})(cerb.values.sconto1));
   errMgmt(cerb, 'sconto2','invalidPercentage','0-99',  ((value) => {return !isPercentage(value)})(cerb.values.sconto2));
   errMgmt(cerb, 'sconto3','invalidPercentage','0-99',  ((value) => {return !isPercentage(value)})(cerb.values.sconto3));
   	
   
   	errMgmt(cerb, 'prezzoUnitario','invalidAmount','Importo (19.99)',  
   	    ((value) => {return !isAmount(value)})(cerb.values.prezzoUnitario), 
   	    ((value) => {return (value.length>0 && !isAmount(value))})(cerb.values.prezzoUnitario));
   	    
    errMgmt(cerb, 'pezzi','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cerb.values.pezzi));
  	errMgmt(cerb, 'gratis','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cerb.values.gratis));
  
  


    errMgmt(cerb, 'pezzi','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cerb.values.pezzi));
  	errMgmt(cerb, 'gratis','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cerb.values.gratis));
  	
  	errMgmt(cerb, 'form','noItems','almeno un oggetto!',  ((pezzi,gratis) => {return (!((pezzi>=0) && (gratis>=0) && (pezzi+gratis>0)))})(cerb.values.pezzi,cerb.values.gratis),false);
  	
  	
    //Se ho anche solo un errore... sono svalido.
    changedEditedRigaBolla.isValid = isValidEditedItem(changedEditedRigaBolla);
    return changedEditedRigaBolla;
}

function foundCompleteItem(editedRigaBolla, action) 
{
		let tbc3EditedRigaBolla = editedItemCopy(editedRigaBolla);
        let tbc3EditedRigaBollaValues = tbc3EditedRigaBolla.values;
        tbc3EditedRigaBolla.loading = false;
        tbc3EditedRigaBolla.eanStatus = 'COMPLETE';
    	//Copio l'esito della ricerca...
    	tbc3EditedRigaBollaValues.titolo = action.item.titolo;
    	tbc3EditedRigaBollaValues.autore = action.item.autore;
    	tbc3EditedRigaBollaValues.prezzoListino = action.item.prezzoListino;
    	
    	//Aggiorno i prezi e i totali
    	if (tbc3EditedRigaBollaValues['prezzoListino'] > 0) pricesMgmt(tbc3EditedRigaBolla,'prezzoListino');
    	
    	//Il form e' potenzialmente valido... sgancio gli errori...
    	//Se sono qui... EAN è sicuramente valido...
        noErrors(tbc3EditedRigaBolla,'ean');
        noErrors(tbc3EditedRigaBolla,'form');
        noErrors(tbc3EditedRigaBolla,'prezzoUnitario');
      	 tbc3EditedRigaBolla.isValid = isValidEditedItem(tbc3EditedRigaBolla);
    	 return(tbc3EditedRigaBolla);
}


export default function bolle(state = initialState(), action) {
  var newState;
  switch (action.type) {
    
	case ADDED_RIGA_BOLLA:
    	newState = childAdded(action.payload, state, "righeBollaArray", "righeBollaArrayIndex"); 
    	break;
       
	case DELETED_RIGA_BOLLA:
    	newState = childDeleted(action.payload, state, "righeBollaArray", "righeBollaArrayIndex"); 
    	break;
   
	case CHANGED_RIGA_BOLLA:
    	newState = childChanged(action.payload, state, "righeBollaArray", "righeBollaArrayIndex"); 
    	break;
  
   case TOTALI_CHANGED:
       	if (action.payload) newState =  {...state, totali: action.payload};
       	else newState = state;
		break;
   
   
   //QUESTA ANDRA' CAMBIATA
   case SET_SELECTED_RIGA_BOLLA:
   	   let cerb2 = editedItemCopy(state.editedRigaBolla);
   	   cerb2.selectedItem = action.row;
   	   cerb2.values = {...action.row};
   	   cerb2.eanState = 'COMPLETE';
   	   cerb2.errors = {};
   	   cerb2.errorMessages = {};
   	   cerb2.isValid = true;
       newState =  {...state, editedRigaBolla: cerb2}; 
	   break;
   
   case TABLE_BOLLA_WILL_SCROLL:
       newState =  {...state,tableBollaWillScroll: action.scroll}; 
       break;
     
   case RESET_BOLLA:
      	newState =  {...initialState()};
		break;
   
   case RESET_EDITED_RIGA_BOLLA:
   	    newState = {...state, editedRigaBolla: {...editedRigaBollaInitialState()}}; //Reset dello stato della riga bolla...basta la copia superficiale
   	    break;
   	    
   case CHANGE_EDITED_RIGA_BOLLA:
      	newState =  {...state, editedRigaBolla: transformAndValidateEditedRigaBolla(editedItemCopy(state.editedRigaBolla), action.name, action.value)};
		break;
		
   case SUBMIT_EDITED_RIGA_BOLLA:
	    //Posso sottomettere il form se lo stato della riga è valido
			
		if (state.editedRigaBolla.isValid)
	    	{
	    	newState = {...state, editedRigaBolla: {...editedRigaBollaInitialState()}}; //Reset dello stato della riga bolla...basta la copia superficiale
	    	}
	    else //Altrimenti
	    	{   let tbcEditedRigaBolla = {...state.editedRigaBolla};
               	//Se il form è invalid... e EAN è valido... Mostro gli altri errori (non posso farti salvare...)
	    		if (isValidEAN(state.editedRigaBolla.values.ean)) 
	    		     {
	    		     	//Mostro gli errori del form...
	    		     	showError(tbcEditedRigaBolla,'form'); 
	    		     }
	    		     
	    		else {
	    			if (isValidBookCode(state.editedRigaBolla.values.ean)) //Altrimenti parto alla ricerca di un codice breve
	    				{
	    				tbcEditedRigaBolla.values.ean = generateEAN(tbcEditedRigaBolla.values.ean);
	    				tbcEditedRigaBolla.eanState = 'VALID'; //Valido per definizione...appena generato
	    	        	tbcEditedRigaBolla.loading = true;
	    				}
	    			else
	    				{
	    				//Se arrivo qui è un codice troppo lungo per codice e troppo corto per EAN
	    				if (tbcEditedRigaBolla.eanState === 'FILL') 
	    					errMgmt(tbcEditedRigaBolla, 'ean','invalidEAN','codice (max. 8) o EAN (13) ',true);
  
	    				// updateEANErrors(cerb); //Serve???
	    				}
	    			}
	    			newState = {...state, editedRigaBolla: tbcEditedRigaBolla};	
	    	}
        break;
    
    case SEARCH_CATALOG_ITEM:
    case SEARCH_CLOUD_ITEM:	
    	let tbc2EditedRigaBolla = editedItemCopy(state.editedRigaBolla);
    	tbc2EditedRigaBolla.loading = true;
    	newState = {...state, editedRigaBolla: tbc2EditedRigaBolla};
    	break;
    
    
    case NOT_FOUND_CATALOG_ITEM:
    	let tbc4EditedRigaBolla = editedItemCopy(state.editedRigaBolla);
        tbc4EditedRigaBolla.loading = false;
        tbc4EditedRigaBolla.values.titolo = '';
    	tbc4EditedRigaBolla.values.autore = '';
    	tbc4EditedRigaBolla.values.prezzoListino = '';
    	
    	newState = {...state, editedRigaBolla: tbc4EditedRigaBolla};
    	break;
    	
         
     case FOUND_CATALOG_ITEM:
     case FOUND_CLOUD_ITEM:
          newState = {...state, editedRigaBolla: foundCompleteItem(state.editedRigaBolla, action)};
          break;
          
        
        
     case NOT_FOUND_CLOUD_ITEM:
     	//COMPRENDE ANCHE I CODICI INTERNI NON VALORIZZATI....
     	  let tbc5EditedRigaBolla = editedItemCopy(state.editedRigaBolla);
     	  
          tbc5EditedRigaBolla.loading = false;
    	  newState = {...state, editedRigaBolla: tbc5EditedRigaBolla, showCatalogModal : true};
        break;
        
     case SUBMIT_EDITED_CATALOG_ITEM:
     	  //Se torno dal form sono sicuro che è completo...ma solo se il form è valido...
      	  if (action.isValid) newState = {...state, editedRigaBolla: foundCompleteItem(state.editedRigaBolla, action), showCatalogModal : false};
          else newState = state;
          break;
     
     case RESET_EDITED_CATALOG_ITEM:
     	  let erb = editedItemCopy(state.editedRigaBolla);
     	  erb.values.ean = '';
     	  erb.eanState='BLANK';
     	  newState = {...state, editedRigaBolla: erb, showCatalogModal : false};
          break;
    
    default:
        newState =  state;
    	break;
   
  }
 return newState;
}

//Il mio primo selettore colocato https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers!!!
 export const getTotaliBolla = (state) => {return state.totali};  
 export const getRigheBolla = (state) => {return state.righeBollaArray};  
 export const getEditedRigaBolla = (state) => {return state.editedRigaBolla};  
 export const getShowCatalogModal = (state) => {return state.showCatalogModal};  
 
 
      



