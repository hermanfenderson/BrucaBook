import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';
import {ADDED_RIGASCONTRINO, CHANGED_RIGASCONTRINO, DELETED_RIGASCONTRINO} from '../actions/cassa';

import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, isValidEditedItem} from '../helpers/form';
import {isPositiveInteger} from '../helpers/validators'
import moment from 'moment';

const ADD_ITEM_CASSA = 'ADD_ITEM_CASSA';
const CHANGE_ITEM_CASSA = 'CHANGE_ITEM_CASSA';
const DELETE_ITEM_CASSA = 'DELETE_ITEM_CASSA';

const ADDED_ITEM_CASSA = 'ADDED_ITEM_CASSA';
const CHANGED_ITEM_CASSA = 'CHANGED_ITEM_CASSA';
const DELETED_ITEM_CASSA = 'DELETED_ITEM_CASSA';



const ADD_ITEM_SCONTRINO = 'ADD_ITEM_SCONTRINO';
const CHANGE_ITEM_SCONTRINO= 'CHANGE_ITEM_SCONTRINO';
const DELETE_ITEM_SCONTRINO = 'DELETE_ITEM_SCONTRINO';
const SET_REDIRECT_CASSA = 'SET_REDIRECT_CASSA';

const editedRigaCassaValuesInitialState = 
	  {			
	            oraScontrino: null,
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaCassaValuesInitialState, {} ));
}


const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {shouldRedirect : false,
                  }
	return initialStateHelper(eiis,extraState);
    }
    
    
const transformSelectedItem = (cei) =>
{
    var	oraScontrino = moment(cei.dataCassa);
    oraScontrino.hour(moment(cei.oraScontrino, "HH:mm").hour());
    oraScontrino.minute(moment(cei.oraScontrino, "HH:mm").minute());
	cei.oraScontrino = oraScontrino;

}

const transformEditedCassa = (row) =>
{   
	row.oraScontrino = moment(row.oraScontrino).format("HH:mm");
}



/*Struttura dati di dataIndex
scontrini
	scontrino -> precedente (num.scontrino), prossimo (num.scontrino), key (chiave scontrino), length (lunghezza scontrino compreso header) 
chiavi
    chiave -> pos_array
*/
//Ogni volta che devo riallineare le chiavi... 
function updateChiavi(dataArray, dataIndex, start)
{
	for (var i=start; i<dataArray.length; i++)
		{
		dataIndex.chiavi[dataArray[i].key] = i;
		}
}

//Queste vanno modificate per essere adattate ad avere figli...
function childAdded(payload, state, dataArrayName, dataIndexName, transformItem, forcedTmp)
{  //Creo un array e un indice per copia degli attuali
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndexNew = {...(state[dataIndexName])};
  //Prendo la riga da aggiungere e aggiungo una proprietà con la chiave
   var tmp = payload.val();
   tmp['key'] = payload.key;
   tmp['tipo'] = 'scontrino';
   if (forcedTmp) tmp = forcedTmp;
    //Se è definita una funzione di trasformazione la applico
   if (transformItem) transformItem(tmp);

   //Se è il primo scontrino a entrare inizializzo le strutture...
   if (dataArrayNew.length === 0)
		{
		dataIndexNew.scontrini = {};	
        dataIndexNew.scontrini[tmp.numero] = {'precedente': null, 'successivo': null, 'key': tmp['key'], 'leng': 1};
        dataArrayNew[0] = tmp;
        dataIndexNew.chiavi = {};
        dataIndexNew.chiavi[tmp.key] = 0;
		}
		
   else {
   	    //Determino la posizione dello scontrino...
   	    //E' un nuovo primo?  
   	    if (tmp['numero'] < dataArrayNew[0].numero)
   			{
   				dataIndexNew.scontrini[tmp.numero] = {'precedente': null, 'successivo': dataArrayNew[0].numero, 'key': tmp['key'], 'leng': 1};
   				dataIndexNew.scontrini[dataArrayNew[0].numero].precedente = tmp.numero;
   				dataArrayNew.splice(0, 0, tmp);
   				//Aggiorno il puntatore delle chiavi...
		        updateChiavi(dataArrayNew, dataIndexNew, 0);
		   	         
   			}
   		else {
   			var propt = dataArrayNew[0].numero;
	   	    while (propt)
	   	    	{
	   	        //Ho trovato il mio posto... dopo uno più piccolo di me e prima di null oppure di più grande di me...
	   	         if ((propt <= tmp['numero']) && ((!dataIndexNew.scontrini[propt].successivo) || (dataIndexNew.scontrini[propt].successivo > tmp['numero'])))
		   	        {
		   	        	let precedente = propt;
		   	        	let successivo = dataIndexNew.scontrini[propt].successivo;
		   	        	let inizio = dataIndexNew.chiavi[dataIndexNew.scontrini[propt].key] + dataIndexNew.scontrini[propt].leng;
		   	        	dataIndexNew.scontrini[propt].successivo = tmp['numero']; //Aggiorno la catena 
		   	        	dataIndexNew.scontrini[tmp.numero] = {'precedente': precedente, 'successivo': successivo, 'key': tmp['key'], 'leng': 1};
		   	        	dataArrayNew.splice(inizio,0, tmp);
		   	        	updateChiavi(dataArrayNew, dataIndexNew, inizio);
		   	         //Aggiorno il puntatore delle chiavi...
		        	 
		   	         break;
		   	        }
	   	         propt = dataIndexNew.scontrini[propt].successivo;
	   	    	}
   			}	
		}	
   
  //Aggiorno lo stato passando nuovo array e nuovo indice
   var newState = {...state};
   newState[dataArrayName] = dataArrayNew;
   newState[dataIndexName] = dataIndexNew;                    
   return newState;
}

