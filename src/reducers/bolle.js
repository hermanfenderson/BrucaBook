//Ci metto dentro anche i metodi di rigaBolla...

import {ADDED_RIGA_BOLLA } from '../actions/bolle';
import {DELETED_RIGA_BOLLA } from '../actions/bolle';
import {CHANGED_RIGA_BOLLA, CHANGE_EDITED_RIGA_BOLLA, SUBMIT_EDITED_RIGA_BOLLA, TOTALI_CHANGED } from '../actions/bolle';
import {SET_SELECTED_RIGA_BOLLA } from '../actions/bolle';
import {TABLE_BOLLA_WILL_SCROLL } from '../actions/bolle';
import {RESET_BOLLA } from '../actions/bolle';

import { childAdded, childDeleted, childChanged } from '../helpers/firebase';

const editedRigaBollaValuesInitialState = 
{			ean: '',
			titolo: '',
			autore: '',
			prezzoListino: '7.50',
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

 
const editedRigaBollaInitialState = { values:{...editedRigaBollaValuesInitialState},
		errors: {},
		isValid: false,
		selectedRigaBolla: null
		};
		
const initialState =  {
  righeBollaArray: [],
  righeBollaArrayIndex: {},
  selectedRigaBolla: null,
   tableBollaWillScroll: false,
   totali: {pezzi : 0, gratis : 0, prezzoTotale : 0.0},
   editedRigaBolla: {...editedRigaBollaInitialState}
};

function discountPrice(prezzoListino, sconto1, sconto2, sconto3)
{  
  return ((1 - sconto1/100) *((1 - sconto2 /100) *((1 - sconto3/100) * prezzoListino))).toFixed(2);    
}  


//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformEditedRigaBolla(state, name, value)
{  	
	let changedEditedRigaBolla = {...state.editedRigaBolla}; 
	changedEditedRigaBolla.values[name] = value;
	switch (name) {
		case 'sconto1':
		case 'sconto2':
	    case 'sconto3':
	    case 'manSconto':
			if (changedEditedRigaBolla.values['prezzoListino'] > 0)
				{
				const prezzoListino = changedEditedRigaBolla.values['prezzoListino'];	
				const sconto1 = changedEditedRigaBolla.values['sconto1'];
				const sconto2 = changedEditedRigaBolla.values['sconto2'];
				const sconto3 = changedEditedRigaBolla.values['sconto3'];
				const pezzi = changedEditedRigaBolla.values['pezzi'];
				const manSconto = changedEditedRigaBolla.values['manSconto'];
				if (manSconto ) changedEditedRigaBolla.values['prezzoUnitario'] = prezzoListino;
				else changedEditedRigaBolla.values['prezzoUnitario'] = discountPrice(prezzoListino, sconto1, sconto2, sconto3);
				const prezzoUnitario = changedEditedRigaBolla.values['prezzoUnitario'];
			    changedEditedRigaBolla.values['prezzoTotale'] =  pezzi * prezzoUnitario;
				}
		break;		
		case 'pezzi':
			const pezzi = changedEditedRigaBolla.values['pezzi'];
			const prezzoUnitario = changedEditedRigaBolla.values['prezzoUnitario'];
			changedEditedRigaBolla.values['prezzoTotale'] =  pezzi * prezzoUnitario;
		break;
		
		default:
		break;
		
	}
	return changedEditedRigaBolla;
}


export default function bolle(state = initialState, action) {
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
      	newState =  {...initialState};
		break;
      
   case CHANGE_EDITED_RIGA_BOLLA:
      	const changedEditedRigaBolla = transformEditedRigaBolla(state, action.name, action.value);
      	newState =  {...state, editedRigaBolla: changedEditedRigaBolla};
		break;
		
   case SUBMIT_EDITED_RIGA_BOLLA:
	    //Posso sottomettere il form se lo stato della riga è valido
			
		if (state.editedRigaBolla.isValid)
	    	{
	    	let tbcEditedRigaBolla = {...editedRigaBollaInitialState, values: {...editedRigaBollaValuesInitialState}};	
	    	newState = {...state, editedRigaBolla: tbcEditedRigaBolla}; //Reset dello stato della riga bolla...
	    	}
	    else //Altrimenti
	    	{   let tbcEditedRigaBolla = {...state.editedRigaBolla};
	    	    tbcEditedRigaBolla.values.ean = '99999';
	    	    tbcEditedRigaBolla.isValid = true;
	    		newState = {...state, editedRigaBolla: tbcEditedRigaBolla};
	    	}
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
 
 
      



