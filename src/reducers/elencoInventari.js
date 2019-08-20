//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import moment from 'moment';
import 'moment/locale/it';
import {setDay} from '../helpers/form';
import {SAVE_INVENTARIO} from '../actions/elencoInventari';

//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem} from '../helpers/form';


import {STORE_MEASURE} from '../actions';

import {calcFormColsFix, initCalcGeometry, calcGeneralError, calcHeaderFix, FORM_COL_H, GE_H, P_W, FMH, FMW} from '../helpers/geometry';


moment.locale("it");

//Metodi reducer per le Form

const editedBollaValuesInitialState = 
	  {			dataInventario: moment(),
				note: ''
	};

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedBollaValuesInitialState, {isValid: true} ));
}

//Auto-magico! Il calcolo è fatto in una funzione generalizzata... l'esito è passato a formReducer			   
let geometryParams = {cal: {
						formHeight: FORM_COL_H + GE_H,
						emptyWidth: P_W,
						colParams: [
									{name: 'dataInventario', min: 200, max: 200},
									{name: 'note', min: 400, max: 400},
									{name: 'annulla', min: 100, max: 100},
									{name: 'crea', min: 100, max: 100}
									],
					
						headerParams: [
									    
									  {name: 'dataInventario', label: 'Data inventario', min: 200, max: 200},
									  {name: 'note', label: 'Note', min: 400,},
									  {name: 'totali.righe', label: 'Inventario', min: 100, max: 100},
			    					  {name: 'totali.magazzino', label: 'Magazzino', min: 100, max: 100},
									 ],
						
						},
				  tbc: [
				  	    {tableWidth: (cal) => {return(cal.w-cal.emptyWidth)}},
				  	    {tableHeight: (cal) =>  {return(cal.h-cal.formHeight)}},
				  	    {formWidth: (cal) =>  {return(cal.tableWidth)}},
				  	    {emptyHeight: (cal) =>  {return(cal.h)}},
				  	   ],
				 geo: [ 
	

     		    		{formCoors: (cal) =>  {return({height: cal.formHeight - FMH, width: cal.formWidth -FMW, top: cal.tableHeight, left: cal.emptyWidth})}},
    				
     		    		{formCols: (cal) =>  {return(calcFormColsFix({colParams: cal.colParams, width: cal.formWidth, offset: 0}))}}, 
    					{tableCoors: (cal) =>  {return({height: cal.tableHeight, width: cal.tableWidth, top: 0, left: cal.emptyWidth})}},
    				    {generalError: (cal) =>  {return(calcGeneralError({width: cal.formWidth, offset: 1}))}}, 
    					
    		//Header ha tolleranza per barra di scorrimento in tabella e sel 
    					{header: (cal) =>  {return(calcHeaderFix({colParams: cal.headerParams, width: cal.tableWidth-FMW}))}},
    					{emptyCoors: (cal) => {return({height: cal.emptyHeight, width: cal.emptyWidth, top: 0, left: 0})}},
    					]
				 }	
const calcGeometry = initCalcGeometry(geometryParams);


const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
    	    geometry: calcGeometry(),
						}		
    				
	return initialStateHelper(eiis,extraState);
    }
    
    


const transformEditedInventario = (row) =>
{   row.dataInventario = moment(row.dataInventario).format("L");
}	

const transformSelectedItem = (cei) =>
{
	cei.dataInventario = moment(cei.dataInventario,"DD/MM/YYYY");
}


const inventarioR = new FormReducer({scene: 'ELENCOINVENTARI', 
								foundCompleteItem: null,
								transformItem: transformEditedInventario, 
								transformSelectedItem: transformSelectedItem, 
								initialState: initialState, 
								keepOnSubmit: false, 
								calcGeometry: calcGeometry}); 

    
 
    


//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedInventario(cei, name, value, itemsArray)
{  
	const datePresent = (inputData) => {
		for (var i=0; i < itemsArray.length; i++) 
    		{   if (itemsArray[i].data === inputData) return(true);}
    	return(false);
    	}
	cei.values[name] = value;

  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
   
   errMgmt(cei, 'dataInventario','invalidDate','Data non valida',  (!cei.values.dataInventario.isValid()));
   errMgmt(cei, 'dataInventario','dupDate','Data già presente',  datePresent(setDay(cei.values.dataInventario)));
   	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    
    return cei;
}



export default function elencoInventari(state = initialState(), action) {
  var newState;
  switch (action.type) {
   
        
   
     case SAVE_INVENTARIO:
     	newState = state;
     	break;
    
     default:
        newState = inventarioR.updateState(state,action,editedItemInitialState, transformAndValidateEditedInventario);
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
  export const getListeningItem = (state) => {return state.listeningItem};
 export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 
 
      



