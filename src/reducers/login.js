//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer';

import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  showError} from '../helpers/form';
import {isValidEmail} from '../helpers/validators';
//Override
import {SUBMIT_EDITED_ITEM_LOGIN} from '../actions/login';
import {AUTH_ERROR} from '../actions';

//Metodi reducer per le Form
const itemR = new FormReducer('LOGIN'); 

const editedLoginValuesInitialState = 
	  {			email: '',
				password: ''
	};
const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedLoginValuesInitialState, {} ));
}




const initialState = () => {

	return {
		    editedItem: {...editedItemInitialState()}
	    	}
    }
    
    



//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedItem(cei, name, value)
{  	
	cei.values[name] = value;

  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
    cei.errors = {}; //In questo caso annullo anche gli errori...
   
//Mostro l'errore solo in fase di validazione	
   errMgmt(cei, 'email','invalidEmail','email non valida', !isValidEmail(cei.values.email), (!isValidEmail(cei.values.email) && cei.values.email.length >0));
   errMgmt(cei, 'password','blankPassword','password obbligatoria', (cei.values.password.length === 0), false);
   
  	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}




export default function login(state = initialState(), action) {
  var newState;
  switch (action.type) {
   //Over-ride del caso di submit... non devo cancellare il form
   case SUBMIT_EDITED_ITEM_LOGIN:
		    //Posso sottomettere il form se lo stato della riga è valido
			if (!state.editedItem.isValid)
		        {
		        	var cei = editedItemCopy(state.editedItem);
		    		     	showError(cei,'email'); 
		    		     	showError(cei,'password');
		    		newState = {...state, 'editedItem': cei};     	
		        }
		    else newState = state;    
	   break;
	case AUTH_ERROR:
		  {
		  	var cei = editedItemCopy(state.editedItem);
		  	             console.log(action.payload.message);
		    		     errMgmt(cei,'form','loginError',action.payload.message,true,true);
		    		newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;		  
    default:
        newState = itemR.updateState(state,action,editedItemInitialState, transformAndValidateEditedItem);
    	break;
   
  }
 return newState;
}

export const getEditedItem = (state) => {return state.editedItem};


 
      



