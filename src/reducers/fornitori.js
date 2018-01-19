//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'

//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem} from '../helpers/form';


import {STORE_MEASURE} from '../actions';


//Metodi reducer per le Form

const editedFornitoriValuesInitialState = 
	  {			nome: ''
	};

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedFornitoriValuesInitialState, {isValid: false} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
			
    				}
	return initialStateHelper(eiis,extraState);
    }
    
    


const transformEditedFornitori = (row) =>
{   
	
}	

const transformSelectedItem = (cei) =>
{

}

const fornitoriR = new FormReducer('FORNITORI',null, transformEditedFornitori, transformSelectedItem, initialState, false); 

    
 
    


//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedFornitori(cei, name, value, listaFornitori)
{  	
	cei.values[name] = value;
     //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
   
   if (name==='nome') 
            errMgmt(cei, 'nome', 'nomeDuplicato','',false);
			for (var propt in listaFornitori)
               if (listaFornitori[propt].nome === value) errMgmt(cei, 'nome','nomeDuplicato','Questo nome esiste già', true );
   	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}



export default function fornitori(state = initialState(), action) {
  var newState;
  switch (action.type) {
   
        
   
    case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formFornitoreHeight'] -130;
   	    newState = {...state, tableHeight: height};
        break;  
     default:
        newState = fornitoriR.updateState(state,action,editedItemInitialState, transformAndValidateEditedFornitori);
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
 
 
      



