import FormReducer from '../helpers/formReducer'
import {GENERA_RIGHE_INVENTARIO} from '../actions/inventario';
import { childAdded, childDeleted, childChanged, initialLoading } from '../helpers/firebase';
import {calcFormColsFix, calcHeaderFix, calcGeneralError, initCalcGeometry, FMH, FMW, FORM_COL_H, GE_H} from '../helpers/geometry';


import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  noErrors,eanState, updateEANErrors} from '../helpers/form';
import {isInteger} from '../helpers/validators';

const editedInventarioValuesInitialState = 
	  {			ean: '',
				titolo: '',
				autore: '',
				prezzoListino: '',
				pezzi: 0,
				prima: 0,
				dopo: 0,
				ora: 0,
				imgUrl: ''	
	};
	


const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedInventarioValuesInitialState, {willFocus: 'ean'} ));
}


//Auto-magico! Il calcolo è fatto in una funzione generalizzata... l'esito è passato a formReducer			   
let geometryParams = {cal: {
						formHeight: 2 * FORM_COL_H + GE_H,
						caricaWidth: 190,
						caricaHeight: FORM_COL_H,
						immagineWidth: 120,
						immagineHeight: 160,
						formSearchHeight: FORM_COL_H,
						
						colSearchParams: [
										{name: 'ean', min: 120, max: 120},
										{name: 'titolo', min: 250},
										{name: 'autore', min: 110},
										
										{name: 'reset', min: 100, max: 100},
										
										],
						colParams1: [
										{name: 'ean', min: 170, max: 170},
										{name: 'titolo', min: 360},
					
									
									],
						colParams2: [
									{name: 'autore', min: 160},

									{name: 'listino', min: 65, max: 65},
									{name: 'prima', min: 65, max: 65},
									{name: 'delta', min: 65, max: 65},
									{name: 'dopo', min: 65, max: 65},
									{name: 'ora', min: 65, max: 65},
								
									{name: 'annulla', min: 70, max: 100},
									{name: 'inserisci', min: 70, max: 100},

									
									],
						headerParams: [
									  	{name: 'ean', label: 'EAN', min: 130, max: 130,sort:'number'},
										{name: 'titolo', label: 'Titolo', min: 250,sort:'string', ellipsis: true},
										{name: 'autore', label: 'Autore', min: 110,sort:'string', ellipsis: true},
										{name: 'prezzoListino', label: 'Prezzo', min: 60, max: 60},
										{name: 'prima', label: 'Prima', min: 50, max: 50},
										{name: 'pezzi', label: 'Variaz.', min: 50, max: 50},
										{name: 'dopo', label: 'Dopo', min: 50, max: 50},
										{name: 'ora', label: 'Ora', min: 50, max: 50},
										

									 ],
						
						},
				  tbc: [
				  	    {tableWidth: (cal) => {return(cal.w)}},
				  	    {tableHeight: (cal) =>  {return(cal.h-cal.formHeight-cal.formSearchHeight)}},
				  	    {formWidth: (cal) =>  {return(cal.w-cal.immagineWidth)}},
				  	    {formSearchWidth: (cal) =>  {return(cal.tableWidth - cal.caricaWidth)}},
				  	   ],
				 geo: [ 
				  	   
     		    		{formSearchCoors: (cal) =>  {return({height: FORM_COL_H, width: cal.formSearchWidth, top: 0, left: 0})}},
    					{formSearchCols: (cal) =>  {return(calcFormColsFix({colParams: cal.colSearchParams, width: cal.formSearchWidth, offset: 0}))}}, 
    					{formCoors: (cal) =>  {return({height: cal.formHeight - FMH, width: cal.formWidth -FMW, top: cal.tableHeight+cal.formSearchHeight, left: cal.immagineWidth})}},
    				    {formCols1: (cal) =>  {return(calcFormColsFix({colParams: cal.colParams1, width: cal.formWidth, offset: 0}))}}, 
    				    {formCols2: (cal) =>  {return(calcFormColsFix({colParams: cal.colParams2, width: cal.formWidth, offset: 1}))}}, 
    					{tableCoors: (cal) =>  {return({height: cal.tableHeight, width: cal.tableWidth, top: cal.formSearchHeight, left: 10})}},
    				
    					{generalError: (cal) =>  {return(calcGeneralError({width: cal.formWidth, offset: 2}))}},	 
    		//Header ha tolleranza per barra di scorrimento in tabella e sel 
    					{header: (cal) =>  {return(calcHeaderFix({colParams: cal.headerParams, width: cal.tableWidth-FMW}))}},
    				
    					{caricaCoors: (cal) => {return({height: cal.caricaHeight, width: cal.caricaWidth, top: 0, left: cal.formSearchWidth})}},
    					{immagineCoors: (cal) => {return({height: cal.immagineHeight, width: cal.immagineWidth, top: cal.h -cal.immagineHeight-10, left: 0})}}
						]
				 }	