function childDeleted(payload, state, dataArrayName, dataIndexName, forcedNumber)
{  //Creo un array e un indice per copia degli attuali
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndexNew = {...(state[dataIndexName])};
   //Cerco nell'indice la riga nell'array da cancellare  
   var index = dataIndexNew.chiavi[payload.key];
   var numero = payload.val().numero;
   if (forcedNumber) numero = forcedNumber; //Gestisco la cancellazione dalla change...
   if (forcedNumber) index = dataIndexNew.chiavi[dataIndexNew.scontrini[numero].key];
   var leng = dataIndexNew.scontrini[numero].leng;
   //Antirimbalzo...
   if (index>=0) 
		{
	  //Sgancio dalla catena lo scontrino che cancello...
	  var precedente = dataIndexNew.scontrini[numero].precedente;
	  var successivo = dataIndexNew.scontrini[numero].successivo;
	  if (precedente) dataIndexNew.scontrini[precedente].successivo = successivo;
	  if (successivo) dataIndexNew.scontrini[successivo].precedente = precedente;
	  delete dataIndexNew.scontrini[numero];
	  //Per tutte le righe interessate
	  for (var i=index; i<index+leng; i++)
		   {	
		  //Visto che sto tagliando l'array... ogni volta cancello nella stessa posizione!	
		  //Cancello la riga nell'indice
		   delete dataIndexNew.chiavi[dataArrayNew[index].key];
		   //Cancello la riga nell'array
		   dataArrayNew.splice(index,1);
		   }
	  //Aggiorno da quella posizione tutti gli indici...
	 
	  updateChiavi(dataArrayNew, dataIndexNew, index);
   
	
	
	   //Aggiorno lo stato passando nuovo array e nuovo indice   
	   let newState = {...state};
	   newState[dataArrayName] = dataArrayNew;
	   newState[dataIndexName] = dataIndexNew;                    
	   return newState;
	   }
	else return {...state};
}

