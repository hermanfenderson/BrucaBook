//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';
import {initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper} from '../helpers/form';
import {calcFormCols, calcHeader} from '../helpers/geometry';

//Metodi reducer per le Form

const colSearchParams = [
	{name: 'ean', min: 120, max: 120},
	{name: 'titolo', min: 350},
	{name: 'autore', min: 150},
	{name: 'reset', min: 120, max: 120},

	]
const colSearchFixedParams = [
	{name: 'ean', min: 120, max: 120},
	{name: 'titolo', min: 350},
	{name: 'autore', min: 150},
	{name: 'reset', min: 60, max: 60},

	]
 
const headerParams = [
	{name: 'key', label: 'EAN', min: 124, max: 124},
	{name: 'titolo', label: 'Titolo', min: 358},
	{name: 'autore', label: 'Autore', min: 158},
	{name: 'pezzi', label: 'Pezzi', min: 60, max: 60},

	] 
	
const tableWidth = 880;

const editedMagazzinoValuesInitialState = {}

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedMagazzinoValuesInitialState, {} ));
}



const initialState = () => {
    const eiis = editedItemInitialState();
     const extraState = {
		
    		geometry: {header: calcHeader(headerParams, tableWidth - 60), 
    				  fixedHeader: calcHeader(headerParams, 700),  
    				  formSearchCols: calcFormCols(colSearchParams,8,tableWidth), 
    				  formSearchFixedCols: calcFormCols(colSearchFixedParams,8,700),
    					}		
    				}
	return initialStateHelper(eiis,extraState);
    }
    


    
const magazzinoR = new FormReducer('MAGAZZINO',null, null, null, initialState); 





export default function elencoBolle(state = initialState(), action) {
  var newState;
  switch (action.type) {
   
      	
    case STORE_MEASURE:
    	newState = state;
    	
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	     if (action.newMeasure.name==='viewPortHeight')
   			{
   	    	let height = measures['viewPortHeight'] - measures['headerHeight'] -195;
   	    	newState = {...state, tableHeight: height};
   			}
   		 if (action.newMeasure.name==='viewPortWidth' || action.newMeasure.name==='siderWidth')
   	   		{
   	   		let tableWidth = (measures['viewPortWidth'] -measures['siderWidth'] -16) - 8;	
   			let formSearchCols = calcFormCols(colSearchParams,8,tableWidth);
   		
   			let header = calcHeader(headerParams, tableWidth - 60);
   			let geometry = {...newState.geometry};
   			newState = {...newState, geometry: {...geometry, formSearchCols: formSearchCols, header: header}};
   		
			}
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
 

      



