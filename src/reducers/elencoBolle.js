//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import moment from 'moment';
import 'moment/locale/it';


//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem, nomeFornitoreById} from '../helpers/form';


import {SET_PERIOD_ELENCOBOLLE} from '../actions/elencoBolle';
import {STORE_MEASURE} from '../actions';


moment.locale("it");

//Metodi reducer per le Form

const editedBollaValuesInitialState = 
	  {			riferimento: '',
				fornitore: null,
				nomeFornitore: '',
				dataDocumento: moment(),
				dataCarico: moment(),
				dataRendiconto: null,
				tipoBolla: 'A'
	};

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedBollaValuesInitialState, {} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
			//period: moment2period(moment())    	
    		period: null,
    		geometry: {formWidth: (880 -16) * 4 / 5, formCols: {
    															gutter1: 8,
    															gutter2: 8,
    															riferimento: 135,
    															fornitore: 180,
    															dataDocumento: 180,
    															dataCarico: 180,
    															tipo: 180,
    															dataRendiconto: 180,
    															annulla: 120,
    															crea: 120
    															
    															} 
    					}										
    				}
	return initialStateHelper(eiis,extraState);
    }
    
    


const transformEditedBolla = (row) =>
{   row.dataDocumento = moment(row.dataDocumento).format("L");
	row.dataCarico = moment(row.dataCarico).format("L");
	if (row.dataRendiconto) row.dataRendiconto = moment(row.dataRendiconto).format("L");
	if (row.tipoBolla === 'A') row.tipoBolla = '';
}	

const transformSelectedItem = (cei) =>
{
	cei.dataDocumento = moment(cei.dataDocumento,"DD/MM/YYYY");
	cei.dataCarico = moment(cei.dataCarico,"DD/MM/YYYY");
	if (cei.dataRendiconto) cei.dataRendiconto = moment(cei.dataRendiconto,"DD/MM/YYYY");
	if (cei.tipoBolla === '') cei.tipoBolla = 'A';
}

const bollaR = new FormReducer('ELENCOBOLLE',null, transformEditedBolla, transformSelectedItem, initialState, false); 

    
 
    


//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedBolla(cei, name, value)
{  	
	cei.values[name] = value;
    if ((name === 'tipoBolla') && value === 'R') cei.values.dataRendiconto = moment();
    if ((name === 'tipoBolla') && value !== 'R') cei.values.dataRendiconto = null;
    
    if (name === 'fornitore') cei.values.nomeFornitore = nomeFornitoreById(cei.values.fornitore);
  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
   
   errMgmt(cei, 'riferimento','required','Campo obbligatorio',  (cei.values.riferimento.length === 0), false);
   errMgmt(cei, 'fornitore','required','Campo obbligatorio',  (cei.values.fornitore === null), false);
   errMgmt(cei, 'dataDocumento','invalidDate','Data non valida',  (!cei.values.dataDocumento.isValid()));
    errMgmt(cei, 'dataCarico','invalidDate','Data non valida',  (!cei.values.dataCarico.isValid()));
    errMgmt(cei, 'dataRendiconto','invalidDate','Data non valida',  ((cei.values.tipoBolla === 'R') && (!cei.values.dataRendiconto.isValid())));
     //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}



export default function elencoBolle(state = initialState(), action) {
  var newState;
  switch (action.type) {
   
        
   
    case STORE_MEASURE:
    	newState = state;
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    if (action.newMeasure.name==='viewPortHeight')
   			{
   	    	let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formBollaHeight'] -130;
   	    	newState = {...newState, tableHeight: height};
   			}
   	if (action.newMeasure.name==='viewPortWidth' || action.newMeasure.name==='siderWidth')
   	   		{
   			let formWidth = (measures['viewPortWidth'] -measures['siderWidth'] -16) * 4 / 5 ;	
   			let geometry = {...newState.geometry};
   			let spreadGutter = (formWidth - 688)/4;
   			let spread = (formWidth - 688)*3/4
   			let gutter1 = 8 + ((spreadGutter) / 3);
   			let formCols = {
    														    gutter1: gutter1,
    															gutter2: gutter1,
    															riferimento: 135+spread/2,
    															fornitore: 180+spread/2,
    															dataDocumento: 180,
    															dataCarico: 180,
    															tipo: 180,
    															dataRendiconto: 180,
    															annulla: 120,
    															crea: 120
    															
    															} 
   		    newState = {...newState, geometry: {...geometry, formWidth: formWidth, formCols: formCols}};
   			}
        break;  
     case SET_PERIOD_ELENCOBOLLE:
        newState = {...state, period: action.period};
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
 export const getPeriod = (state) => {return state.period};
 export const getListeningItem = (state) => {return state.listeningItem};
 export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 
 
      