function childChanged(payload, state, dataArrayName, dataIndexName, transformItem)
{  
   //Due casi... uno base in cui non ho cambiato lo scontrino... e uno in cui lo ho cambiato... in cui devo chiamare una insert 
   //e una delete...	
   //Creo un array per copia dell'attuale e accedo all'indice (non mi serve cambiarlo)
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndexNew = state[dataIndexName];
 
  //Vedo in quale posizione devo modificare
  var index = dataIndexNew.chiavi[payload.key];
  var scontrino = (dataArrayNew[index]) ? dataArrayNew[index].numero : null; //se non lo trovo...l'ho cancellato
  //Caso facile...
  if (scontrino === payload.val().numero) 
		{
		   //Antirimbalzo
		   if (index>=0) 
				{
				  //Prendo la riga da modificare e aggiungo una proprietà con la chiave
				 var tmp = payload.val();
				 tmp['key'] = payload.key;
				 tmp['tipo'] = 'scontrino';
   
				 //Se è definita una funzione di trasformazione la applico
				   if (transformItem) transformItem(tmp);
				  
				   dataArrayNew[index] = tmp; //Aggiorno la riga alla posizione giusta
				  
				  //Aggiorno lo stato passando nuovo array e nuovo indice
				   let newState = {...state};
				   newState[dataArrayName] = dataArrayNew;
				   newState[dataIndexName] = dataIndexNew;                    
				   return newState;
				}
			else return {...state};  
		}
  else 
	{   
		let newState = {...state};
		if (scontrino)
		{
		   //Strategia alternativa.... cancello tutto ciò che ho e lo tratto alla stregua di una riga nuova (tanto arrivano i figli...)
		   //Mi faccio una copia delle righe che mi interessano...
		   newState = childDeleted(payload, newState, dataArrayName, dataIndexName, scontrino);

		   //Se la mia destinazione esiste già... salvo le sue righe e faccio uno swap...
		   var scontrino2 = payload.val().numero;
		   if (dataIndexNew.scontrini[scontrino2])
				{   
					newState = childDeleted(payload, newState, dataArrayName, dataIndexName, scontrino2);

		
				}
		 }
		    newState = childAdded(payload, newState, dataArrayName, dataIndexName, transformEditedCassa);
			return newState;
		
	
		   
		   
	}
	
}


function subChildAdded(payload, state, dataArrayName, dataIndexName, transformItem, forceTmp)
{  //Creo un array e un indice per copia degli attuali

   var dataArrayNew = state[dataArrayName].slice();
   var dataIndexNew = {...(state[dataIndexName])};
  //Prendo la riga da aggiungere e aggiungo una proprietà con la chiave
   var tmp = payload.val();
   if (forceTmp) tmp = forceTmp; 
   if (!forceTmp) tmp['key'] = payload.key;
   tmp['tipo'] = 'rigaScontrino';
   var numero = tmp['numero'];
   tmp['numero'] = tmp['titolo'];
   tmp['totali'] = {pezzi: tmp['pezzi'], prezzoTotale: tmp['prezzoTotale']};
    //Se è definita una funzione di trasformazione la applico
   if (transformItem) transformItem(tmp);
   
   //Lo metto nella prima posizione utile nello scontrino giusto... 
   var posScontrino = dataIndexNew.chiavi[dataIndexNew.scontrini[numero].key];
   var posRiga = posScontrino + dataIndexNew.scontrini[numero].leng;
   dataIndexNew.scontrini[numero].leng++; //e allungo di uno la sua lunghezza...
   
   dataArrayNew.splice(posRiga,0, tmp);
   //Aggiorno il puntatore delle chiavi...
   updateChiavi(dataArrayNew, dataIndexNew, posRiga);
    let newState = {...state};
	   
    newState[dataArrayName] = dataArrayNew;
    newState[dataIndexName] = dataIndexNew;                    
   return newState;
}

function subChildDeleted(payload, state, dataArrayName, dataIndexName)
{  //Creo un array e un indice per copia degli attuali
 
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndexNew = {...(state[dataIndexName])};
   //Cerco nell'indice la riga nell'array da cancellare  
   var index = dataIndexNew.chiavi[payload.key];
   var numero = payload.val().numero;
    //Antirimbalzo...
   if (index>=0) 
		{
	  //Cancello la riga nell'indice
	   delete dataIndexNew.chiavi[payload.key]
	   //Decremento la lunghezza dello scontrino
	   dataIndexNew.scontrini[numero].leng--; //e allungo di uno la sua lunghezza...
	  //Cancello la rigna nell'array
	   dataArrayNew.splice(index,1);
	  //Aggiorno da quella posizione tutti gli indici...
	  updateChiavi(dataArrayNew, dataIndexNew, index);
   
	
	
	   //Aggiorno lo stato passando nuovo array e nuovo indice   
	   let newState = {...state};
	   newState[dataArrayName] = dataArrayNew;
	   newState[dataIndexName] = dataIndexNew;                    
	   return newState;
	   }
	else return {...state};
}

