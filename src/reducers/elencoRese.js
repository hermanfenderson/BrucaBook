//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import moment from 'moment';
import 'moment/locale/it';

//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem, nomeFornitoreById} from '../helpers/form';


import {SET_PERIOD_ELENCORESE} from '../actions/elencoRese';
import {calcFormColsFix, calcHeaderFix, calcGeneralError, initCalcGeometry, FMW, FMH, FORM_COL_H, GE_H, P_W} from '../helpers/geometry';


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

//Auto-magico! Il calcolo è fatto in una funzione generalizzata... l'esito è passato a formReducer			   
let geometryParams = {cal: {
						formHeight: FORM_COL_H*2 + GE_H,
						periodWidth: P_W,
						
						colParams1: [
									{name: 'riferimento', min: 135, max: 240},
									{name: 'fornitore', min: 180, max: 240},
									{name: 'dataDocumento', min: 180, max: 240},
									{name: 'dataScarico', min: 180, max: 240}
	
									],
						colParams2: [
									{name: 'stato', min: 180, max: 240},
									{name: 'annulla', min: 120, max: 240},
									{name: 'crea', min: 120, max: 240}
									],
						
					
						headerParams: [
									  {name: 'riferimento', label: 'Rif.', min: 80},
									  {name: 'nomeFornitore', label: 'Fornitore', min: 135, max: 300},
					   
									  {name: 'dataDocumento', shortLabel: 'Data Doc.', label: 'Data Documento', min: 85, max: 150, shortBreak: 120},
									  {name: 'dataScarico', shortLabel: 'Data Scar.', label: 'Data Scarico', min: 85, max: 150, shortBreak: 120},
									  {name: 'stato', shortLabel: 'Stato', label: 'Stato', min: 85, max: 150, shortBreak: 120},
									    
									  {name: 'totali.prezzoTotale', label: 'Totale', min: 60, max: 100},
									  {name: 'totali.pezzi', shortLabel: 'Pz.', label: 'Pezzi', shortBreak: 50, min: 40, max: 80},
									  {name: 'totali.gratis', shortLabel: 'Gr.', label: 'Gratis', shortBreak: 50, min: 40, max: 80},

									 ],
						
						},
				  tbc: [
				  	    {tableWidth: (cal) => {return(cal.w-cal.periodWidth)}},
				  	    {tableHeight: (cal) =>  {return(cal.h-cal.formHeight)}},
				  	    {formWidth: (cal) =>  {return(cal.tableWidth)}},
				  	    {periodHeight: (cal) =>  {return(cal.h)}},
				  	   ],
				 geo: [ 
	

     		    		{formCoors: (cal) =>  {return({height: cal.formHeight - FMH, width: cal.formWidth -FMW, top: cal.tableHeight, left: cal.periodWidth})}},
    				
     		    		{formCols1: (cal) =>  {return(calcFormColsFix({colParams: cal.colParams1, width: cal.formWidth, offset: 0}))}}, 
    					{formCols2: (cal) =>  {return(calcFormColsFix({colParams: cal.colParams2, width:cal.formWidth , offset: 1}))}}, 
    					{tableCoors: (cal) =>  {return({height: cal.tableHeight, width: cal.tableWidth, top: 0, left: cal.periodWidth})}},
    				    {generalError: (cal) =>  {return(calcGeneralError({width: cal.formWidth, offset: 2}))}}, 
    					
    		//Header ha tolleranza per barra di scorrimento in tabella e sel 
    					{header: (cal) =>  {return(calcHeaderFix({colParams: cal.headerParams, width: cal.tableWidth-FMW}))}},
    					{periodCoors: (cal) => {return({height: cal.periodHeight, width: cal.periodWidth, top: 0, left: 0})}},
    					]
				 }	
const calcGeometry = initCalcGeometry(geometryParams);




const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
			//period: moment2period(moment())    	
    		period: null, 
    		geometry: calcGeometry()
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

    
 
 const resaR = new FormReducer({scene: 'ELENCORESE', 
								foundCompleteItem: null,
								transformItem: transformEditedResa, 
								transformSelectedItem: transformSelectedItem, 
								initialState: initialState, 
								keepOnSubmit: false, 
								calcGeometry: calcGeometry}); 

       


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
 export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 
 
      



