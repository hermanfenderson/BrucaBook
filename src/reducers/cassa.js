/*Completamente riscritta... in sostanza carico elencoScontrini e Scontrini per quella cassa e calcolo tutto al volo*/
import FormReducer from '../helpers/formReducer'
import {
INITIAL_LOAD_ITEM_ELENCOSCONTRINI, 
ADDED_ITEM_ELENCOSCONTRINI, 
CHANGED_ITEM_ELENCOSCONTRINI, 
DELETED_ITEM_ELENCOSCONTRINI, 
INITIAL_LOAD_ITEM_SCONTRINI, 
ADDED_ITEM_SCONTRINI, 
CHANGED_ITEM_SCONTRINI, 
DELETED_ITEM_SCONTRINI, 	
} from '../actions/cassa';

import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, isValidEditedItem} from '../helpers/form';
import {isPositiveInteger, isPercentage} from '../helpers/validators'
import {COL_H_S, SEL_W_S,FMW, initCalcGeometry, calcFormColsFix, calcHeaderFix} from '../helpers/geometry'
import moment from 'moment';
import {persistTree} from '../helpers/firebase';
import memoizeOne from 'memoize-one';


const ADD_ITEM_CASSA = 'ADD_ITEM_CASSA';
const CHANGE_ITEM_CASSA = 'CHANGE_ITEM_CASSA';
const DELETE_ITEM_CASSA = 'DELETE_ITEM_CASSA';



const ADD_ITEM_SCONTRINO = 'ADD_ITEM_SCONTRINO';
const CHANGE_ITEM_SCONTRINO= 'CHANGE_ITEM_SCONTRINO';
const DELETE_ITEM_SCONTRINO = 'DELETE_ITEM_SCONTRINO';


const aggiornaTotaliLocale = (newState) =>
{
let elencoScontrini = {...newState.elencoScontrini};
let scontrini = newState.scontrini;
let elencoScontriniArray = Object.entries(elencoScontrini);
let totalePezziGen = 0;
let totaleImportoGen = 0.00;
let numScontrini = 0;

for (let i=0; i<elencoScontriniArray.length;i++)
	{
	let totalePezzi = 0;
	let totaleImporto = 0.00;
	let scontrinoKey = elencoScontriniArray[i][0];
		let righe = [];
	if (scontrini[scontrinoKey]) righe=Object.values(scontrini[scontrinoKey]);
	for (let propt=0; propt<righe.length;  propt++)
		{
				totalePezzi = parseInt(righe[propt].pezzi, 10) + totalePezzi;
	    		totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);	
			     			
			
	    		
		}
	elencoScontrini[scontrinoKey].totali = {pezzi: totalePezzi, prezzoTotale: totaleImporto.toFixed(2)};	
	totalePezziGen = totalePezziGen + totalePezzi;
	totaleImportoGen =  parseFloat(totaleImportoGen) + parseFloat(totaleImporto);
	numScontrini++;
	}
	
return({...newState,  elencoScontrini: elencoScontrini, totali: {'scontrini': numScontrini, 'pezzi' : totalePezziGen, 
						'prezzoTotale' : totaleImportoGen.toFixed(2)} });
//return(newState);
}

	
const editedRigaCassaValuesInitialState = 
	  {			
	            oraScontrino: null,
	            sconto: 0,
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaCassaValuesInitialState, {} ));
}