function subChildChanged(payload, state, dataArrayName, dataIndexName, transformItem)
{  //Creo un array per copia dell'attuale e accedo all'indice (non mi serve cambiarlo)
   var dataArrayNew = state[dataArrayName].slice();
   var dataIndex = state[dataIndexName];
  //Vedo in quale posizione devo modificare
  var index = dataIndex.chiavi[payload.key];
   //Antirimbalzo
  
   if (index>=0) 
		{
		   var tmp = payload.val();
		   tmp['key'] = payload.key;
		   tmp['tipo'] = 'rigaScontrino';
		   tmp['numero'] = tmp['titolo'];
		   tmp['totali'] = {pezzi: tmp['pezzi'], prezzoTotale: tmp['prezzoTotale']};
		    //Se è definita una funzione di trasformazione la applico
		   if (transformItem) transformItem(tmp);
		   
		   dataArrayNew[index] = tmp; //Aggiorno la riga alla posizione giusta
		  
		  //Aggiorno lo stato passando nuovo array e nuovo indice
		   let newState = {...state};
	   newState[dataArrayName] = dataArrayNew;
	   newState[dataIndexName] = dataIndex;                    
	   return newState;
		}
	else return subChildAdded(payload, state, dataArrayName, dataIndexName, transformItem) ;   
}

 
    
//Metodi reducer per le Form
const rigaCassaR = new FormReducer('CASSA', null, transformEditedCassa, transformSelectedItem, initialState, true); 




//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaCassa(cei, name, value)
{  	
	cei.values[name] = value;

  //I messaggi vengono ricalcolati a ogni iterazione...
    cei.errorMessages = {};
    errMgmt(cei, 'oraScontrino','invalidTime','Ora non valida',  (!cei.values.oraScontrino.isValid()));
    errMgmt(cei, 'numero','notPositive','Numero > 0',  (!isPositiveInteger(cei.values.numero)));
  
  	
    //Se ho anche solo un errore... sono svalido.
    cei.isValid = isValidEditedItem(cei);
    return cei;
}




export default function cassa(state = initialState(), action) {
  var newState;
  switch (action.type) {
   case SET_REDIRECT_CASSA:
   		newState = {...state, shouldRedirect: action.shouldRedirect};
   		break;
   case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] -  measures['testataCassaHeight'] -130;
   	    newState = {...state, tableHeight: height};
        break;
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
  //FACCIO OVERRIDE DEL REDUCER QUI...
  
   case ADDED_ITEM_CASSA:
		 	newState = childAdded(action.payload, state, "itemsArray", "itemsArrayIndex", transformEditedCassa); 
	    	break;
	       
	case DELETED_ITEM_CASSA:
	    	newState = childDeleted(action.payload, state, "itemsArray", "itemsArrayIndex"); 
	    	break;
	   
	case CHANGED_ITEM_CASSA:
		    newState = childChanged(action.payload, state, "itemsArray", "itemsArrayIndex", transformEditedCassa); 
	    	break;    
	    	
    case ADDED_RIGASCONTRINO:
		 	newState = subChildAdded(action.payload, state, "itemsArray", "itemsArrayIndex"); 
	    	break;
	       
	case DELETED_RIGASCONTRINO:
	    	newState = subChildDeleted(action.payload, state, "itemsArray", "itemsArrayIndex"); 
	    	break;
	   
	case CHANGED_RIGASCONTRINO:
			newState = subChildChanged(action.payload, state, "itemsArray", "itemsArrayIndex"); 
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
 export const getMeasures = (state) => {return state.measures};
 export const getListeningTestataCassa = (state) => {return state.listeningTestata};
 export const getListeningItemCassa = (state) => {return state.listeningItem};
 export const isStaleTotali = (state) => {return state.staleTotali};
 export const shouldRedirect = (state) => {return state.shouldRedirect};
 
      



