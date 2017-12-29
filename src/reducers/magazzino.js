//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';
import {initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper} from '../helpers/form';

//Metodi reducer per le Form



const editedMagazzinoValuesInitialState = {}

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedMagazzinoValuesInitialState, {} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
	return initialStateHelper(eiis,{});
    }
    


    
const magazzinoR = new FormReducer('MAGAZZINO',null, null, null, initialState); 





export default function elencoBolle(state = initialState(), action) {
  var newState;
  switch (action.type) {
   
      	
    case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] -100;
   	    newState = {...state, tableHeight: height};
        break;  	
    default:
        newState = magazzinoR.updateState(state,action);
        //newState =  state;
    	break;
   
  }
 return newState;
}

//Il mio primo selettore colocato https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers!!!
//Questi rimarranno identici in tutti i casi... Posso migliorare queste ripetizioni inutili?
 export const getItems = (state) => {return state.itemsArray};  
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getListeningItem = (state) => {return state.listeningItem};
 export const getFilters = (state) => {return state.filters};
 

      



