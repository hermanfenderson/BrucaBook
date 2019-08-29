//QUESTA VA SISTEMATA
import FormReducer from '../helpers/formReducer'
import {initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper} from '../helpers/form';
import {calcFormColsFix, calcHeaderFix, initCalcGeometry, FMW, FMH, FORM_COL_H} from '../helpers/geometry';

//Metodi reducer per le Form
//Auto-magico! Il calcolo è fatto in una funzione generalizzata... l'esito è passato a formReducer			   
let geometryParams = {cal: {
						formSearchHeight: FORM_COL_H,
						colSearchParams : [
										{name: 'ean', min: 120, max: 120},
										{name: 'titolo', min: 250},
										{name: 'autore', min: 120},
										{name: 'editore', min: 90},
										
										{name: 'nomeCategoria', min: 60},
									
										{name: 'reset', min: 120, max: 120},
									
										],
										
					    colSearchFixedParams : [
										{name: 'ean', min: 120, max: 120},
										{name: 'titolo', min: 250},
										{name: 'autore', min: 120},
										{name: 'editore', min: 90},
										
										{name: 'nomeCategoria', min: 100},
									
										{name: 'reset', min: 60, max: 60},

										],
						headerParams: [
									  {name: 'key', label: 'EAN', min: 124, max: 124, sort:'number'},
										{name: 'titolo', label: 'Titolo', min: 258, sort:'string', ellipsis: true},
										{name: 'autore', label: 'Autore', min: 128, sort:'string', ellipsis: true},
										{name: 'editore', label: 'Editore', min: 90, sort:'string', ellipsis: true},
										{name: 'prezzoListino', label: 'Prezzo', min: 90, max: 90, sort:'number' },
										{name: 'iva', label: 'Iva', min: 30, sort:'string'},
										{name: 'nomeCategoria', label: 'Categoria', min: 60, sort:'string'},
										{name: 'pezzi', label: 'Pezzi', min: 60, max: 60, sort:'number'},
									 ],
						
						},
				  tbc: [
				  	    {formSearchWidth: (cal) =>  {return(cal.w)}},
				  	    {tableWidth: (cal) => {return(cal.w)}},
				  	    {tableHeight: (cal) =>  {return(cal.h-cal.formSearchHeight)}},
				  	   ],
				 geo: [ 
	

     		    		{formSearchCoors: (cal) =>  {return({height: cal.formSearchHeight - FMH, width: cal.formSearchWidth -FMW, top: 0, left: 10})}},
    				
     		    		{formSearchCols: (cal) =>  {return(calcFormColsFix({colParams: cal.colSearchParams, width: cal.formSearchWidth, offset: 0}))}},
     		    		{formSearchFixedCols: (cal) =>  {return(calcFormColsFix({colParams: cal.colSearchFixedParams, width: 700, offset: 0}))}}, 
    					
    					{tableCoors: (cal) =>  {return({height: cal.tableHeight, width: cal.tableWidth, top: cal.formSearchHeight, left: 10})}},
    				    
    		//Header ha tolleranza per barra di scorrimento in tabella e sel 
    					{header: (cal) =>  {return(calcHeaderFix({colParams: cal.headerParams, width: cal.tableWidth-FMW}))}},
    					{fixedHeader: (cal) =>  {return(calcHeaderFix({colParams: cal.headerParams, width: 700}))}},
    					
    					]
				 }	
const calcGeometry = initCalcGeometry(geometryParams);


 


const editedMagazzinoValuesInitialState = {}

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedMagazzinoValuesInitialState, {} ));
}



const initialState = () => {
    const eiis = editedItemInitialState();
     const extraState = {
		
    		geometry: calcGeometry()
    				}
	return initialStateHelper(eiis,extraState);
    }
    


    

const magazzinoR = new FormReducer({scene: 'MAGAZZINO', 
								foundCompleteItem: null,
								transformItem: null, 
								transformSelectedItem: null, 
								initialState: initialState, 
								keepOnSubmit: false, 
								calcGeometry: calcGeometry}); 




export default function magazzino(state = initialState(), action) {
  var newState;
  switch (action.type) {
   
      	
    
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
 export const getListeningItem = (state) => {return state.listeningItem};
 export const getFilters = (state) => {return state.filters};
 

      



