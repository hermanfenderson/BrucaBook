//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import moment from 'moment';
import 'moment/locale/it';
import {setDay} from '../helpers/form';
import {SAVE_INVENTARIO} from '../actions/elencoInventari';

//import {errMgmt, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem, moment2period} from '../helpers/form';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper,  isValidEditedItem} from '../helpers/form';


import {STORE_MEASURE} from '../actions';

import {calcFormCols, calcHeader} from '../helpers/geometry';


moment.locale("it");

//Metodi reducer per le Form

const editedBollaValuesInitialState = 
	  {			dataInventario: moment(),
				note: ''
	};

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedBollaValuesInitialState, {isValid: true} ));
}

const formWidth = (880 -16)  * 5 / 6 -8;

//E' un dato.... che passo come costante...
const headerParams = [
				{name: 'dataInventario', label: 'Data inventario', min: '200px', max: '200px'},
				{name: 'note', label: 'Note', min: '400px', max: '400px'},
				
			   {name: 'totali.righe', label: 'Inventario', min: '100px', max: '100px'},
			    {name: 'totali.magazzino', label: 'Magazzino', min: '100px', max: '100px'},
			   
			    ];
			    
const colParams1 = [
	{name: 'dataInventario', min: 200, max: 200},
	{name: 'note', min: 400, max: 400},
	{name: 'annulla', min: 100, max: 100},
	{name: 'crea', min: 100, max: 100}
	
	];
const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
			geometry: {formWidth: formWidth, formCols1: calcFormCols(colParams1,8,formWidth), header: calcHeader(headerParams, formWidth - 60)
    					}		
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

const inventarioR = new FormReducer('ELENCOINVENTARI',null, transformEditedInventario, transformSelectedItem, initialState, false); 

    
 
    


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
   
        
   
    case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formInventarioHeight'] -130;
   	    newState = {...state, tableHeight: height};
        break;  
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
 
 
      



