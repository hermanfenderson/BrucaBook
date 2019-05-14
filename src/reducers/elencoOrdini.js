//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import moment from 'moment';
import 'moment/locale/it';


//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem} from '../helpers/form';


import {STORE_MEASURE} from '../actions';
import {calcFormCols, calcHeader} from '../helpers/geometry';

moment.locale("it");

//Metodi reducer per le Form

const editedOrdineValuesInitialState = 
	  {			riferimento: '',
				dataOrdine: moment(),
				dataChiusura: null,
				stato: 'A'
	};

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedOrdineValuesInitialState, {isValid:true} ));
}

const formWidth = (880 -16)  * 5 / 6 -8;
const colParams1 = [
	{name: 'riferimento', min: 135, max: 240},
	{name: 'dataOrdine', min: 180, max: 240},
	{name: 'dataChiusura', min: 180, max: 240},
	{name: 'stato', min: 180, max: 240},

	];
	
const colParams2 = [
	{name: 'annulla', min: 120, max: 240},
	{name: 'crea', min: 120, max: 240}
	
	];
	
const headerParams = [{name: 'riferimento', label: 'Rif.', min: 80, max: 150},
			    {name: 'dataOrdine', shortLabel: 'Data Ord.', label: 'Data Ordine', min: 85, max: 150, shortBreak: 120},
			    {name: 'dataChiusura', shortLabel: 'Data Chiu.', label: 'Data Chiusura', min: 85, max: 150, shortBreak: 120},
			    {name: 'totali.pezzi', shortLabel: 'Pz.', label: 'Pezzi', shortBreak: 50, min: 40, max: 80},
			     {name: 'totali.prezzoTotale', label: 'Totale', min: 60, max: 100},
			  
			    {name: 'stato', shortLabel: 'Stato', label: 'Stato', min: 85, max: 150, shortBreak: 120},
			    ];
	
const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
			//period: moment2period(moment())    	
    		period: null,
    		
    		geometry: {formWidth: formWidth, formCols1: calcFormCols(colParams1,8,formWidth), formCols2: calcFormCols(colParams2,8,formWidth), header: calcHeader(headerParams, formWidth - 60)
    					}		
    				}
	return initialStateHelper(eiis,extraState);
    }
    
    


const transformEditedOrdine = (row) =>
{   row.dataOrdine = moment(row.dataOrdine).format("L");
	if (row.dataChiusura) row.dataChiusura = moment(row.dataChiusura).format("L");
}	

const transformSelectedItem = (cei) =>
{
	cei.dataOrdine = moment(cei.dataOrdine,"DD/MM/YYYY");
		if (cei.dataChiusura) cei.dataChiusura = moment(cei.dataChiusura,"DD/MM/YYYY");
}

const ordineR = new FormReducer('ELENCOORDINI',null, transformEditedOrdine, transformSelectedItem, initialState, false); 

    
 
    


//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedOrdine(cei, name, value)
{  	
	cei.values[name] = value;
    //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
   
   errMgmt(cei, 'dataOrdine','invalidDate','Data non valida',  (!cei.values.dataOrdine.isValid()));
      //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}



export default function elencoOrdini(state = initialState(), action) {
  var newState;
  switch (action.type) {
   
        
   
    case STORE_MEASURE:
    	newState = state;
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    if (action.newMeasure.name==='viewPortHeight')
   			{
   	    	let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formOrdineHeight'] -130;
   	    	newState = {...newState, tableHeight: height};
   			}
   	if (action.newMeasure.name==='viewPortWidth' || action.newMeasure.name==='siderWidth')
   	   		{
   			let formWidth = (measures['viewPortWidth'] -measures['siderWidth'] -16) * 5 / 6 -8 ;	
   			let formCols1 = calcFormCols(colParams1,8,formWidth);
   			let formCols2 = calcFormCols(colParams2,8,formWidth);
   			let header = calcHeader(headerParams, formWidth - 60);
   			let geometry = {...newState.geometry};
   			
   		    newState = {...newState, geometry: {...geometry, formWidth: formWidth, formCols1: formCols1, formCols2: formCols2, header: header}};
   			}
        break;  
      default:
        newState = ordineR.updateState(state,action,editedItemInitialState, transformAndValidateEditedOrdine);
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
 
 
      



