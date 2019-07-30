import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';


import {isAmount, isNotNegativeInteger,  isPercentage} from '../helpers/validators';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  noErrors,eanState, updateEANErrors} from '../helpers/form';
import {calcFormColsFix, calcHeader, calcGeneralError} from '../helpers/geometry';



const editedRigaBollaValuesInitialState = 
	  {			ean: '',
				titolo: '',
				autore: '',
				prezzoListino: '',
				sconto1: '',
				sconto2: '',
				sconto3: '',
				manSconto: false,
				prezzoUnitario: '',
				pezzi: '1',
				gratis: '',
				prezzoTotale: '',
				imgUrl: '',
				imgFirebaseUrl: ''
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaBollaValuesInitialState, {} ));
}

const formHeight = 180;
const totaliWidth = 190;
const totaliHeight = 200;
const immagineWidth = 190;
const immagineHeight = 200;

const tableWidth = 960 - totaliWidth;
const formWidth = 960;
const formSearchWidth = tableWidth;
const formSearchHeight = 60;
const tableHeight = 720 - formHeight;

const colSearchParams = [
	{name: 'ean', min: 120, max: 120},
	{name: 'titolo', min: 396},
	{name: 'reset', min: 180, max: 240},

	]
 
const colParams1 = [
	{name: 'ean', min: 200, max: 200},
	{name: 'titolo', min: 446 },
	{name: 'autore', min: 180 },
	{name: 'listino', min: 70, max: 70}
	
	];
	
const colParams2 = [
	{name: 'man', min: 30, max: 30},
	{name: 'sconto1', min: 60, max: 70},
	{name: 'sconto2', min: 60, max: 70},
	{name: 'sconto3', min: 60, max: 70},
	{name: 'prezzo', min: 80, max: 90},
	{name: 'pezzi', min: 70, max: 80},
	{name: 'gratis', min: 70, max: 80},
	{name: 'totale', min: 90, max: 100},

	{name: 'annulla', min: 120, max: 240},
	{name: 'crea', min: 120, max: 240}
	
	];
	

	
const headerParams = [{name: 'ean', label: 'EAN', min: 130, max: 130},
			    {name: 'titolo', label: 'Titolo', min: 312, sort:'string', ellipsis: true},
			    {name: 'prezzoUnitario', label: 'Prezzo', min: 60, max: 60},
			    {name: 'prezzoTotale', label: 'Totale', min: 60, max: 100},
			   {name: 'pezzi', shortLabel: 'Pz.', label: 'Pezzi', shortBreak: 50, min: 40, max: 80},
			    {name: 'gratis', shortLabel: 'Gr.', label: 'Gratis', shortBreak: 50, min: 40, max: 80},
			   ];
	

const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
		
    		geometry: {
     		    		formSearchCoors: {height: 60, width: formSearchWidth, top: 0, left: totaliWidth},
    				
     		    		formSearchCols: calcFormColsFix(colSearchParams,8,formSearchWidth -25, 60, 0),
     		    		formCoors: {height: formHeight - 10, width: formWidth -10, top: formSearchHeight + tableHeight, left: 0},
    				
     		    		formCols1: calcFormColsFix(colParams1,8,formWidth -25,60,0), 
    					formCols2: calcFormColsFix(colParams2,8,formWidth -25,60,60), 
    					tableCoors: {height: tableHeight, width: tableWidth, top: formSearchHeight, left: totaliWidth},
    				
    					generalError: calcGeneralError(formWidth - 25, 120),	 
    		//Header ha tolleranza per barra di scorrimento in tabella e sel 
    					header: calcHeader(headerParams, tableWidth - 60 -10),
    					totaliCoors: {height: totaliHeight, width: totaliWidth, top: 0, left: 0},
    					immagineCoors: {height: immagineHeight, width: immagineWidth, top: 720 - totaliHeight - immagineHeight - formHeight, left: 0}
    				
    							
    			
    					}	
     				}

	return initialStateHelper(eiis,extraState);
    }
    

