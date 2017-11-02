//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import moment from 'moment';
import 'moment/locale/it';

import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem} from '../helpers/form';

import {SET_READ_ONLY_BOLLA_FORM, RESET_ELENCOBOLLE, GOTO_BOLLA} from '../actions/elencoBolle';

moment.locale("it");

//Metodi reducer per le Form

const editedBollaValuesInitialState = 
	  {			riferimento: '',
				fornitore: '',
				dataDocumento: moment(),
				dataCarico: moment()	
	};
const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedBollaValuesInitialState, {} ));
}


const transformEditedBolla = (row) =>
{   row.dataDocumento = moment(row.dataDocumento).format("L");
	row.dataCarico = moment(row.dataCarico).format("L");
}	

const transformSelectedItem = (cei) =>
{
	cei.dataDocumento = moment(cei.dataDocumento,"DD/MM/YYYY");
	cei.dataCarico = moment(cei.dataCarico,"DD/MM/YYYY");
}

const bollaR = new FormReducer('ELENCOBOLLE',null, transformEditedBolla, transformSelectedItem); 

const initialState = () => {

	return {
			itemsArray: [],
			itemsArrayIndex: {},
		    tableScroll: false,
			willGotoBolla: false,
			tableHeight:200,
			editedItem: {...editedItemInitialState()}
	    	}
    }
    


//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedBolla(cei, name, value)
{  	
	cei.values[name] = value;

  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
   
   errMgmt(cei, 'riferimento','required','Campo obbligatorio',  (cei.values.riferimento.length === 0), false);
   errMgmt(cei, 'fornitore','required','Campo obbligatorio',  (cei.values.fornitore.length === 0), false);
   errMgmt(cei, 'dataDocumento','invalidDate','Data non valida',  (!cei.values.dataDocumento.isValid()));
    errMgmt(cei, 'dataCarico','invalidDate','Data non valida',  (!cei.values.dataCarico.isValid()));
   
   	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}



export default function elencoBolle(state = initialState(), action) {
  var newState;
  switch (action.type) {
    case SET_READ_ONLY_BOLLA_FORM:
     let cei = editedItemCopy(state.editedItem);
     cei.readOnlyForm=true;
     newState = {...state, editedItem: cei };	
     break;
     
    case GOTO_BOLLA:
      newState = {...state, willGotoBolla: true }	
     break;	
     
    case RESET_ELENCOBOLLE:
    const tableHeight = state.tableHeight;
      	newState =  {...initialState(), tableHeight: tableHeight};
      	break;
    default:
        newState = bollaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedBolla);
        //newState =  state;
    	break;
   
  }
 return newState;
}

//Il mio primo selettore colocato https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers!!!
//Questi rimarranno identici in tutti i casi... Posso migliorare queste ripetizioni inutili?
 export const getItems = (state) => {return state.itemsArray};  
 export const getEditedItem = (state) => {return state.editedItem};  
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getTableScroll = (state)  => {return state.tableScroll};
 export const getReadOnlyForm = (state) => {return state.editedItem.readOnlyForm};
 export const getGotoBolla = (state) => {return state.willGotoBolla};
 
 
      



