//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer';

import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  showError, noErrors} from '../helpers/form';
import {isValidEmail} from '../helpers/validators';
//Override
import {SUBMIT_EDITED_ITEM_SIGNUP, SUBMIT_NEW_PASSWORD} from '../actions/signup';
import {AUTH_ERROR_SIGNUP, DISMISS_AUTH_ERROR_SIGNUP, DISMISS_AUTH_ERROR_NEW_PASSWORD} from '../actions/signup';

//Metodi reducer per le Form
const itemR = new FormReducer('SIGNUP'); 

const editedSignupValuesInitialState = 
	  {			email: '',
				password: '',
				confirmPassword: ''
	};
const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedSignupValuesInitialState, {} ));
}




const initialState = () => {

	return {
		    editedItem: {...editedItemInitialState()}
	    	}
    }
    
    



//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedSignup(cei, name, value)
{  	
	cei.values[name] = value;

  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
    cei.errors = {};
     
//Mostro l'errore solo in fase di validazione	
   errMgmt(cei, 'email','invalidEmail','email non valida', !isValidEmail(cei.values.email), (!isValidEmail(cei.values.email) && cei.values.email.length >0));
   errMgmt(cei, 'password','blankPassword','password obbligatoria', (cei.values.password.length === 0), false);
   errMgmt(cei, 'confirmPassword','notIdentic','le password non coincidono', (!(cei.values.password === cei.values.confirmPassword)), (cei.values.confirmPassword.length > 0) && (!(cei.values.password === cei.values.confirmPassword)));
  	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}




export default function signup(state = initialState(), action) {
  var newState;
  switch (action.type) {
   //Over-ride del caso di submit... non devo cancellare il form
   case SUBMIT_EDITED_ITEM_SIGNUP:
   case SUBMIT_NEW_PASSWORD:
		    //Posso sottomettere il form se lo stato della riga è valido
			if (!state.editedItem.isValid)
		        {
		        	let cei = editedItemCopy(state.editedItem);
		    		     	showError(cei,'email'); 
		    		     	showError(cei,'password');
		    		newState = {...state, 'editedItem': cei};     	
		        }
		    else newState = state;    
	   break;
	case AUTH_ERROR_SIGNUP:
		  {
		  	let cei = editedItemCopy(state.editedItem);
		    		     errMgmt(cei,'form','loginError',action.error.message,true,true);
		    		newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;	
    case DISMISS_AUTH_ERROR_SIGNUP:
		  {
		  	let cei = editedItemCopy(state.editedItem);
		    		  noErrors(cei, 'form'); //ELIMINO GLI ERRORI DAL FORM...
		    		newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;	    
     case DISMISS_AUTH_ERROR_NEW_PASSWORD:

    	  {
		  	let cei = {...editedItemInitialState()};
		  	newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;		      
    default:
        newState = itemR.updateState(state,action,editedItemInitialState, transformAndValidateEditedSignup);
    	break;
   
  }
 return newState;
}

export const getEditedItem = (state) => {return state.editedItem};


 
      