const calcolaTotali = (state) =>
{
	let totalePezzi = 0;
	let totaleGratis = 0;
	let totaleImporto = 0.00;
	let righe = state.itemsArray;
	for (let propt=0; propt<righe.length; propt++)
		{	
			totalePezzi = parseInt(righe[propt].pezzi, 10) + totalePezzi;
			totaleGratis = parseInt(righe[propt].gratis, 10) + totaleGratis;
	    	totaleImporto =  parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
		}
	const totali = {'pezzi' : totalePezzi, 'gratis' : totaleGratis,
						'prezzoTotale' : totaleImporto.toFixed(2)}; 
	return ({...state, totali: totali});				
};
 
    
//Metodi reducer per le Form
const rigaBollaR = new FormReducer('BOLLA', foundCompleteItem, null, null, initialState); 


function discountPrice(prezzoListino, sconto1, sconto2, sconto3)
{  
  return ((1 - sconto1/100) *((1 - sconto2 /100) *((1 - sconto3/100) * prezzoListino))).toFixed(2);    
}  

//Si comporta diversamente nei vari casi...
function pricesMgmt(changedEditedRigaBolla, name)
{
	const prezzoListino = changedEditedRigaBolla.values['prezzoListino'];	
	const sconto1 = changedEditedRigaBolla.values['sconto1'];
	const sconto2 = changedEditedRigaBolla.values['sconto2'];
	const sconto3 = changedEditedRigaBolla.values['sconto3'];
	const pezzi = changedEditedRigaBolla.values['pezzi'];
	const manSconto = changedEditedRigaBolla.values['manSconto'];
	if (name !== 'prezzoUnitario' && sconto1>=0 && sconto2>=0 && sconto3>=0)
		{
		if (manSconto) changedEditedRigaBolla.values['prezzoUnitario'] = prezzoListino;
		else changedEditedRigaBolla.values['prezzoUnitario'] = discountPrice(prezzoListino, sconto1, sconto2, sconto3);
		}
	const prezzoUnitario = changedEditedRigaBolla.values['prezzoUnitario'];
	if (prezzoUnitario >=0 && pezzi>=0) changedEditedRigaBolla.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);	
}



