//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import moment from 'moment';
import 'moment/locale/it';

//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem} from '../helpers/form';


import {SET_PERIOD_ELENCOCASSE, SAVE_CASSA} from '../actions/elencoCasse';
import {STORE_MEASURE} from '../actions';
import {calcFormColsFix, initCalcGeometry, calcGeneralError, calcHeaderFix, FORM_COL_H, GE_H, P_W, FMH, FMW} from '../helpers/geometry';


moment.locale("it");


//E' un dato.... che passo come costante...

//Auto-magico! Il calcolo è fatto in una funzione generalizzata... l'esito è passato a formReducer			   
let geometryParams = {cal: {
						formHeight: FORM_COL_H + GE_H,
						periodWidth: P_W,
						colParams: [
									{name: 'cassa', min: 170, max: 170},
									{name: 'data', min: 180, max: 360 },
									{name: 'annulla', min: 130, max: 250 },
									{name: 'crea', min: 130, max: 250 },
									],
					
						headerParams: [
									    
									  {name: 'dataCassa', label: 'Data ', min: 200},
									  {name: 'cassa', label: 'Cassa', min: 150, max: 150},
								  
									  {name: 'totali.prezzoTotale', label: 'Totale', min: 200, max: 200},
									   {name: 'totali.scontrini',  label: 'Scontrini',  min: 200, max: 200},
									  {name: 'totali.pezzi', label: 'Pezzi',  min: 200, max: 200},
									 
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
    				
     		    		{formCols: (cal) =>  {return(calcFormColsFix({colParams: cal.colParams, width: cal.formWidth, offset: 0}))}}, 
    					{tableCoors: (cal) =>  {return({height: cal.tableHeight, width: cal.tableWidth, top: 0, left: cal.periodWidth})}},
    				    {generalError: (cal) =>  {return(calcGeneralError({width: cal.formWidth, offset: 1}))}}, 
    					
    		//Header ha tolleranza per barra di scorrimento in tabella e sel 
    					{header: (cal) =>  {return(calcHeaderFix({colParams: cal.headerParams, width: cal.tableWidth}))}},
    					{periodCoors: (cal) => {return({height: cal.periodHeight, width: cal.periodWidth, top: 0, left: 0})}},
    					]
				 }	
const calcGeometry = initCalcGeometry(geometryParams);







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
    		period: null,
    		geometry: calcGeometry(),
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
	
	
const cassaR = new FormReducer({scene: 'ELENCOCASSE', 
								foundCompleteItem: null,
								transformItem: transformEditedCassa, 
								transformSelectedItem: transformSelectedItem, 
								initialState: initialState, 
								keepOnSubmit: false, 
								calcGeometry: calcGeometry}); 
	

    
 
    


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
   
        
   
   
     case SET_PERIOD_ELENCOCASSE:
        newState = {...state, period: action.period};
        break;
     case SAVE_CASSA:
     	newState = state;
     	break;
    default:
        newState = cassaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedCassa);
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
 
 
      



