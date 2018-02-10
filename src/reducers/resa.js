//Il reducer RESA considera che i dati sono quelli della bolla originaria. E non dovrebbe farli modificare... ma lascio vivi i controlli se voglio gestire eccezioni...

import FormReducer from '../helpers/formReducer'
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


import {isNotNegativeInteger} from '../helpers/validators';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, isValidEditedItem,   insertRow, removeRow, getStock} from '../helpers/form';


const editedRigaResaValuesInitialState = 
	  {			ean: '',
				idRigaBolla: null, //Puntatore anno/mese/idBolla/rigaBolla
				titolo: '',
				autore: '',
				prezzoListino: '',
				prezzoUnitario: '',
				pezzi: 0,
				gratis: 0,
				prezzoTotale: '',
	};
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaResaValuesInitialState, {} ));
}

//Oggetto che contiene l'elenco dinamico delle bolle afferenti a un fornitore con il listener corrispondente.
//Formato dell'oggetto chiave = idBolla, destination = path della bolla
//Quando cambia qualcosa o quando svuoto l'oggetto devo anche smettere di ascoltare....

//bolleOsservate contiene tutte le bolle di quel fornitore
//Indice EAN contiene elenco di tutte le occorrenze di un EAN nelle varie bolle... formato {riga: bolla}


const initialState = () => {
    const eiis = editedItemInitialState();
	return initialStateHelper(eiis,{listeningFornitore: null, bolleOsservate: {}, indiceBolleRese: {}, indiceEAN: {}, tabellaEAN: [], dettagliEAN: {}, tabelleRigheEAN: {}, tabellaRighe: [], changedRigaBollaKeys: {}, changedRigaResaKeys: {}});
    }
    


//Metodi reducer per le Form
const rigaResaR = new FormReducer('RESA', null, null, null, initialState); 



//Data una rigaBolla e una rigaResa valorizza rigaResa col massimo di pezzi e gratis che posso rendere
const setMaxRese = (rigaBolla, rigaResa, destination) => 
{
	destination.maxRese = rigaBolla.pezzi;
	destination.maxGratis = rigaBolla.gratis;
	let rigaResaKey = rigaResa.key;
	for (var rigaKey in rigaBolla.rese)
		{
			if (rigaKey !== rigaResaKey) 
				{
				 destination.maxRese = destination.maxRese - rigaBolla.rese[rigaKey].pezzi;
				 destination.maxGratis = destination.maxGratis - rigaBolla.rese[rigaKey].gratis;
				}
		}
	
}

const getTotaleResi = (ean, righeResa) =>
{
	//Prendo tutte le righe con una resa che corrispondono a quell'EAN e le totalizzo...
	//Faccio prima a forza bruta!
	let totali = 0;
	for (var i in righeResa)
		{
			if (righeResa[i].values.ean === ean)
				{
					totali = totali + righeResa[i].values.pezzi + righeResa[i].values.gratis;
				}
		}
	return(totali);	
}

const updateTabelleEANFromChangedRigaResa = (row, indiceEAN, tabelleRigheEAN, tabellaEAN, itemsArray, indiceBolleRese) =>
{
			let ean = row.ean;
			let key = row.rigaBolla;
			let pezzi = parseInt(row.pezzi, 10) || 0;
   	    	let gratis = parseInt(row.gratis, 10) || 0;
		   	let pos = (indiceEAN[ean] && indiceEAN[ean].righe && indiceEAN[ean].righe[key].pos) ? indiceEAN[ean].righe[key].pos : null;
		 	if (pos) {
		 		tabelleRigheEAN[ean][pos].values.key = indiceBolleRese[key]; 
		 		tabelleRigheEAN[ean][pos].values.pezzi = pezzi; 
		 		tabelleRigheEAN[ean][pos].values.gratis = gratis;
		 			}
		 	//Aggiorno totali rese... se la riga esiste già... altrimenti aggiornerò al prossimo giro...
		 	if (indiceEAN[ean]) tabellaEAN[indiceEAN[ean].pos].values.resi = getTotaleResi(ean, itemsArray); //L'array per come sarà...
}