//eeometria dela metà di sinistra della scena scontrino
let geometryParams = {cal: {
	                    infoHeight: COL_H_S,
	                    
						totaliWidth: 190,
						totaliHeight: 70,
						
						formSearchHeight: COL_H_S,
						
						colSearchParams: [
										{name: 'titolo', min: 120},
										{name: 'reset', min: 30, max: 30},
										],
						headerParams: [
									  {name: 'numero', label: '#', min: 80 },
									  {name: 'oraScontrino', label: 'Ora', min: 50, max: 50},
									  {name: 'pezzi', label: 'Qtà',  min: 40, max: 40},
									  {name: 'prezzoTotale', label: 'Tot.', min: 50, max: 50},
									 ],
						
						},
				  tbc: [
				  	    {cassaWidth: (cal) => {return(cal.w/4)}},
				  	    {cassaHeight: (cal) => {return(cal.h)}},
				  	    
				  		{infoWidth: (cal) => {return(cal.cassaWidth/3)}},
				  	    {nuovoScontrinoWidth: (cal) => {return(cal.cassaWidth*2/3)}},
				  	    
				  	    {tableWidth: (cal) => {return(cal.w/4)}},
				  	    {tableHeight: (cal) =>  {return(cal.h-cal.formSearchHeight- cal.totaliHeight-cal.infoHeight)}},
				  	    {formSearchWidth: (cal) =>  {return(cal.tableWidth)}},
				  	   ],
				 geo: [ 
				  	    {cassaCoors: (cal) =>  {return({height: cal.cassaHeight, width: cal.cassaWidth, top: 0, left: 0})}},
    					
     		    		{tableCoors: (cal) =>  {return({height: cal.tableHeight, width: cal.tableWidth, top: cal.formSearchHeight+cal.totaliHeight+cal.infoHeight, left: 5})}},
    				
    					{header: (cal) =>  {return(calcHeaderFix({colParams: cal.headerParams, width: cal.tableWidth, sel_w: SEL_W_S}))}},
    				    {infoCoors: (cal) => {return({height: cal.infoHeight, width: cal.infoWidth, top: 0, left: 5})}},
    				    {nuovoScontrinoCoors: (cal) => {return({height: cal.testataHeight, width: cal.nuovoScontrinoWidth-5, top: 0, left: cal.infoWidth})}},
    				    {testataCoors: (cal) => {return({height: cal.totaliHeight+cal.formSearchHeight, width: cal.cassaWidth, top: cal.infoHeight, left: 5})}},
    				    //Da tendere relativi a testata...
    				    {formSearchCoors: (cal) =>  {return({height: COL_H_S, width: cal.formSearchWidth, top: 0, left: cal.totaliWidth})}},
    					{totaliCoors: (cal) => {return({height: cal.totaliHeight, width: cal.totaliWidth, top: 0, left: 0})}},
    					{formSearchCols: (cal) =>  {return(calcFormColsFix({colParams: cal.colSearchParams, width: cal.formSearchWidth, offset: 0}))}}, 
    				
    					]
				 }	
const calcGeometry = initCalcGeometry(geometryParams);


const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {listenersItem: {scontrini: {}},
    					geometry: calcGeometry(),
    					//Persistenza del contenuto della cassa... righe scontrini e testate scontrini...
    					scontrini: {},
    					elencoScontrini: {},
                  }
	return initialStateHelper(eiis,extraState);
    }
    
    
    
const transformSelectedItem = (cei) =>
{  /*
	var	oraScontrino = moment(cei.dataCassa);
    oraScontrino.hour(moment(cei.oraScontrino, "HH:mm").hour());
    oraScontrino.minute(moment(cei.oraScontrino, "HH:mm").minute());
	*/
	cei.oraScontrino = moment(cei.oraScontrino);
   
}









    
//Metodi reducer per le Form
const rigaCassaR = new FormReducer(
	{							scene: 'CASSA',
								foundCompleteItem: null,
								transformItem: null, 
								transformSelectedItem: transformSelectedItem, 
								initialState: initialState, 
								keepOnSubmit: true, 
								calcGeometry: calcGeometry});





//In input il nuovo campo... in output il nuovo editedRigaCassa
//di itemsArray qui non mi frega niente...  ma mi interessa lo stato...
function transformAndValidateEditedRigaCassa(cei, name, value, itemsArray, state)
{  	
	
	cei.values[name] = value;
    //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
    cei.errors = {};
    errMgmt(cei, 'oraScontrino','invalidTime','Ora',  (!cei.values.oraScontrino.isValid()));
    errMgmt(cei, 'numero','notPositive','N.>0',  (!isPositiveInteger(cei.values.numero) ));
   errMgmt(cei, 'sconto','invalidPercentage','0-99',  ((cei.values.sconto)  &&((value) => {return !isPercentage(value)})(cei.values.sconto)));
   //Se arrivo qui... devo capire se sto andando a scrivere su uno scontrino che c'e' già...escluso me stesso... che va ovviamente bene... 
   if (name==='numero') 
	{
		let numeroAttuale = cei.selectedItem.numero;
		//Solo nel caso sia diverso dal numero attuale vedo se c'e' un problema... se è lo stesso... non mi allarmo
		if (value !== numeroAttuale)
			{
			let numeriScontrinoValues = Object.values(state.testata.numeriScontrino); //Array con tutti gli scontrini che già esistono...so che numeriScontrino c'e' altrimenti non potrei cambiare il numero...
			for (let i=0; i<numeriScontrinoValues.length; i++) if (numeriScontrinoValues[i] === value) errMgmt(cei, 'numero', 'exist','Esiste', true); //se c'e' già... non posso far salvare...
			}
		
	}
  	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}




