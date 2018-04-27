//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import moment from 'moment';
import 'moment/locale/it';

//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem} from '../helpers/form';


import {SET_PERIOD_ELENCOCASSE, SAVE_CASSA} from '../actions/elencoCasse';
import {STORE_MEASURE} from '../actions';


moment.locale("it");

//Metodi reducer per le Form

const editedBollaValuesInitialState = 
	  {			cassa: '1',
				dataCassa: moment(),
				ultimoScontrino: 0
	};

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedBollaValuesInitialState, {isValid:true} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
			//period: moment2period(moment())    	
    		period: null
    				}
	return initialStateHelper(eiis,extraState);
    }
    
    


const transformEditedCassa = (row) =>
{   row.dataCassa = moment(row.dataCassa).format("L");
}	


const transformSelectedItem = (cei) =>
{
	cei.dataCassa = moment(cei.dataCassa,"DD/MM/YYYY");
	}

const bollaR = new FormReducer('ELENCOCASSE',null, transformEditedCassa, transformSelectedItem, initialState); 

    
 
    


//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedCassa(cei, name, value)
{  	
	cei.values[name] = value;

  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
   
   errMgmt(cei, 'cassa','required','Campo obbligatorio',  (cei.values.cassa.length === 0), false);
   errMgmt(cei, 'dataCassa','invalidDate','Data non valida',  (!cei.values.dataCassa.isValid()));
    
   	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}



export default function elencoCasse(state = initialState(), action) {
  var newState;
  switch (action.type) {
   
        
   
    case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formCassaHeight'] -130;
   	    newState = {...state, tableHeight: height};
        break;  
     case SET_PERIOD_ELENCOCASSE:
        newState = {...state, period: action.period};
        break;
     case SAVE_CASSA:
     	newState = state;
     	break;
    default:
        newState = bollaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedCassa);
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
 export const getPeriod = (state) => {return state.period};
 export const getListeningItem = (state) => {return state.listeningItem};
 export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 
 
      