const calcGeometry = initCalcGeometry(geometryParams);

	

	


 
const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
    	    stockOra : {},
		    totaleOccorrenze: 0,
    		geometry: calcGeometry()	
    				}
	return initialStateHelper(eiis, extraState);
    }
    


 
    
//Metodi reducer per le Form
const rigaInventarioR = new FormReducer(
						{scene: 'INVENTARIO',
						foundCompleteItem: foundCompleteItem,
								transformItem: null, 
								transformSelectedItem: null, 
								initialState: initialState, 
								keepOnSubmit: false, 
								calcGeometry: calcGeometry}); 




//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaInventario(cei, name, value)
{  	
	let oldPezzi = null;
	if (name === 'pezzi' && Number.isInteger(cei.values.pezzi)) oldPezzi = cei.values.pezzi;
	if (oldPezzi === '') oldPezzi = 0;
	cei.values[name] = value;
	//Gestione cambiamenti... forse non serve...
    switch (name) {
		default:
		break;
		
	}

  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
   
   //Se tocco EAN il form è svalido sempre 
   if (name === 'ean') 
        {
        //Aggiorno lo stato di EAN
        eanState(cei);
        //cancello provvisoriamente tutti gli error
        noErrors(cei, 'ean');
		//E cancello i campi del libro...
		cei.values.titolo = '';
		cei.values.autore = '';
		cei.values.prezzoListino = '';
		//Rivaluto gli errori e cosa mostrare
	    updateEANErrors(cei);
		}

    if (name === 'pezzi')
    	{
        console.log(oldPezzi);
       	if (Number.isInteger(value)) cei.values.dopo = value + cei.values.prima;	
       	let ora =  value - oldPezzi + cei.values.ora; //Lavoro per differenza...
        if (Number.isInteger(value)) cei.values.ora = ora;  //non modifico se non ho un valore... valido
    	}
		
     errMgmt(cei, 'pezzi','notInteger','numero intero',  ((value) => {return !isInteger(value)})(cei.values.pezzi));
  	
  	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}


function foundCompleteItem(editedItem, action) 
	{   
		let cei = editedItemCopy(editedItem);
		//Copio l'esito della ricerca...
			cei.values = {...cei.values, ...action.item}
        /*
    	cei.values.titolo = action.item.titolo;
    	cei.values.autore = action.item.autore;
    	cei.values.prezzoListino = action.item.prezzoListino;
    	if (action.item.stock) cei.values.stock = action.item.stock; 
    	if ('editore' in cei.values) cei.values.editore = action.item.editore;
    	*/
     	
    	//Il form e' potenzialmente valido... sgancio gli errori...
    	//Se sono qui... EAN è sicuramente valido...
        noErrors(cei,'ean');
        noErrors(cei,'form');
      	 cei.isValid = isValidEditedItem(cei);
      	 cei.willFocus = 'pezzi';
       return(cei);
	}

