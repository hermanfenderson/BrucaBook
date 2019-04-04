//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'

//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem} from '../helpers/form';
import {isValidEmail} from '../helpers/validators';

import {calcFormCols, calcHeader} from '../helpers/geometry';

import {STORE_MEASURE} from '../actions';


//Metodi reducer per le Form

const editedClientiValuesInitialState = 
	  {			nome: ''
	};

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedClientiValuesInitialState, {isValid: false} ));
}

const formWidth = (880 -16) * 5 / 6 -8;
const tableWidth = (880 -16)  * 5 / 6 -8;

const colSearchParams = [
	{name: 'nome', min: 120},
	{name: 'cognome', min: 120 },
	{name: 'email', min: 60 },
	{name: 'telefono', min: 120},
		{name: 'reset', min: 120, max: 180}

	];
	
const colParams = [
	{name: 'nome', min: 170},
	{name: 'cognome', min: 170 },
	{name: 'email', min: 180 },
	{name: 'telefono', min: 170}
	
	];
	
const headerParams = [{name: 'nome', label: 'Nome', min: 170},
			    {name: 'cognome', label: 'Cognome', min: 170},
			    {name: 'email', label: 'email', min: 180},
			    {name: 'telefono', label: 'telefono', min: 170},
			   ];
		



const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
				geometry: {formSearchCols: calcFormCols(colSearchParams,8,tableWidth ), formCols: calcFormCols(colParams,8,formWidth),  header: calcHeader(headerParams, tableWidth - 60)
				         }
    				}
	return initialStateHelper(eiis,extraState);
    }
    
    


const transformEditedClienti = (row) =>
{   
	
}	

const transformSelectedItem = (cei) =>
{

}

const clientiR = new FormReducer('CLIENTI',null, transformEditedClienti, transformSelectedItem, initialState, false); 

    
 
    


//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedClienti(cei, name, value, listaClienti)
{  	
	cei.values[name] = value;
     //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
   //Nessun controllo sui nomi duplicati per i clienti...
  /* if (name==='nome') 
            errMgmt(cei, 'nome', 'nomeDuplicato','',false);
			for (var propt in listaClienti)
               if (listaClienti[propt].nome === value) errMgmt(cei, 'nome','nomeDuplicato','Questo nome esiste già', true );
   	*/
    //Se ho anche solo un errore... sono svalido.
    if (name==='email') errMgmt(cei, 'email','invalidEmail','email non valida', !isValidEmail(cei.values.email) && cei.values.email.length >0);
 
     
    cei.isValid = isValidEditedItem(cei);
    return cei;
}



export default function clienti(state = initialState(), action) {
  var newState;
  switch (action.type) {
   
        
   
    case STORE_MEASURE:
    	newState = state;
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    if (action.newMeasure.name==='viewPortHeight')
   			{
   	    	let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formClientiHeight'] -150;
   	    	newState = {...state, tableHeight: height};
   			}
   		if (action.newMeasure.name==='viewPortWidth' || action.newMeasure.name==='siderWidth')
   	   		{
   			let formWidth = (measures['viewPortWidth'] -measures['siderWidth'] -16) - 8;	
   			let tableWidth = formWidth * 5 / 6 -8 ;
   			let formCols = calcFormCols(colParams,8,formWidth);
   			let header = calcHeader(headerParams, tableWidth - 60);
   			let formSearchCols = calcFormCols(colSearchParams,8,tableWidth);
   		
   			let geometry = {...newState.geometry};
   			
   		    newState = {...newState, geometry: {...geometry, formWidth: formWidth, formCols: formCols, header: header,  formSearchCols: formSearchCols}};
   			}
   	
        break;
   	    
     default:
        newState = clientiR.updateState(state,action,editedItemInitialState, transformAndValidateEditedClienti);
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
  export const getListeningItem = (state) => {return state.listeningItem};
 export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
  export const getFiltersClienti = (state) => {return state.filters};

 
      



