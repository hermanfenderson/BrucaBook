//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import moment from 'moment';
import 'moment/locale/it';

//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem, nomeFornitoreById} from '../helpers/form';


import {SET_PERIOD_ELENCORESE} from '../actions/elencoRese';
import {STORE_MEASURE} from '../actions';


moment.locale("it");

//Metodi reducer per le Form

const editedResaValuesInitialState = 
	  {			riferimento: '',
				fornitore: null,
				nomeFornitore: '',
				dataDocumento: moment(),
				dataScarico: moment(),
				stato: 'aperta',
	};

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedResaValuesInitialState, {} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
			//period: moment2period(moment())    	
    		period: null
    				}
	return initialStateHelper(eiis,extraState);
    }
    
    


const transformEditedResa = (row) =>
{   row.dataDocumento = moment(row.dataDocumento).format("L");
	row.dataScarico = moment(row.dataScarico).format("L");
}	

const transformSelectedItem = (cei) =>
{
	cei.dataDocumento = moment(cei.dataDocumento,"DD/MM/YYYY");
	cei.dataScarico = moment(cei.dataScarico,"DD/MM/YYYY");
}

const resaR = new FormReducer('ELENCORESE',null, transformEditedResa, transformSelectedItem, false); 

    
 
    


//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedResa(cei, name, value)
{  	
	cei.values[name] = value;
   if (name === 'fornitore') cei.values.nomeFornitore = nomeFornitoreById(cei.values.fornitore);
 
  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
   
   errMgmt(cei, 'riferimento','required','Campo obbligatorio',  (cei.values.riferimento.length === 0), false);
   errMgmt(cei, 'fornitore','required','Campo obbligatorio',  (cei.values.fornitore === null), false);
   errMgmt(cei, 'dataDocumento','invalidDate','Data non valida',  (!cei.values.dataDocumento.isValid()));
    errMgmt(cei, 'dataScarico','invalidDate','Data non valida',  (!cei.values.dataScarico.isValid()));
   	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}



export default function elencoRese(state = initialState(), action) {
  var newState;
  switch (action.type) {
   
        
   
    case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formResaHeight'] -130;
   	    newState = {...state, tableHeight: height};
        break;  
     case SET_PERIOD_ELENCORESE:
        newState = {...state, period: action.period};
        break;
    default:
        newState = resaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedResa);
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
 
 
      