export default function cassa(state = initialState(), action) {
  var newState;
  switch (action.type) {
   //Over-ride del reducer form... gestisco diversamente i totali...     
   case ADD_ITEM_CASSA:
   case CHANGE_ITEM_CASSA:
   	
	     	newState =  {...state, staleTotali: false}
	    	break;	
	    	
   case DELETE_ITEM_CASSA:
   			newState =  {...state, staleTotali: true, lastActionKey : action.key}
   	        break;
   	    	
	    	
	//I totali sono stale se cambia una voce dello scontrino sottostante... non la cassa in se!    	
   case ADD_ITEM_SCONTRINO:
   case CHANGE_ITEM_SCONTRINO:
   case DELETE_ITEM_SCONTRINO:
   	
	     	newState =  {...state, staleTotali: true, lastActionKey : action.key}
	    	break;	 
  
	case INITIAL_LOAD_ITEM_ELENCOSCONTRINI:
	case ADDED_ITEM_ELENCOSCONTRINI:
	case CHANGED_ITEM_ELENCOSCONTRINI:
	case DELETED_ITEM_ELENCOSCONTRINI:
			newState = persistTree({state: state, type: action.type, payload: action.payload, objName: 'elencoScontrini'});
            newState = aggiornaTotaliLocale(newState);

			break;
			
	case INITIAL_LOAD_ITEM_SCONTRINI:
	case ADDED_ITEM_SCONTRINI:
	case CHANGED_ITEM_SCONTRINI:
	case DELETED_ITEM_SCONTRINI:
			newState = persistTree({state: state, type: action.type, payload: action.payload, objName: 'scontrini'});
			newState = aggiornaTotaliLocale(newState);
			break;
		
	    	
    default:
        newState = rigaCassaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaCassa);
        //newState =  state;
    	break;
   
  }
 return newState;
}

//Il mio primo selettore colocato https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers!!!
//Questi rimarranno identici in tutti i casi... Posso migliorare queste ripetizioni inutili?
 export const getItems = (state) => {return state.itemsArray}; 
 export const getItemsIndex = (state) => {return state.itemsArrayIndex};
 export const getEditedItem = (state) => {return state.editedItem};  
 export const getTestataCassa = (state) => {return state.testata};
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getTableScroll = (state)  => {return state.tableScroll};
 //export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 
 export const getMeasures = (state) => {return state.measures};
 export const getListeningTestataCassa = (state) => {return state.listeningTestata};
 export const getListeningItemCassa = (state) => {return state.listeningItem};
 export const getListenersItemCassa = (state) => {return state.listenersItem};
 
 export const isStaleTotali = (state) => {return state.staleTotali};
 export const getFilters = (state) => {return state.filters};
  export const getTotaliCassa = (state) => {return state.totali};

  export const getScontrini = (state) => {return state.scontrini};
  export const getElencoScontrini = (state) => {return state.elencoScontrini};
  //Qui diventa divertente... genero sinteticamente la lista degli scontrini...
  const calcCassaItems = (elencoScontrini, scontrini) =>
  {
  	let cassaItems = [];
  	let idx = 0;
  	let elencoScontriniArray = Object.entries(elencoScontrini);
  	for (let i=0; i<elencoScontriniArray.length; i++)
  		{
  			let scontrinoKey = elencoScontriniArray[i][0];
  			
  			cassaItems.push(elencoScontriniArray[i][1]);
  			cassaItems[idx].tipo = 'scontrino';
  			cassaItems[idx].key = scontrinoKey;
  			cassaItems[idx].scontrinoKey = scontrinoKey;
  			
  			idx++;
  			//Ci sono righe per quello scontrino? 
  			if (scontrini[scontrinoKey])
  				{
  					let scontriniArray = Object.entries(scontrini[scontrinoKey])
  					for (let j=0; j<scontriniArray.length; j++) 
  						{scontriniArray[j][1].tipo = 'rigaScontrino';
  						scontriniArray[j][1].key = scontriniArray[j][0];
  						scontriniArray[j][1].scontrinoKey = scontrinoKey;
  						cassaItems.push(scontriniArray[j][1]); //tutte le righe scontrino
  						idx++;
  						}
  				}	
  		}
  	return (cassaItems);	
  }
  const memoizedCalcCassaItems = memoizeOne(calcCassaItems);	
  
  export const getItemsCassa = (state) => {return memoizedCalcCassaItems(state.elencoScontrini, state.scontrini)}
  
  //Decido sulla base del fatto che ho un numero di numeroScontrini pari a quello che ho in totale se posso consentire la modifica del numero scontrino
  export const canChangeNumber = (state) => {
  	let numScontTotali = (state.totali) ? state.totali.scontrini : null;
  	if (!numScontTotali) return false; //se ho zero scontrini oppure non è definito il totale... non vado avanti...
  	
  	let numeriScontrino = (state.testata) ? state.testata.numeriScontrino : null;
  	if (!numeriScontrino) return false; //Se proprio non ho numeriScontrino... non vado avanti...
  	
  	let numScontNumeri = Object.keys(numeriScontrino).length;
  	if (numScontNumeri !== numScontTotali) return false;
  	return true; //se il numero è uguale.. ritorno true
  	
  }
  	
  
      