//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaBolla(cei, name, value)
{  	
	cei.values[name] = value;
	//Gestione cambiamenti
    switch (name) {
		case 'sconto1':
		case 'sconto2':
	    case 'sconto3':
	    case 'manSconto':
	    case 'prezzoUnitario':
	        if (name === 'manSconto' && value) 
	        	{
	        		cei.values.sconto1 = '';
	        		cei.values.sconto2 = '';
	        		cei.values.sconto3 = '';
	        		
	        	}
	    	if (cei.values['prezzoListino'] > 0) pricesMgmt(cei, name);
		break;		
		case 'pezzi':
			const pezzi = cei.values['pezzi'];
			const prezzoUnitario = cei.values['prezzoUnitario'];
			if (prezzoUnitario >=0 && pezzi>=0) cei.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);
	    break;
		
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

  
		
   errMgmt(cei, 'sconto1','invalidPercentage','0-99',  ((value) => {return !isPercentage(value)})(cei.values.sconto1));
   errMgmt(cei, 'sconto2','invalidPercentage','0-99',  ((value) => {return !isPercentage(value)})(cei.values.sconto2));
   errMgmt(cei, 'sconto3','invalidPercentage','0-99',  ((value) => {return !isPercentage(value)})(cei.values.sconto3));
   	
   
   	errMgmt(cei, 'prezzoUnitario','invalidAmount','Importo (19.99)',  
   	    ((value) => {return !isAmount(value)})(cei.values.prezzoUnitario), 
   	    ((value) => {return (value.length>0 && !isAmount(value))})(cei.values.prezzoUnitario));
   	    
    errMgmt(cei, 'pezzi','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cei.values.pezzi));
  	errMgmt(cei, 'gratis','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cei.values.gratis));
  
  


    errMgmt(cei, 'pezzi','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cei.values.pezzi));
  	errMgmt(cei, 'gratis','notPositive','numero intero',  ((value) => {return !isNotNegativeInteger(value)})(cei.values.gratis));
  	//Così si accendono i campi vuoti quando valida...
  	
  	errMgmt(cei, 'pezzi','noItems','',  ((pezzi,gratis) => {return (!((pezzi>=0) && (gratis>=0) && (pezzi+gratis>0)))})(cei.values.pezzi,cei.values.gratis), false);
  	errMgmt(cei, 'gratis','noItems','',  ((pezzi,gratis) => {return (!((pezzi>=0) && (gratis>=0) && (pezzi+gratis>0)))})(cei.values.pezzi,cei.values.gratis), false);
  	
  	
  	errMgmt(cei, 'form','noItems','almeno un oggetto!',  ((pezzi,gratis) => {return (!((pezzi>=0) && (gratis>=0) && (pezzi+gratis>0)))})(cei.values.pezzi,cei.values.gratis),false);
  	
  	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}


function foundCompleteItem(editedItem, action) 
	{   
		let cei = editedItemCopy(editedItem);
		 
		 cei.willFocus = 'pezzi';
     
       	//Copio l'esito della ricerca...
       	cei.values = {...cei.values, ...action.item}
        /*
    	cei.values.titolo = action.item.titolo;
    	cei.values.autore = action.item.autore;
    	cei.values.prezzoListino = action.item.prezzoListino;
    	if ('editore' in cei.values) cei.values.editore = action.item.editore;
    	*/
    	
    	//Aggiorno i prezi e i totali
    	if (cei.values['prezzoListino'] > 0) pricesMgmt(cei,'prezzoListino');
    	
    	//Il form e' potenzialmente valido... sgancio gli errori...
    	//Se sono qui... EAN è sicuramente valido...
        noErrors(cei,'ean');
        noErrors(cei,'form');
        noErrors(cei,'prezzoUnitario');
      	 cei.isValid = isValidEditedItem(cei);
       return(cei);
	}

export default function bolla(state = initialState(), action) {
  var newState;
  switch (action.type) {
    
   case STORE_MEASURE:
   	    newState = state;
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    if (action.newMeasure.name==='mainHeight')
   			{
   			/*	
   	    	let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formRigaBollaHeight'] -150;
   	    	newState = {...state, tableHeight: height};
   			*/
   			let geometry = {...state.geometry};
   			let tableHeight = measures['mainHeight'] - formHeight - formSearchHeight;
    		geometry.tableCoors = {...state.geometry.tableCoors, height: tableHeight - 10}; 
    		geometry.formCoors = {...state.geometry.formCoors,  top: formSearchHeight + tableHeight};
    		geometry.immagineCoors = {...state.geometry.immagineCoors,  top: measures['mainHeight']- totaliHeight - formHeight};
    				
    		newState = {...state, geometry: geometry};
   					
   			}
   		if (action.newMeasure.name==='mainWidth' )
   	   		{	let geometry = {...state.geometry};
   		
   	   			let tableWidth = measures['mainWidth'] - totaliWidth;
				let formWidth = measures['mainWidth'];
				let formSearchWidth = tableWidth;
                geometry.formSearchCoors = {...state.geometry.formSearchCoors, width: formSearchWidth }; 
    	        geometry.formSearchCols = calcFormColsFix(colSearchParams,8,formSearchWidth -25, 60, 0); 
    			geometry.formCoors = {...state.geometry.formCoors, width: formWidth -10}; 
    	        geometry.formCols1 = calcFormColsFix(colParams1,8,formWidth -25,60,0); 
    	    	geometry.formCols2 = calcFormColsFix(colParams2,8,formWidth -25,60,60); 
    			geometry.tableCoors = {...state.geometry.tableCoors, width: tableWidth }; 
    	        geometry.generalError= calcGeneralError(formWidth - 25, 120); 
    		    geometry.header= calcHeader(headerParams, tableWidth - 60 -10);
    	    	newState = {...state, geometry: geometry};
   			
   	   			
    									
   	   		/*	
   			let formWidth = (measures['viewPortWidth'] -measures['siderWidth'] -16) - 8;	
   			let tableWidth = formWidth * 5 / 6 -8 ;
   			let formSearchCols = calcFormCols(colSearchParams,8,tableWidth);
   		
   			let formCols1 = calcFormCols(colParams1,8,formWidth);
   			let formCols2 = calcFormCols(colParams2,8,formWidth);
   			let header = calcHeader(headerParams, tableWidth - 60);
   			let geometry = {...newState.geometry};
   			
   		    newState = {...newState, geometry: {...geometry, formWidth: formWidth, formCols1: formCols1, formCols2: formCols2, formSearchCols: formSearchCols, header: header}};
   			*/
   			}
   	
        break;
  
    default:
        newState = rigaBollaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaBolla, calcolaTotali);
        //newState =  state;
    	break;
   
  }
 console.log(newState); 
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
 export const getFiltersBolla = (state) => {return state.filters};
 
 export const getTotali = (state) => {return state.totali};
 //Questa per memoria storica
 //export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 
 
 
      



