//Ci metto dentro anche i metodi di rigaBolla...

import {ADDED_RIGA_BOLLA } from '../actions/bolle';
import {DELETED_RIGA_BOLLA } from '../actions/bolle';
import {CHANGED_RIGA_BOLLA, CHANGE_EDITED_RIGA_BOLLA, SUBMIT_EDITED_RIGA_BOLLA, TOTALI_CHANGED } from '../actions/bolle';
import {SET_SELECTED_RIGA_BOLLA } from '../actions/bolle';
import {TABLE_BOLLA_WILL_SCROLL } from '../actions/bolle';
import {RESET_BOLLA } from '../actions/bolle';
import {SET_CATALOG_STATE, SET_CATALOG_ITEM } from '../actions/catalog';


import { childAdded, childDeleted, childChanged } from '../helpers/firebase';
import {isValidEAN, generateEAN} from '../helpers/ean';
import {addError, isValidBookCode, isAmount, isNotNegativeInteger, isPercentage} from '../helpers/validators';



const editedRigaBollaInitialState = () => {
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

 //La form viene gestita con uno stato di validità generale... isValid
 //errors è un oggetto con chiavi uguali ai campi e uno per il form in se..
 //ha codici di errore non parlanti...
 
 //errorMessages è identico ad errors ma contiene SOLO gli errori da mostrare...
 //entrambe le strutture vengono calcolate ad ogni change...
 
 
	return { values:{...editedRigaBollaValuesInitialState},
			errors: {},
			errorMessages: {},
			isValid: false,
			selectedRigaBolla: null,
			loading: false
			};
}		

const initialState = () => {

	return {
			righeBollaArray: [],
			righeBollaArrayIndex: {},
		    selectedRigaBolla: null,
			tableBollaWillScroll: false,
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
	if (name !== 'prezzoUnitario')
		{
		if (manSconto) changedEditedRigaBolla.values['prezzoUnitario'] = prezzoListino;
		else changedEditedRigaBolla.values['prezzoUnitario'] = discountPrice(prezzoListino, sconto1, sconto2, sconto3);
		}
	const prezzoUnitario = changedEditedRigaBolla.values['prezzoUnitario'];
	changedEditedRigaBolla.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);	
}

//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformEditedRigaBolla(changedEditedRigaBolla, name, value)
{  	
	changedEditedRigaBolla.values[name] = value;
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
			changedEditedRigaBolla.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);
	    break;
		
		default:
		break;
		
	}
	 
	return changedEditedRigaBolla;
}