//Prendo in input lo stato e gestisco i tre casi di cambiamento di rigaresa (aggiungi, cancella, modifica). Torno stato modificato.
const manageChangedRigaResa = (state, action) =>
{
			let itemsArray = [...state.itemsArray];
			let itemsArrayIndex = {...state.itemsArrayIndex};
			let tabelleRigheEAN = {...state.tabelleRigheEAN};
   	        let indiceEAN = state.indiceEAN;
   	        let indiceBolleRese = {...state.indiceBolleRese};
   	        let tabellaEAN = [...state.tabellaEAN];
   	        let tabellaRighe = [...state.tabellaRighe];
   	        let idRigaResa = action.payload.key;
   	        let row = action.payload.val();
   	        let key = (row) ? row.rigaBolla : null;
   	        switch (action.type)
   	        	{
   	        	case 'ADDED_ITEM_RESA': 
   	        		insertRow(itemsArrayIndex, itemsArray, row, idRigaResa, 'pos', 'key');
   	        		tabellaRighe[itemsArrayIndex[idRigaResa].pos] = {};
   	        		tabellaRighe[itemsArrayIndex[idRigaResa].pos].values = {...row};
   	        		tabellaRighe[itemsArrayIndex[idRigaResa].pos].key = idRigaResa;
   	        		indiceBolleRese[key] = idRigaResa;
   	        		break;
   	        	case 'CHANGED_ITEM_RESA': 
   	        	    itemsArray[itemsArrayIndex[idRigaResa].pos].values = {...row};
   	        	    tabellaRighe[itemsArrayIndex[idRigaResa].pos].values = {...row};
   	        		break;
   	        	case 'DELETED_ITEM_RESA': 
   	        		row = {rigaBolla: itemsArray[itemsArrayIndex[idRigaResa].pos].values.rigaBolla, ean: itemsArray[itemsArrayIndex[idRigaResa].pos].values.ean}; //Riga finta... con solo EAN
   	        		tabellaRighe.splice(itemsArrayIndex[idRigaResa].pos, 1);
   	        		removeRow(itemsArrayIndex, itemsArray, idRigaResa, 'pos', 'key');
   	        		delete tabelleRigheEAN[row.ean][indiceEAN[row.ean].righe[key].pos].values.key;
   	        		delete indiceBolleRese[key];
   	        		break;
		 		default: break;
   	        	}
   	    	updateTabelleEANFromChangedRigaResa(row, indiceEAN, tabelleRigheEAN, tabellaEAN, itemsArray, indiceBolleRese);	 
			let newState = {...state, tabellaEAN: tabellaEAN, tabellaRighe: tabellaRighe, itemsArray: itemsArray, itemsArrayIndex: itemsArrayIndex, tabelleRigheEAN: tabelleRigheEAN, indiceBolleRese: indiceBolleRese};	
		 	return(newState);
}

//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaResa(cei, name, value)
{  	
	cei.errors = {};
	cei.errorMessages = {};
	cei.values[name] = value;
	cei.values.prezzoTotale = cei.values.prezzoUnitario * cei.values.pezzi;
	if (!cei.values.prezzoTotale>0) cei.values.prezzoTotale = 0;
	//Pezzi e gratis non possono essere che >=0
	errMgmt(cei, 'pezzi','notNegativeNumber','Numero (>=0)', !isNotNegativeInteger(cei.values.pezzi));
	errMgmt(cei, 'gratis','notNegativeNumber','Numero (>=0)', !isNotNegativeInteger(cei.values.gratis));
	//Pezzi e gratis non possono essere > del massimo ammesso
	errMgmt(cei, 'pezzi','lessThanMax','Pezzi deve essere minore di Max. pezzi (' + cei.values.maxRese + ')', cei.values.pezzi > cei.values.maxRese);
	errMgmt(cei, 'gratis','lessThanMax','Gratis deve essere minore di Max. gratis (' + cei.values.maxGratis + ')', cei.values.gratis > cei.values.maxGratis);
	errMgmt(cei, 'pezzi','freeFirst','Rendi prima copie gratis (' + cei.values.maxGratis + ')', ((cei.values.gratis < cei.values.maxGratis) && (cei.values.pezzi > 0))); //Prima i pezzi gratis!
	errMgmt(cei, 'gratis','freeFirst','Rendi prima copie gratis (' + cei.values.maxGratis + ')', ((cei.values.gratis < cei.values.maxGratis) && (cei.values.pezzi > 0))); //Prima i pezzi gratis!
	
	cei.isValid = isValidEditedItem(cei);

    return cei;
}



