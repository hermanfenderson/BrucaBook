//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import moment from 'moment';
import 'moment/locale/it';


//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem, nomeFornitoreById} from '../helpers/form';


import {SET_PERIOD_ELENCOBOLLE} from '../actions/elencoBolle';
import {STORE_MEASURE} from '../actions';
import {calcFormColsFix, calcHeader, calcGeneralError} from '../helpers/geometry';

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

const formHeight = 180;
const periodWidth = 190;
const periodHeight = 720;
const tableWidth = 960 - periodWidth;
const formWidth = tableWidth;
const tableHeight = 720 - formHeight;


const colParams1 = [
	{name: 'riferimento', min: 135, max: 240},
	{name: 'fornitore', min: 180, max: 240},
	{name: 'dataDocumento', min: 180, max: 240},
	{name: 'dataCarico', min: 180, max: 240}
	
	];
	
const colParams2 = [
	{name: 'tipo', min: 180, max: 240},
	{name: 'dataRendiconto', min: 180, max: 240},
	{name: 'annulla', min: 120, max: 240},
	{name: 'crea', min: 120, max: 240}
	
	];
	
const headerParams = [{name: 'riferimento', label: 'Rif.', min: 80},
			    {name: 'nomeFornitore', label: 'Fornitore', min: 135, max: 300},
			    {name: 'tipoBolla', label: 'Tipo', min: 40, max: 80},
			    
			    {name: 'dataDocumento', shortLabel: 'Data Doc.', label: 'Data Documento', min: 85, max: 150, shortBreak: 120},
			    {name: 'dataCarico', shortLabel: 'Data Car.', label: 'Data Carico', min: 85, max: 150, shortBreak: 120},
			    {name: 'dataRendiconto', shortLabel: 'Data Rend.', label: 'Data Rendiconto', min: 85, max: 150, shortBreak: 120},
			    
			    {name: 'totali.prezzoTotale', label: 'Totale', min: 60, max: 100},
			   {name: 'totali.pezzi', shortLabel: 'Pz.', label: 'Pezzi', shortBreak: 50, min: 40, max: 80},
			    {name: 'totali.gratis', shortLabel: 'Gr.', label: 'Gratis', shortBreak: 50, min: 40, max: 80},
			   ];
	
const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
			//period: moment2period(moment())    	
    		period: null,
    		geometry: {formHeight: formHeight, 
    					formWidth: formWidth, 
    					formCols1: calcFormColsFix(colParams1,8,formWidth -25,60,0), 
    					formCols2: calcFormColsFix(colParams2,8,formWidth -25,60,60), 
    					tableHeight: tableHeight, 
    					tableWidth: tableWidth, 
    					generalError: calcGeneralError(formWidth - 25, 120),	 
    		//Header ha tolleranza per barra di scorrimento in tabella e sel 
    					header: calcHeader(headerParams, tableWidth - 60 -10),
    					periodHeight: periodHeight, 
    					periodWidth: periodWidth,
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
      errMgmt(cei, 'form','invalidDate','Data non valida',  true, true);
  
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
   	    if (action.newMeasure.name==='mainHeight')
   			{
   	    	let tableHeight = measures['mainHeight'] - formHeight;
   	    	let periodHeight = measures['mainHeight'];
   	    	let geometry = {...newState.geometry};
   			
   	    	newState = {...newState, geometry: {...geometry, periodHeight: periodHeight, tableHeight: tableHeight}};
   			}
   	if (action.newMeasure.name==='mainWidth')
   	   		{
   			let formWidth = measures['mainWidth'] - periodWidth ;
   			let	generalError = calcGeneralError(formWidth - 25, 120);	 
    
   			let tableWidth = formWidth ;	
   			
   			let formCols1 = calcFormColsFix(colParams1,8,formWidth - 25,60,0);
   			let formCols2 = calcFormColsFix(colParams2,8,formWidth - 25,60,60);
   			let header = calcHeader(headerParams, tableWidth - 60 - 10);
   			let geometry = {...newState.geometry};
   			
   		    newState = {...newState, geometry: {...geometry, tableWidth: tableWidth, formWidth: formWidth, formCols1: formCols1, formCols2: formCols2, header: header, generalError: generalError}};
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
 
 
      



