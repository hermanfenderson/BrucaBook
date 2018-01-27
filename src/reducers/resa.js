//Il reducer RESA considera che i dati sono quelli della bolla originaria. E non dovrebbe farli modificare... ma lascio vivi i controlli se voglio gestire eccezioni...

import FormReducer from '../helpers/formReducer'
import {STORE_MEASURE} from '../actions';
import {LISTEN_BOLLE_PER_FORNITORE, 
		ADDED_BOLLE_PER_FORNITORE, 
		CHANGED_BOLLE_PER_FORNITORE , 
		DELETED_BOLLE_PER_FORNITORE,  
		UNLISTEN_BOLLE_PER_FORNITORE, 
	
		LISTEN_BOLLA_IN_RESA, 
		ADDED_RIGABOLLA_IN_RESA, 
		CHANGED_RIGABOLLA_IN_RESA , 
		DELETED_RIGABOLLA_IN_RESA,  
		UNLISTEN_BOLLA_IN_RESA, 
		LISTEN_DETTAGLI_EAN,
		UNLISTEN_DETTAGLI_EAN,
		GET_DETTAGLI_EAN
} from '../actions/resa';


import {isAmount, isNotNegativeInteger,  isPercentage} from '../helpers/validators';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, editedItemCopy, isValidEditedItem,  noErrors,eanState, updateEANErrors, insertRow, removeRow, getStock} from '../helpers/form';


const editedRigaBollaValuesInitialState = 
	  {			ean: '',
				idRigaBolla: null, //Puntatore anno/mese/idBolla/rigaBolla
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
				imgUrl: ''	
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaBollaValuesInitialState, {} ));
}

//Oggetto che contiene l'elenco dinamico delle bolle afferenti a un fornitore con il listener corrispondente.
//Formato dell'oggetto chiave = idBolla, destination = path della bolla
//Quando cambia qualcosa o quando svuoto l'oggetto devo anche smettere di ascoltare....

//bolleOsservate contiene tutte le bolle di quel fornitore
//Indice EAN contiene elenco di tutte le occorrenze di un EAN nelle varie bolle... formato {riga: bolla}


const initialState = () => {
    const eiis = editedItemInitialState();
	return initialStateHelper(eiis,{listeningFornitore: null, bolleOsservate: {}, indiceEAN: {}, tabellaEAN: [], dettagliEAN: {}, tabelleRigheEAN: {}});
    }
    


 
    
//Metodi reducer per le Form
const rigaResaR = new FormReducer('RESA', foundCompleteItem, null, null, initialState); 


function discountPrice(prezzoListino, sconto1, sconto2, sconto3)
{  
  return ((1 - sconto1/100) *((1 - sconto2 /100) *((1 - sconto3/100) * prezzoListino))).toFixed(2);    
}  

//Si comporta diversamente nei vari casi...
function pricesMgmt(changedEditedRigaResa, name)
{
	const prezzoListino = changedEditedRigaResa.values['prezzoListino'];	
	const sconto1 = changedEditedRigaResa.values['sconto1'];
	const sconto2 = changedEditedRigaResa.values['sconto2'];
	const sconto3 = changedEditedRigaResa.values['sconto3'];
	const pezzi = changedEditedRigaResa.values['pezzi'];
	const manSconto = changedEditedRigaResa.values['manSconto'];
	if (name !== 'prezzoUnitario' && sconto1>=0 && sconto2>=0 && sconto3>=0)
		{
		if (manSconto) changedEditedRigaResa.values['prezzoUnitario'] = prezzoListino;
		else changedEditedRigaResa.values['prezzoUnitario'] = discountPrice(prezzoListino, sconto1, sconto2, sconto3);
		}
	const prezzoUnitario = changedEditedRigaResa.values['prezzoUnitario'];
	if (prezzoUnitario >=0 && pezzi>=0) changedEditedRigaResa.values['prezzoTotale'] =  (pezzi * prezzoUnitario).toFixed(2);	
}