export default function inventario(state = initialState(), action) {
  var newState;
  switch (action.type) {
    
 
   case GENERA_RIGHE_INVENTARIO:
   	    newState = state;
   	    break;
  
   	 case rigaInventarioR.ADDED_ITEM:
		 	{
		 	if (state.itemsArrayIndex[action.payload.key]!==undefined) newState = state;
		 	else newState = childAdded(action.payload, state, "itemsArray", "itemsArrayIndex", rigaInventarioR.transformItem); 
		 	//Se ho un dato migliore per stock lo metto qui...
		 	let ean = action.payload.val().ean;
		 	let key = action.payload.key;
		 	if (newState.estrattoStoricoMagazzino[ean]) newState.itemsArray[newState.itemsArrayIndex[key]].stock = state.stock[ean];
		 	}
		 	newState.tableScrollByKey = action.payload.key;
	    	
	    	break;
	  case rigaInventarioR.INITIAL_LOAD_ITEM:
		/*  let obj = state.estrattoStoricoMagazzino;
			if (obj)
				{Object.keys(obj).forEach(key => {
    				stockMap.set(key, obj[key].stock);
					});
				}	
		    let stockStorico = state.estrattoStoricoMagazzino;
		*/
		    newState = initialLoading(action.payload, state, "itemsArray", "itemsArrayIndex", rigaInventarioR.transformItem); 
		    let objStockStorico = state.stock;
		    let objStockOra = state.stockOra;
		    
		    let iA = newState.itemsArray;
		    for (let i=0; i<iA; i++)
		    	{
		    	let ean = iA[i].ean;	
		    	let variaz = (iA[i].pezzi) ? iA[i].pezzi : 0; 
		    	if (objStockOra[ean]!==null) iA.ora = objStockOra[ean];
		    	if (objStockStorico[ean]!==null) {let prima = objStockStorico[ean]; iA[i].prima = prima; iA[i].dopo = prima+variaz;}  
		    	}
		 	//Se ho un dato migliore per stock lo metto qui...per ogni riga
		 	/*
		 	for (let key in action.payload.val())
		 		{
		 			let ean = action.payload.val()[key].ean;
		 			
		 			if (newState.estrattoStoricoMagazzino && newState.estrattoStoricoMagazzino[ean]) newState.itemsArray[newState.itemsArrayIndex[key]].stock = newState.stock[ean];
		 		}
		 	*/
		 	
		 	newState = {...newState, tableScroll: true};
		 	console.log("dati freschi pronti bis!")
	    	break;     
		case rigaInventarioR.DELETED_ITEM:
			newState = childDeleted(action.payload, state, "itemsArray", "itemsArrayIndex"); 
	       	break;
	   
		case rigaInventarioR.CHANGED_ITEM:
			newState = childChanged(action.payload, state, "itemsArray", "itemsArrayIndex", rigaInventarioR.transformItem); 
				//Se ho un dato migliore per stock lo metto qui...
		 	let key = action.payload.key;
		 	if (newState.estrattoStoricoMagazzino[key]) newState.itemsArray[newState.itemsArrayIndex[key]].stock = state.stock[key];
		    newState.tableScrollByKey = action.payload.key;
	        break;
	    //Arricchisco per andare alla riga quando ho un EAN valido...
	    case rigaInventarioR.CHANGE_EDITED_ITEM:
	    	newState = rigaInventarioR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaInventario);
            //Se sgto agendo su ho un EAN valido...
	        if (action.name === 'ean' && newState.editedItem.eanState === 'VALID' && state.itemsArrayIndex[action.value] >=0 ) newState.tableScrollByKey = action.value;
	    	break;	    
	    
	    case rigaInventarioR.DATI_STORICO_MAGAZZINO:
	    	{newState = rigaInventarioR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaInventario);
             let objStockStorico = newState.stock;
		     let iA =[...newState.itemsArray];
		    for (let i=0; i<iA.length; i++)
		    	{
		    	let ean = iA[i].ean;	
		    	let variaz = (iA[i].pezzi) ? iA[i].pezzi : 0; 
		    	if (objStockStorico[ean]!==null) {let prima = objStockStorico[ean]; iA[i].prima = prima; iA[i].dopo = prima+variaz;}  
		    	}
		    newState.itemsArray = iA;	
	    	}
	    	break;
		case 'CHANGED_ITEM_MAGAZZINO':
	        newState = rigaInventarioR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaInventario);
	         if (action.payload.key)   {
             			           let itemsArray = [...newState.itemsArray];
        						   let itemsArrayIndex = newState.itemsArrayIndex;
        						   let ora = action.payload.val().pezzi;
        						   let ean = action.payload.key;
        						   let index =itemsArrayIndex[ean];
        						   if (index !== undefined) itemsArray[index].ora = ora;
        						   newState.itemsArray = itemsArray;
            					}
             
	        
			break;
	    case 'ADDED_ITEM_INVENTARIO_SIDE':
	    case 'CHANGED_ITEM_INVENTARIO_SIDE':
	    case 'INITIAL_LOAD_ITEM_INVENTARIO_SIDE':
	       {
	       let stockOra ={...state.stockOra};
	       let itemsArray = [...state.itemsArray];
           let itemsArrayIndex = state.itemsArrayIndex;
	       let deltaArray = Object.entries(action.deltaStockOra);  
	       for (let i=0; i<deltaArray.length; i++)
	    		{   let ean = deltaArray[i][0];
	    		    let ora = deltaArray[i][1];
	    			stockOra[ean] = ora;
	    			let index = itemsArrayIndex[ean];
	    			
	    			itemsArray[index].ora=ora;
	    			if (action.type === 'CHANGED_ITEM_INVENTARIO_SIDE') 
		    			{
		    			if (state.stock[ean] !== null)
		    				{
		    				let prima = state.stock[ean];	
		    				itemsArray[index].prima=prima;
		    				itemsArray[index].dopo=prima + itemsArray[index].pezzi;
		    				}
		    		  
		    		       
		    			}
	    		}
	       newState = {...state, stockOra: stockOra, itemsArray: itemsArray};		
	       }		
	       break;
	       
	    case 'DELETED_ITEM_INVENTARIO_SIDE':
	       { 
	          let stockOra ={...state.stockOra};
	       let deltaArray = Object.entries(action.deltaStockOra);  
	       delete stockOra[deltaArray[0][0]];
	       
	       newState = {...state, stockOra: stockOra};	
	       }	
	    	break;
	    
	    case 'FOUND_CATALOG_ITEM_INVENTARIO':
	      newState = rigaInventarioR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaInventario);
	      if (newState.stock[action.item.ean] !== undefined) {newState.editedItem.values.prima = newState.stock[action.item.ean]; newState.editedItem.values.dopo = newState.stock[action.item.ean];}
	      break;
   	    	    
      default:
    
        newState = rigaInventarioR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaInventario);
        //newState =  state;
    	break;
   
  }
 return newState;
}

//Il mio primo selettore colocato https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers!!!
//Questi rimarranno identici in tutti i casi... Posso migliorare queste ripetizioni inutili?
 export const getItems = (state) => {return state.itemsArray};  
 export const getEditedItem = (state) => {return state.editedItem};  
 export const getTestataBolla = (state) => {return state.testata};
 export const getShowCatalogModal = (state) => {return state.showCatalogModal};  
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getTableScroll = (state)  => {return state.tableScroll};
 export const getListeningTestataBolla = (state) => {return state.listeningTestata};
 export const getListeningItemBolla = (state) => {return state.listeningItem};
 export const isStaleTotali = (state) => {return state.staleTotali};
 export const getMessageBuffer = (state) => {return state.messageBuffer};
 export const listeningDataMagazzino = (state) => {return state.listeningDataMagazzino};
 export const getDataMagazzino = (state) => {return state.dataMagazzino};
 export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 
 
 
 
      