export default function resa(state = initialState(), action) {
  var newState;
  switch (action.type) {
    

   //Ascolto tutte le bolle collegate a un fornitore... 
   case LISTEN_BOLLE_PER_FORNITORE:
   	    newState = {...state, listeningFornitore : action.params};
   	    break;
   	    
   //Ascolto i dettagli per un singolo EAN	    
   case LISTEN_DETTAGLI_EAN:
   	    newState = state;
   	    break;
   //Cesso di sentire i dettagli di un singolo EAN	    
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
   	    	 tabellaEAN[indiceEAN[ean].pos].values.stock = getStock(details, null, null, state.testata.dataScarico -1); 
   	    	 newState = {...state, dettagliEAN: dettagliEAN, tabellaEAN: tabellaEAN};
   	    	}
   	    else newState = {...state, dettagliEAN: dettagliEAN}	
   	    }
   	    break;
   
   //Ascolto le bolle in resa aggiungendole a un elenco di bolle osservate...
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
   		let indiceEAN = {...state.indiceEAN};
   		let tabellaEAN = [...state.tabellaEAN];
   		
   		let tabelleRigheEAN = {...state.tabelleRigheEAN};
   		
   		for (var riga in bolleOsservate[action.params.split('/')[2]].righe)
   			{
   				let rigaBollaKey = action.params.split('/')[2] + '/' + riga;
   				let ean = bolleOsservate[action.params.split('/')[2]].righe[riga].ean;
   				removeRow(indiceEAN[ean].righe, tabelleRigheEAN[ean], rigaBollaKey,'pos','rigaBolla');
   	    		delete indiceEAN[ean].righe[rigaBollaKey];
   	    		 if (Object.keys(indiceEAN[ean].righe).length === 0) 
   	    			{   removeRow(indiceEAN, tabellaEAN, ean, 'pos','ean');
   	    				delete indiceEAN[ean];
   	    			}
   	   
   				}
   		delete bolleOsservate[action.params.split('/')[2]];
   	 newState = {...state, bolleOsservate: bolleOsservate, tabellaEAN: tabellaEAN, indiceEAN: indiceEAN, tabelleRigheEAN: tabelleRigheEAN};	
  	   		
   		}
   		break;	

    //ADDED_RIGABOLLA
    
    //Per ogni riga bolla potenzialmente potrei associare una riga resa...
    
    
    
   
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
   	     //Ne copio i contenuti in bolleOsservate...
        bolleOsservate[bolla].righe[riga] = row;
   	    let ean =  action.payload.val().ean;
   	    let indiceEAN = {...state.indiceEAN};
   	    let tabellaEAN = [...state.tabellaEAN];
   	    let tabelleRigheEAN = {...state.tabelleRigheEAN};
   	    let dettagliEAN = state.dettagliEAN;
   	    //Creazione della testata EAN...
   	    if (!indiceEAN[ean]) 
   	    	{indiceEAN[ean] = {};
   	    	 //tabellaEAN[key] = ean;
   	    	insertRow(indiceEAN, tabellaEAN, {ean: ean, titolo: row.titolo, autore: row.autore, prezzoListino: row.prezzoListino, stock: getStock(dettagliEAN[ean], null,null, state.testata.dataScarico - 1), resi: 0}, ean, 'pos', 'ean');
   	    	}
   	    if (!indiceEAN[ean].righe) indiceEAN[ean].righe = {};
   	    let rigaBollaKey = bolla+'/'+riga;
   	    if (!indiceEAN[ean].righe[rigaBollaKey]) indiceEAN[ean].righe[rigaBollaKey] = {'pos': -1}; //Non è in mostra...
   	   	 
   	     if (!tabelleRigheEAN[ean]) tabelleRigheEAN[ean] = [];
   	     
				
   	     let rigaBolla = {'ean': ean, 
   	    				  'rigaBolla': rigaBollaKey, 
   	    				  'idRigaBolla': idRigaBolla, 
   	    				  'riferimentoBolla': row.riferimento, 
   	    				  'dataDocumentoBolla': row.dataDocumento, 
   	    				  'prezzoUnitario': row.prezzoUnitario,
   	     	               'titolo': row.titolo,
   	     	               'autore': row.autore,
   	     	               'prezzoListino': row.prezzoListino,
   	     	               'pezzi': row.pezzi,
   	     	               'gratis': row.gratis,
   	     	               'rese': row.rese
   	     	               	}
   	     let itemsArrayIndex = state.itemsArrayIndex; //Non devo modificarle!
   	     let itemsArray = state.itemsArray;
   	     let indiceBolleRese = state.indiceBolleRese;
   	     let rigaResa = {pezzi: 0, gratis: 0}; //Oggetto inizialmente vuoto
   	     
   	     if (indiceBolleRese[rigaBollaKey])  //Se ho giè una riga resa collegata a questa riga bolla
   	    	{
   	    		rigaResa = {...itemsArray[itemsArrayIndex[indiceBolleRese[rigaBollaKey]].pos].values};
   	    		tabellaEAN[indiceEAN[ean].pos].values.resi = getTotaleResi(ean, itemsArray); //Aggiorno i totali...
		 	    rigaResa.key = indiceBolleRese[rigaBollaKey];
   	    		//Se ho elementi a blank... li valorizzo
   	    	}
   	     setMaxRese(rigaBolla, rigaResa, rigaResa ); //Calcolo quante rese posso fare... se non ho nessuna resa in memoria le prendo tutte...
         
   	     let blendedRiga = {...rigaBolla, ...rigaResa}; //Prevalenza di resa su bolla...
   	     if (action.type === ADDED_RIGABOLLA_IN_RESA) insertRow(indiceEAN[ean].righe, tabelleRigheEAN[ean], blendedRiga, rigaBollaKey, 'pos', 'rigaBolla' );
   	     else 
   	    	{   let pos = indiceEAN[ean].righe[rigaBollaKey].pos;
   	    		tabelleRigheEAN[ean][pos].values = {...tabelleRigheEAN[ean][pos].values, ...blendedRiga}; //Prevalenza di rigaresa su rigabolla!
   	    	}
   	    newState = {...state, bolleOsservate: bolleOsservate, indiceEAN: indiceEAN, tabellaEAN: tabellaEAN, tabelleRigheEAN: tabelleRigheEAN};
   		}
        break;
        
   case DELETED_RIGABOLLA_IN_RESA:
  	    {
  	    let bolla = action.payload.ref.path.pieces_[5];
   		let riga = action.payload.ref.path.pieces_[6];
   		let rigaBollaKey = bolla+'/'+riga;
   	    
   	    let bolleOsservate = {...state.bolleOsservate};
   	    let indiceEAN = {...state.indiceEAN};
   	    let ean = bolleOsservate[bolla].righe[riga].ean;
   	    let tabellaEAN = [...state.tabellaEAN];
   	     let tabelleRigheEAN = {...state.tabelleRigheEAN};
   	   
   	    delete bolleOsservate[bolla].righe[riga];
   	    removeRow(indiceEAN[ean].righe, tabelleRigheEAN[ean], rigaBollaKey,'pos','rigaBolla');
   	    delete indiceEAN[ean].righe[rigaBollaKey];
   	   if (Object.keys(indiceEAN[ean].righe).length === 0) 
   	    	{   removeRow(indiceEAN, tabellaEAN, ean, 'pos','ean');
   	    		delete indiceEAN[ean];
   	    	}
   	    newState = {...state, tabellaEAN: tabellaEAN, indiceEAN: indiceEAN, tabelleRigheEAN: tabelleRigheEAN};	
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
   case rigaResaR.CHANGE_EDITED_ITEM:
   	    {
   		let tabelleRigheEAN = {...state.tabelleRigheEAN};
   		let tabellaRighe = [...state.tabellaRighe];
   	    let itemsArrayIndex = state.itemsArrayIndex;
   	    let indiceEAN = state.indiceEAN;
   	    		
   	    if (action.ean) 
   	    	{
   	    		 //Passo il punto della tabella in cui fare le modifiche...
   	    		 let cei = transformAndValidateEditedRigaResa(tabelleRigheEAN[action.ean][action.index], action.field, action.value);
   	    		 
   	    		 if (action.row.values.key)
   	    			{
   	    			let rigaResaKey = action.row.values.key;
   	    			let pos = itemsArrayIndex[rigaResaKey].pos;
   	    			tabellaRighe[pos] = {...cei};
   	    			tabellaRighe[pos].key = rigaResaKey;
   	    			}
   	    	}
   	    else 
   	    	{
   	    	   let cei = transformAndValidateEditedRigaResa(tabellaRighe[action.index], action.field, action.value);
   	    	   let pos = indiceEAN[action.row.values.ean].righe[action.row.values.rigaBolla].pos;
   	    	   tabelleRigheEAN[action.row.values.ean][pos] = {...cei};
   	    	}
   	     newState = {...state, tabelleRigheEAN: tabelleRigheEAN, tabellaRighe : tabellaRighe};
   	    }
   	    break;
   	    
	case rigaResaR.ADDED_ITEM:
	case rigaResaR.DELETED_ITEM:
	case rigaResaR.CHANGED_ITEM:
		    newState = manageChangedRigaResa(state, action);
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
 export const getTabellaRighe = (state) => {return state.tabellaRighe};
 
 export const getRigheResaIndexed = (state) => {
 	let righeResaIndexed = {}
 	for (var index in state.itemsArrayIndex)
 		{
 			righeResaIndexed[index] = {...state.itemsArray[state.itemsArrayIndex[index].pos].values};
 		}
 	return(righeResaIndexed);	
 }
 
 
 
      