//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaResa(cei, name, value)
{  	
	cei.values[name] = value;
	//Gestione cambiamenti
    switch (name) {
		case 'sconto1':
		case 'sconto2':
	    case 'sconto3':
	    case 'manSconto':
	    case 'prezzoUnitario':
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

export default function resa(state = initialState(), action) {
  var newState;
  switch (action.type) {
    
   case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = measures['viewPortHeight'] - measures['headerHeight'] - measures['formRigaResaHeight'] -130;
   	    newState = {...state, tableHeight: height};
        break;
   
   case LISTEN_BOLLE_PER_FORNITORE:
   	    newState = {...state, listeningFornitore : action.params};
   	    break;
   case LISTEN_DETTAGLI_EAN:
   	    newState = state;
   	    break;
   case UNLISTEN_DETTAGLI_EAN:
        {let dettagliEAN = {...state.dettagliEAN};
   	    delete dettagliEAN[action.params]; //Elimino la riga dai dettagli
   	    newState = {...state, dettagliEAN: dettagliEAN};
   	    }
   	    break;	    
   //Anche qui aggiorno il valore dello stock	    
   case GET_DETTAGLI_EAN:
   	    {let dettagliEAN = {...state.dettagliEAN};
   	    let indiceEAN = {...state.indiceEAN};
   	    let ean = action.payload.key;
   	    let details = action.payload.val();
   	    dettagliEAN[ean] = details;
     
   	    if (indiceEAN[ean] && indiceEAN[ean].pos >= 0) //Se serve ricalcolo lo stock
   	    	{
   	    	 let tabellaEAN = [...state.tabellaEAN];
   	    	 tabellaEAN[indiceEAN[ean].pos].stock = getStock(details); 
   	    	 newState = {...state, dettagliEAN: dettagliEAN, tabellaEAN: tabellaEAN};
   	    	}
   	    else newState = {...state, dettagliEAN: dettagliEAN}	
   	    }
   	    break;
   
   case LISTEN_BOLLA_IN_RESA:
   		{
   		let bolleOsservate = {...state.bolleOsservate};
   		bolleOsservate[action.params.split('/')[2]].righe = {};
   		newState = {...state, bolleOsservate : bolleOsservate};
   			
   		}
   		break;
   	case UNLISTEN_BOLLA_IN_RESA:
   		{
   		let bolleOsservate = {...state.bolleOsservate};
   		delete bolleOsservate[action.params.split('/')[2]];
   		newState = {...state, bolleOsservate : bolleOsservate};
   			
   		}
   		break;	

   	case ADDED_RIGABOLLA_IN_RESA: 
   	case CHANGED_RIGABOLLA_IN_RESA:
   		{
   		let anno = action.payload.ref.path.pieces_[3];
   		let mese = action.payload.ref.path.pieces_[4];
   	    
   		let bolla = action.payload.ref.path.pieces_[5];
   		let riga = action.payload.ref.path.pieces_[6];
   		let idRigaBolla = anno + '/' + mese + '/' + bolla + '/' + riga;
   	    let bolleOsservate = {...state.bolleOsservate};
   	    let row = action.payload.val();
   	    bolleOsservate[bolla].righe[riga] = row;
   	    let ean =  action.payload.val().ean;
   	    let indiceEAN = {...state.indiceEAN};
   	    let tabellaEAN = [...state.tabellaEAN];
   	    let tabelleRigheEAN = {...state.tabelleRigheEAN};
   	    if (!indiceEAN[ean]) 
   	    	{indiceEAN[ean] = {};
   	    	insertRow(indiceEAN, tabellaEAN, {ean: ean, titolo: row.titolo, autore: row.autore, prezzoListino: row.prezzoListino, stock: getStock(ean)}, ean, 'pos', 'ean');
   	    	}
   	    if (!indiceEAN[ean].righe) indiceEAN[ean].righe = {};
   	    let rigaBollaKey = bolla+'/'+riga;
   	    indiceEAN[ean].righe[rigaBollaKey] = {'pos': -1}; //Non è in mostra...
   	   	 
   	     if (!tabelleRigheEAN[ean]) tabelleRigheEAN[ean] = [];
   	     if (action.type === ADDED_RIGABOLLA_IN_RESA) insertRow(indiceEAN[ean].righe, tabelleRigheEAN[ean], {'rigaBolla': rigaBollaKey, 'idRigaBolla': idRigaBolla, 'riferimento': row.riferimento, 'dataDocumento': row.dataDocumento, 'prezzoUnitario': row.prezzoUnitario}, rigaBollaKey, 'pos', 'rigaBolla' );
   	    newState = {...state, bolleOsservate: bolleOsservate, indiceEAN: indiceEAN, tabellaEAN: tabellaEAN, tabelleRigheEAN: tabelleRigheEAN};
   		}
        break;
   case DELETED_RIGABOLLA_IN_RESA:
  	    {
  	    let bolla = action.payload.ref.path.pieces_[5];
   		let riga = action.payload.ref.path.pieces_[6];
   	    let bolleOsservate = {...state.bolleOsservate};
   	    let indiceEAN = {...state.indiceEAN};
   	    let ean = bolleOsservate[bolla].righe[riga].ean;
   	    let tabellaEAN = [...state.tabellaEAN];
   	  
   	    delete bolleOsservate[bolla].righe[riga];
   	    delete indiceEAN[ean].bolle[bolla][riga];
   	    if (Object.keys(indiceEAN[ean].bolle[bolla].righe).length === 0) delete indiceEAN[ean].bolle[bolla];
   	    if (Object.keys(indiceEAN[ean].bolle).length === 0) 
   	    	{   removeRow(indiceEAN, tabellaEAN, ean, 'pos','ean');
   	    		delete indiceEAN[ean];
   	    	}
   	    newState = {...state, tabellaEAN: tabellaEAN};	
  	    }
  	    break;  
  	    
   case UNLISTEN_BOLLE_PER_FORNITORE:
   	    newState = {...state, listeningFornitore : null};
   	    break;
   
   	case ADDED_BOLLE_PER_FORNITORE: 
   	case CHANGED_BOLLE_PER_FORNITORE:
   		{
   		let key = action.payload.key;
   		let val = action.payload.val();
   		let bolleOsservate = {...state.bolleOsservate};
   		bolleOsservate[key] = {...val};
   		newState = {...state, bolleOsservate : bolleOsservate};
   		}
        break;
   case DELETED_BOLLE_PER_FORNITORE:
  	    {
  	    let key = action.payload.key;
   		let bolleOsservate = {...state.bolleOsservate};
   		delete bolleOsservate[key];
   		newState = {...state, bolleOsservate : bolleOsservate};	
  	    }
  	    break;
    default:
        newState = rigaResaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaResa);
        //newState =  state;
    	break;
   
  }
 return newState;
}

//Il mio primo selettore colocato https://egghead.io/lessons/javascript-redux-colocating-selectors-with-reducers!!!
//Questi rimarranno identici in tutti i casi... Posso migliorare queste ripetizioni inutili?
 export const getItems = (state) => {return state.itemsArray};  
 export const getEditedItem = (state) => {return state.editedItem};  
 export const getTestataResa = (state) => {return state.testata};
 //Per certo non consento di inserire un item che non ho censito!!!
 //export const getShowCatalogModal = (state) => {return state.showCatalogModal};  
 export const getTableHeight = (state) => {return state.tableHeight};
 export const getTableScroll = (state)  => {return state.tableScroll};
 export const getListeningTestataResa = (state) => {return state.listeningTestata};
 export const getListeningItemResa = (state) => {return state.listeningItem};
 export const isStaleTotali = (state) => {return state.staleTotali};
 export const getMessageBuffer = (state) => {return state.messageBuffer};
 export const getBolleOsservate = (state) => {return state.bolleOsservate};
 export const getIndiceEAN = (state) => {return state.indiceEAN};
 export const getDettagliEAN = (state) => {return state.dettagliEAN};

 export const getTabellaEAN = (state) => {return state.tabellaEAN};
 export const getTabelleRigheEAN = (state) => {return state.tabelleRigheEAN};
 

 
 
 
 
      