function validateFormEditedRigaBolla(changedEditedRigaBolla, name, value)
{   //Ricontrollo tutti i campi...a ogni change
   	
    changedEditedRigaBolla.isValid = true; //Basta un errore e passo a false
     changedEditedRigaBolla.errors = {};
    changedEditedRigaBolla.errorMessages = {};
   if (name === 'ean')  changedEditedRigaBolla.isValid = false; //Se tocco EAN il form è svalido sempre
   //ean deve essere EAN valido MA mostro l'errore solo in fase di validazione...
   if (!isValidEAN(changedEditedRigaBolla.values.ean)) 
		{
		addError(changedEditedRigaBolla.errors,'ean','invalidEAN');
		 
		 changedEditedRigaBolla.isValid = false;
		} 
		
   if (!isValidBookCode(changedEditedRigaBolla.values.ean) && changedEditedRigaBolla.values.ean.length<=13) 
		{addError(changedEditedRigaBolla.errors,'ean','invalidBookCode');
		 changedEditedRigaBolla.errorMessages.ean = 'EAN è un numero';
		 changedEditedRigaBolla.isValid = false;
		}      
   
   if (!isValidBookCode(changedEditedRigaBolla.values.ean) && changedEditedRigaBolla.values.ean.length>13) 
		{addError(changedEditedRigaBolla.errors,'ean','toolongBookCode');
		 changedEditedRigaBolla.errorMessages.ean = 'Codice troppo lungo';
		 changedEditedRigaBolla.isValid = false;
		}      
   				
   if (!isPercentage(changedEditedRigaBolla.values.sconto1)) 
		{addError(changedEditedRigaBolla.errors,'sconto1','invalidPercentage');
		 changedEditedRigaBolla.errorMessages.sconto1='0-99';
		 changedEditedRigaBolla.isValid = false;
		}   
   if (!isPercentage(changedEditedRigaBolla.values.sconto2)) 
		{addError(changedEditedRigaBolla.errors,'sconto2','invalidPercentage');
		 changedEditedRigaBolla.errorMessages.sconto2='0-99';
		 changedEditedRigaBolla.isValid = false;
		}     
    if (!isPercentage(changedEditedRigaBolla.values.sconto3)) 
		{addError(changedEditedRigaBolla.errors,'sconto3','invalidPercentage');
		 changedEditedRigaBolla.errorMessages.sconto3='0-99';
		 changedEditedRigaBolla.isValid = false;
		} 
	if (!isAmount(changedEditedRigaBolla.values.prezzoUnitario)) 
		{addError(changedEditedRigaBolla.errors,'prezzoUnitario','invalidAmount');
		 if (changedEditedRigaBolla.values.prezzoUnitario.length > 0) changedEditedRigaBolla.errorMessages.prezzoUnitario='Importo (19.99)';
		 changedEditedRigaBolla.isValid = false;
		}  	
     if (!isNotNegativeInteger(changedEditedRigaBolla.values.pezzi)) 
		{addError(changedEditedRigaBolla.errors,'pezzi','notPositive');
		 changedEditedRigaBolla.errorMessages.pezzi='numero intero';
		 changedEditedRigaBolla.isValid = false;
		}  
	  if (!isNotNegativeInteger(changedEditedRigaBolla.values.gratis)) 
		{addError(changedEditedRigaBolla.errors,'gratis','notPositive');
		 changedEditedRigaBolla.errorMessages.gratis='numero intero';
		 changedEditedRigaBolla.isValid = false;
		}  
		 changedEditedRigaBolla.errorMessages.ean='';
		 changedEditedRigaBolla.errorMessages.form='Correggi pirla!';
		 
		
	return changedEditedRigaBolla;
	
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
   
   case SET_SELECTED_RIGA_BOLLA:
       newState =  {...state, selectedRigaBolla: action.row}; 
	   break;
   
   case TABLE_BOLLA_WILL_SCROLL:
       newState =  {...state,tableBollaWillScroll: action.scroll}; 
       break;
     
   case RESET_BOLLA:
      	newState =  {...initialState()};
		break;
      
   case CHANGE_EDITED_RIGA_BOLLA:
   	    const values = {...state.editedRigaBolla.values};
   	   const errors = {...state.editedRigaBolla.errors};
	    const errorMessages = {...state.editedRigaBolla.errorMessages};
	   let tbc4EditedRigaBolla = {...state.editedRigaBolla, values: values, errors: errors, errorMessages: errorMessages};
	    const changedEditedRigaBolla = validateFormEditedRigaBolla(transformEditedRigaBolla(tbc4EditedRigaBolla, action.name, action.value), action.name, action.value);
      	newState =  {...state, editedRigaBolla: changedEditedRigaBolla};
		break;
		
   case SUBMIT_EDITED_RIGA_BOLLA:
	    //Posso sottomettere il form se lo stato della riga è valido
			
		if (state.editedRigaBolla.isValid)
	    	{
	    	let tbcEditedRigaBolla = {...editedRigaBollaInitialState()};	
	    	newState = {...state, editedRigaBolla: tbcEditedRigaBolla}; //Reset dello stato della riga bolla...
	    	}
	    else //Altrimenti
	    	{   
	    		//Se il form è invalid... e EAN non è valido... correggo EAN...DEVO MIGLIORARE 
	    		if (isValidEAN(state.editedRigaBolla.values.ean)) newState = state;
	    		else {
	    			let tbcEditedRigaBolla = {...state.editedRigaBolla};
	    		    tbcEditedRigaBolla.values.ean = generateEAN(tbcEditedRigaBolla.values.ean);
	    	    	newState = {...state, editedRigaBolla: tbcEditedRigaBolla};
	    			}
	    	}
        break;
        
    case SET_CATALOG_ITEM:
    	let tbcEditedRigaBollaValues = {...state.editedRigaBolla.values};
    	//Il form e' valido... 
    	let tbcEditedRigaBolla = {...state.editedRigaBolla, isValid : true};
    	//Copio l'esito della ricerca...
    	tbcEditedRigaBollaValues.titolo = action.item.titolo;
    	tbcEditedRigaBollaValues.autore = action.item.autore;
    	tbcEditedRigaBollaValues.prezzoListino = action.item.prezzoListino;
    	tbcEditedRigaBolla.values = tbcEditedRigaBollaValues;
    	//Aggiorno i prezi e i totali
    	if (tbcEditedRigaBolla.values['prezzoListino'] > 0) pricesMgmt(tbcEditedRigaBolla,'prezzoListino');
    	//Salvo il nuovo stato...
        newState = {...state, editedRigaBolla: tbcEditedRigaBolla};
        break;
        
    case SET_CATALOG_STATE:
    	let tbc2EditedRigaBolla = {...state.editedRigaBolla};
    	if (action.status === 'SEARCH') tbc2EditedRigaBolla.loading = true;
    	else tbc2EditedRigaBolla.loading = false;
    	newState = {...state, editedRigaBolla: tbc2EditedRigaBolla}
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
 
 
      



