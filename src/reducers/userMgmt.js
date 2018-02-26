//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer';

import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  showError, noErrors} from '../helpers/form';
import {isValidEmail} from '../helpers/validators';
//Override
import {SUBMIT_EDITED_ITEM_USERMGMT, RESET_MAIL_SENT, RESET_MAIL_ERROR} from '../actions/userMgmt';
import {USER_CONFIGURATION_CHANGED, AUTH_ERROR_LOGIN, DISMISS_AUTH_ERROR_LOGIN, AUTH_ERROR_SIGNUP, DISMISS_AUTH_ERROR_SIGNUP, AUTH_ERROR_NEW_PASSWORD, DISMISS_AUTH_ERROR_NEW_PASSWORD, SET_USERMGMT_MODE, RESET_USERMGMT_STATE, CODE_OK, CODE_KO} from '../actions/userMgmt';

//Metodi reducer per le Form
const itemR = new FormReducer('USERMGMT'); 

const editedSignupValuesInitialState = 
	  {			email: '',
				password: '',
				confirmPassword: '',
				nome: '',
				cognome: '',
				nick: '',
				imgFullName: '',
				remember: false
	};
const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedSignupValuesInitialState, {} ));
}




const initialState = () => {

	return {
		    editedItem: {...editedItemInitialState()},
	    	}
    }
    
    



//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedSignup(cei, name, value)
{  	
	cei.values[name] = value;
	//Trucchismo per tenere la seconda copia della password allineata nel modulo di login
    if ((name === 'password') && (cei.userMgmtMode === 'login')) cei.values.confirmPassword = value;
    if (name==='nome') cei.values.nick = value; //In fase di registrazione il nick è uguale al nome...
  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
    cei.errors = {};
     
//Mostro l'errore solo in fase di validazione	
   errMgmt(cei, 'email','invalidEmail','email non valida', !isValidEmail(cei.values.email), (!isValidEmail(cei.values.email) && cei.values.email.length >0));
   if ((cei.userMgmtMode !== 'requestPasswordReset')&& (cei.userMgmtMode !== 'configuration')) errMgmt(cei, 'password','blankPassword','password obbligatoria', (cei.values.password.length === 0), false);
   if ((cei.userMgmtMode !== 'requestPasswordReset')&&(cei.userMgmtMode !== 'configuration') )errMgmt(cei, 'confirmPassword','notIdentic','le password non coincidono', (!(cei.values.password === cei.values.confirmPassword)), (cei.values.confirmPassword.length > 0) && (!(cei.values.password === cei.values.confirmPassword)));
   if (cei.userMgmtMode === 'signup') errMgmt(cei, 'nome','blankNome','nome obbligatorio', (cei.values.nome.length === 0), false);	
   if (cei.userMgmtMode === 'signup') errMgmt(cei, 'cognome','blankCognome','Cognome obbligatorio', (cei.values.cognome.length === 0), false);	
   if (cei.userMgmtMode === 'configuration') errMgmt(cei, 'imgFullName','loading','Attendi upload per salvare', (cei.values.imgFullName === 'uploading'), false);
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}




export default function userMgmt(state = initialState(), action) {
  var newState;
  switch (action.type) {
   //Over-ride del caso di submit... non devo cancellare il form
   case CODE_OK:
   	   {
   	   let cei = editedItemCopy(state.editedItem);
		     cei.userMgmtState = 'codeOK'	
		     cei.values.email = action.email
		     noErrors(cei, 'form'); //ELIMINO GLI ERRORI DAL FORM...
		    newState = {...state, 'editedItem': cei};   
   	   }
		break    
   case CODE_KO:
   	   {
		  	let cei = editedItemCopy(state.editedItem);
		  	cei.userMgmtState = 'codeKO'	
		    		     errMgmt(cei,'form','codeError',action.error.message,true,true);
		     		newState = {...state, 'editedItem': cei};     	
		        
		  }
		  break;
		  
	case USER_CONFIGURATION_CHANGED:
		{
   	   let cei = editedItemCopy(state.editedItem);
		     cei.userMgmtState = 'changeOK'	
		     noErrors(cei, 'form'); //ELIMINO GLI ERRORI DAL FORM...
		    newState = {...state, 'editedItem': cei};   
   	   }
		break
		  
   case RESET_MAIL_SENT: 
   	{
		  	let cei = editedItemCopy(state.editedItem);
		     cei.userMgmtState = 'mailOK'	
		    		  noErrors(cei, 'form'); //ELIMINO GLI ERRORI DAL FORM...
		    		newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;	 
   case RESET_MAIL_ERROR:
   	 {
		  	let cei = editedItemCopy(state.editedItem);
		    		     errMgmt(cei,'form','mailError',action.error.message,true,true);
		    		newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;	
        
   case SUBMIT_EDITED_ITEM_USERMGMT:
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
	case AUTH_ERROR_LOGIN:
	
		  {
		  	let cei = editedItemCopy(state.editedItem);
		    		     errMgmt(cei,'form','loginError',action.error.message,true,true);
		    		newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;	
        
    case AUTH_ERROR_NEW_PASSWORD:
		  {
		  let cei = editedItemCopy(state.editedItem);
		  cei.userMgmtState = 'passwordChangeKO'
		    		    // errMgmt(cei,'form','loginError',action.error.message,true,true);
		    		newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;	
    case DISMISS_AUTH_ERROR_LOGIN:    
   		  {
		  	let cei = editedItemCopy(state.editedItem);
		     cei.userMgmtState = 'loginOK'	
		    		  noErrors(cei, 'form'); //ELIMINO GLI ERRORI DAL FORM...
		    		newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;	  
    
    case DISMISS_AUTH_ERROR_SIGNUP:
		  {
		  	let cei = editedItemCopy(state.editedItem);
		     cei.userMgmtState = 'signupOK'	
		    		  noErrors(cei, 'form'); //ELIMINO GLI ERRORI DAL FORM...
		    		newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;	   
        
     case DISMISS_AUTH_ERROR_NEW_PASSWORD:

    	  {
    	  	
		  	let cei = {...editedItemInitialState()};
		  	  cei.userMgmtState = 'passwordChangeOK'
		    
		  	newState = {...state, 'editedItem': cei};     	
		        
		  }
        break;	
     case SET_USERMGMT_MODE: 
     	{
     	let cei = editedItemCopy(state.editedItem);
		     cei.userMgmtMode = action.mode;
		    newState = {...state, 'editedItem': cei};     
     		break;
     	}
      case RESET_USERMGMT_STATE: 
     	{
     		let cei = editedItemCopy(state.editedItem);
		   cei.userMgmtState = ''
		    
		  newState = {...state, 'editedItem': cei}; 
		  break;
		   
     	}	
    default:
        newState = itemR.updateState(state,action,editedItemInitialState, transformAndValidateEditedSignup);
    	break;
   
  }
 return newState;
}

export const getEditedItem = (state) => {return state.editedItem};



 
      



