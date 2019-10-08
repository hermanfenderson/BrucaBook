//Il reducer RESA considera che i dati sono quelli della bolla originaria. E non dovrebbe farli modificare... ma lascio vivi i controlli se voglio gestire eccezioni...

import FormReducer from '../helpers/formReducer'
import {LISTEN_BOLLE_PER_FORNITORE, 
		ADDED_BOLLE_PER_FORNITORE, 
		CHANGED_BOLLE_PER_FORNITORE , 
		DELETED_BOLLE_PER_FORNITORE,  
		INITIAL_LOAD_BOLLE_PER_FORNITORE,
		UNLISTEN_BOLLE_PER_FORNITORE, 
	   
		LISTEN_BOLLA_IN_RESA, 
		ADDED_RIGABOLLA_IN_RESA, 
		CHANGED_RIGABOLLA_IN_RESA , 
		DELETED_RIGABOLLA_IN_RESA,  
		INITIAL_LOAD_RIGABOLLA_IN_RESA,
		UNLISTEN_BOLLA_IN_RESA, 
		SET_ACTIVE_MODAL,
		SET_PERIOD_RESA,
		SET_MODAL_DETAILS
} from '../actions/resa';




import {isNotNegativeInteger} from '../helpers/validators';
import {errMgmt, initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper, isValidEditedItem,   insertRow, removeRow} from '../helpers/form';
import {calcHeaderFix, initCalcGeometry, calcFormColsFix, FORM_COL_H} from '../helpers/geometry';


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
				rigaBolla: null, //contiene solo id della riga...
	};


let geometryParams = {cal: {
						totaliWidth: 150,
						colSearchParams: [
										{name: 'ean', min: 120, max: 120},
										{name: 'titolo', min: 292},
										{name: 'editore', min: 212},
										{name: 'reset', min: 250, max: 290},
	
										],
					
						headerParams: [
									{name: 'values.riferimentoBolla', label: 'Rif.', min: 80, max: 80 },
					                {name: 'values.dataDocumentoBolla', label: 'Data', min: 160,max: 160},
									{name: 'values.ean', label: 'EAN', min: 160,max: 160},
					                {name: 'values.titolo', label: 'Titolo', min: 260,  ellipsis: true},
					                {name: 'values.prezzoListino', label: 'Listino', min: 60,max: 60},
								   
								    {name: 'values.prezzoUnitario', label: 'Prezzo', min: 60, max: 60},
								    {name: 'values.pezzi', label: 'Quantità', min: 60,max: 60},
								    {name: 'values.gratis', label: 'Gratis', min: 60,max: 60},
								    {name: 'values.prezzoTotale', label: 'Totale', min: 70,max: 70}
								   ],
						headerOpenParams: [
									{name: 'values.ean', label: 'EAN', min: 160,max: 160},
					                {name: 'values.titolo', label: 'Titolo', min: 310,  ellipsis: true},
					                {name: 'values.editore', label: 'Editore', min: 270,max: 270,  ellipsis: true},
					            
					                {name: 'values.prezzoListino', label: 'Listino', min: 90,max: 90},
								   
								    {name: 'values.stock', label: 'Stock*', min: 70,max: 70},
								    {name: 'values.resi', label: 'Resi', min: 70,max: 70},
								   ],
						},
				  tbc: [
				  	    {tableWidth: (cal) => {return(cal.w-cal.totaliWidth)}},
				  	    {tableHeight: (cal) =>  {return(cal.h - FORM_COL_H)}},
				  	    {totaliHeight: (cal) =>  {return(cal.h)}},
				  	      {formSearchWidth: (cal) =>  {return(cal.tableWidth)}},
				  	  
				  	   ],
				 geo: [ 
	
                        	{formSearchCoors: (cal) =>  {return({height: FORM_COL_H, width: cal.formSearchWidth, top: 0, left: cal.totaliWidth})}},
    					{formSearchCols: (cal) =>  {return(calcFormColsFix({colParams: cal.colSearchParams, width: cal.formSearchWidth, offset: 0}))}}, 
    				
     		    		{tableCoors: (cal) =>  {return({height: cal.tableHeight, width: cal.tableWidth, top: FORM_COL_H, left: cal.totaliWidth})}},
    				    
    		//Header ha tolleranza per barra di scorrimento in tabella e sel 
    					{header: (cal) =>  {return(calcHeaderFix({colParams: cal.headerParams, width: cal.tableWidth}))}},
    					{headerOpen: (cal) =>  {return(calcHeaderFix({colParams: cal.headerOpenParams, width: cal.tableWidth}))}},
    				
    					{totaliCoors: (cal) => {return({height: cal.totaliHeight, width: cal.totaliWidth, top: 0, left: 0})}},
    					]
				 }	
const calcGeometry = initCalcGeometry(geometryParams);
	
	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaResaValuesInitialState, {matrixEAN: {}, headerEAN: {}} ));
}

//Oggetto che contiene l'elenco dinamico delle bolle afferenti a un fornitore con il listener corrispondente.
//Formato dell'oggetto chiave = idBolla, destination = path della bolla
//Quando cambia qualcosa o quando svuoto l'oggetto devo anche smettere di ascoltare....

//bolleOsservate contiene tutte le bolle di quel fornitore
//Indice EAN contiene elenco di tutte le occorrenze di un EAN nelle varie bolle... formato {riga: bolla}


const initialState = () => {
    const eiis = editedItemInitialState();
	return initialStateHelper(eiis,{subTables: {}, geometry: calcGeometry(), listeningFornitore: null, bolleOsservate: {}, indiceBolleRese: {}, indiceEAN: {}, tabellaEAN: [], dettagliEAN: {}, estrattoStoricoMagazzino: {}, tabelleRigheEAN: {}, tabellaRighe: [], changedRigaBollaKeys: {}, changedRigaResaKeys: {}, activeModal: false, period: {anno: null, mese: null}, });
    }
    
//In input il nuovo campo... in output il nuovo editedRigaBolla
function transformAndValidateEditedRigaResa(cei, name, value)
{  	
	cei.errors = {};
	cei.errorMessages = {};
	cei.values[name] = value;
	cei.values.prezzoTotale = cei.values.prezzoUnitario * cei.values.pezzi;
	if (!(cei.values.prezzoTotale>0)) cei.values.prezzoTotale = 0;
	//Pezzi e gratis non possono essere che >=0
	errMgmt(cei, 'pezzi','notNegativeNumber','Numero (>=0)', !isNotNegativeInteger(cei.values.pezzi));
	errMgmt(cei, 'gratis','notNegativeNumber','Numero (>=0)', !isNotNegativeInteger(cei.values.gratis));
	//Pezzi e gratis non possono essere > del massimo ammesso
	errMgmt(cei, 'pezzi','lessThanMax','Pezzi deve essere minore di Max. pezzi (' + cei.values.maxRese + ')', cei.values.pezzi > cei.values.maxRese);
	errMgmt(cei, 'gratis','lessThanMax','Gratis deve essere minore di Max. gratis (' + cei.values.maxGratis + ')', cei.values.gratis > cei.values.maxGratis);
//  Elimino la regola dei pezzi gratis prima...
//	errMgmt(cei, 'pezzi','freeFirst','Rendi prima copie gratis (' + cei.values.maxGratis + ')', ((cei.values.gratis < cei.values.maxGratis) && (cei.values.pezzi > 0))); //Prima i pezzi gratis!
//	errMgmt(cei, 'gratis','freeFirst','Rendi prima copie gratis (' + cei.values.maxGratis + ')', ((cei.values.gratis < cei.values.maxGratis) && (cei.values.pezzi > 0))); //Prima i pezzi gratis!
	
	cei.isValid = isValidEditedItem(cei);

    return cei;
}

//Metodi reducer per le Form

const rigaResaR = new FormReducer({scene: 'RESA', 
								foundCompleteItem: null,
								transformItem: null, 
								transformSelectedItem: null, 
								initialState: initialState, 
								itemPrefix: 'values',
								keepOnSubmit: false, 
								calcGeometry: calcGeometry}); 


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
//Chiamata per una o piuù nuova rigaResa o una o più nuova rigaBolla
const newEANEntry = (newState, newData) => {
	 let tabelleRigheEAN = {...newState.tabelleRigheEAN};
	 let tabellaEAN = [...newState.tabellaEAN];
	let indiceEAN = {...newState.indiceEAN};
	let changed = false;		
	for (let i=0; i<newData.length; i++)
	{
		let values = newData[i][1];
		let ean = values.ean;
		
		//Se non c'e' EAN valorizzo la struttura dati che lo ospita...
		if (!indiceEAN[ean])
			{   changed = true;
			   	tabelleRigheEAN[ean] = [];
				let stock = (newState.estrattoStoricoMagazzino[ean]) ? newState.estrattoStoricoMagazzino[ean].pezzi : 0; //Se ho valorizzato lo storico magazzino...
			   
			    tabellaEAN.push({key: ean, values: {ean: values.ean, 
								titolo: values.titolo, 
								autore: values.autore, 
								editore: values.editore, 
								prezzoListino: values.prezzoListino,
								imgFirebaseUrl: values.imgFirebaseUrl,
								stock: stock,
							
								}});
								
				indiceEAN[ean] = {pos: tabellaEAN.length - 1, righe: {}};				
			}
	}
	if (changed) newState = {...newState, tabelleRigheEAN: tabelleRigheEAN, tabellaEAN: tabellaEAN, indiceEAN: indiceEAN}

	return(newState);
}

//Chiamata per una o piuù nuova rigaResa o una o più nuova rigaBolla... sono certo di trovare valorizzata correttamente la struttura
const addRighe = (newState, newData, type) => {
	 let tabelleRigheEAN = {...newState.tabelleRigheEAN};
	let indiceEAN = {...newState.indiceEAN};
    let itemsArray = {...newState.itemsArray};
    let tabellaEAN = [...newState.tabellaEAN];
	let idChanged = false;
	let itemChanged = false;
	let tabellaChanged = false; 
	for (let i=0; i<newData.length; i++)
	{
		let values = newData[i][1];
		let key = newData[i][0];
		let ean = values.ean;
		//Prendo l'id della bolla. Se e' una resa e non ho rigaBolla valorizzo con l'id della resa medesima...ma devo riconoscere che è orfano...
		let rigaBolla = (type==='bolle' || !newData[i][1].rigaBolla) ? newData[i][0] : newData[i][1].rigaBolla;
	    let orphan=false;
	    if (type==='rese'  && !newData[i][1].rigaBolla) orphan=true; 
		//A questo punto vedo se ho già quella rigaBolla...
		
		//Se non c'e' la rigaBolla valorizzo la struttura dati che lo ospita...questo nel caso del change non dovrebbe accadere
		if (!indiceEAN[ean].righe[rigaBolla])
			{   idChanged = true;
			    tabelleRigheEAN[ean].push({key: rigaBolla, values: {} }) //Creo lo spazio per i valori... se è orfano uso il valore stesso della riga resa...
			 	let newPos = tabelleRigheEAN[ean].length - 1; //Nuova posizione finale...
			 	indiceEAN[ean].righe[rigaBolla] = {pos: newPos};			
			}
	    let pos = indiceEAN[ean].righe[rigaBolla].pos;
		let idx = newState.itemsArrayIndex[rigaBolla];
		
		if (type==='bolle')
		{
		   //Aggiungo i valori nuovi o cambiati
		   tabelleRigheEAN[ean][pos].values = {...tabelleRigheEAN[ean][pos].values, 
													ean: values.ean,
													maxRese: values.pezzi,
													maxGratis: values.gratis,
													dataCarico: values.dataCarico,
													dataDocumentoBolla: values.dataDocumento,
													riferimentoBolla: values.riferimento,
													prezzoListino: values.prezzoListino, 
													prezzoUnitario: values.prezzoUnitario,
													sconto1: values.sconto1,
													sconto2: values.sconto2,
													sconto3: values.sconto3,
													manSconto: values.manSconto,
													idRigaBolla: values.idRigaBolla,
													rigaBolla: key,
													
													
													
		    								  }
		    tabelleRigheEAN[ean][pos].values.bolla = {...values}; //Una copia di tutto 								  
		    								  
		   //Se non ho una resa nella riga valorizzo il default a zero per pezzi e gratis.
		   if (!tabelleRigheEAN[ean][pos].values.pezzi) tabelleRigheEAN[ean][pos].values.pezzi = 0;
		   if (!tabelleRigheEAN[ean][pos].values.gratis) tabelleRigheEAN[ean][pos].values.gratis = 0;
		   //Vedo se posso agire su itemsArray
		   if (idx >=0)
			{
				itemChanged = true;
				itemsArray[idx].maxRese = values.pezzi;
				itemsArray[idx].maxGratis = values.gratis;
			}
		}	
	   if (type==='rese')
		{
		   //Aggiungo i valori nuovi o cambiati DEVO GESTIRE GLI ORFANI!
		   tabelleRigheEAN[ean][pos].values = {...tabelleRigheEAN[ean][pos].values, 
													pezzi: values.pezzi,
													gratis: values.gratis,
													key: key, //Consente di distinguere insert e update...
		   										}
		   //Se arrivano nuove rese ricalcolo il totale dei resi...
		   let resi = getTotaleResi(ean, newState.itemsArray);
		   
		   tabellaEAN[indiceEAN[ean].pos].values.resi = resi;
		   tabellaChanged = true; //Sto ricalcolando i totali...	   										
		   //Questa dovrebbe normalmente non andare a buon fine...
		   if ((idx >=0) && (tabelleRigheEAN[ean][pos].values.pezzi > 0 || tabelleRigheEAN[ean][pos].values.gratis > 0 ))
			{
				itemChanged = true;
				itemsArray[idx].maxRese = tabelleRigheEAN[ean][pos].values.pezzi;
				itemsArray[idx].maxGratis = tabelleRigheEAN[ean][pos].values.gratis;
				itemsArray[idx].key = key; //consente di distinguere insert e update...
			}
		}		
	}
	
	//Solo se l'indice è cambiato...
	if (idChanged) newState = {...newState, indiceEAN: indiceEAN}
    if (itemChanged) newState = {...newState, itemsArray: itemsArray}
	 if (tabellaChanged) newState = {...newState, tabellaEAN: tabellaEAN}

	newState = {...newState, tabelleRigheEAN: tabelleRigheEAN}

	return(newState);
}



//Chiamata per una riga cancellata...
const deleteRiga = (newState, key, type) => {
	 let tabelleRigheEAN = {...newState.tabelleRigheEAN};
	let indiceEAN = {...newState.indiceEAN};
    let itemsArray = {...newState.itemsArray};
    let tabellaEAN = [...newState.tabellaEAN];

	let idChanged = false;
	let itemChanged = false;
	let tabellaChanged = false;
	let changed = false; //TabelleRigheEAN
	let orfano = false;    
		
		
	   if (type==='rese')
		{
			//Caso facile. Devo porre a zero pezzi e gratis in tabella...e ricalcolare il totale delle rese...
	       	let idx = newState.itemsArrayIndex[key];
			//Se non c'è è successo qualcosa di strano e non faccio nulla...
			if (idx >= 0)
				{
				//Se non trovo rigaBolla è un orfano... e uso come chiave di rigaBolla la chiave stessa della rigaResa	
				let riga = itemsArray[idx];
				let rigaBolla = (riga.rigaBolla) ? riga.rigaBolla : key;
				let ean = riga.ean;
				orfano = (riga.rigaBolla) ? false : true; //decido se ho un orfano...
			    let pos = indiceEAN[ean].righe[rigaBolla].pos;
			    //Se non c'è è successo qualcosa di strano e non faccio nulla...
			    if (pos >=0)
			    	{   changed = true;
			    	    tabellaChanged = true;
			    	    
			    		tabelleRigheEAN[ean][pos].values.pezzi = 0;
			    		tabelleRigheEAN[ean][pos].values.gratis = 0;
			    		itemsArray.splice(idx,1); //adesso posso cancellare la riga cancellata e ricalcolare i resi...
			    		let resi = getTotaleResi(ean, itemsArray);
						tabellaEAN[indiceEAN[ean].pos].values.resi = resi;
		   
			    	}
		
				}
		}	
		
		if (type==='bolle' || orfano)
		{
		   let rigaBolla = key;
		   let pos = null;
		   let ean = null;
		   //Devo necessariamente spazzolare tutto indiceEAN...
		   let indiceEANMatrix = Object.entries(indiceEAN);
		   for (let i=0; i<indiceEANMatrix.length; i++)
				{
					if (indiceEANMatrix[i][1][rigaBolla])
						{   pos = indiceEANMatrix[i][1][rigaBolla].pos;
							ean = indiceEANMatrix[i][0];
							break;
						}
				}
		   //Se non l'ho trovato... mi fermo... c'e' qualcosa di strano...	
		   if (pos >=0 && ean)	
				{
				idChanged = true;
				changed = true;
				tabelleRigheEAN[ean].splice(pos,1);
				//Aggiorno gli indici di quell'EAN...
				delete indiceEAN[ean].righe[rigaBolla];
				for (let i=0; i<tabelleRigheEAN[ean].length; i++)
					{
						let key = tabelleRigheEAN[ean][i].key;
						indiceEAN[ean].righe[key].pos = i; //Rigenero l'indice...
					}
				}
				
		}	

		 
		
	
	//Solo se l'indice è cambiato...
	if (idChanged) newState = {...newState, indiceEAN: indiceEAN}
    if (tabellaChanged) newState = {...newState, tabellaEAN: tabellaEAN}

	if (changed) newState = {...newState, tabelleRigheEAN: tabelleRigheEAN}
	return(newState);
}

export default function resa(state = initialState(), action) {
  var newState;
  switch (action.type) {
    

    case rigaResaR.ADDED_ITEM:
    case rigaResaR.INITIAL_LOAD_ITEM:
    {	
    //Comportamento standard... 
	newState = rigaResaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaResa);
	//Creo una matrice di uno (caso ADDED_ITEM) o n valori (caso INTIAL_LOAD)
	let newData = [];
	if (action.payload.val())
		{
		if (action.type === rigaResaR.ADDED_ITEM)
			{
			let key = action.payload.key;
	   		let val = action.payload.val();
	   		newData.push([key, val]);
			}
		else newData = Object.entries(action.payload.val());	
		//Se EAN è del tutto nuovo creo la riga in indice, tabellaEAN e tabelleRigheEAN
		newState = newEANEntry(newState, newData);
		//Aggiungo righe distinguendo i casi resa e bolla...
		newState = addRighe(newState, newData, 'rese');
	    }
    }    
	break;    	 	

	case rigaResaR.CHANGED_ITEM:
	{	
	newState = rigaResaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaResa);
	let newData = [];
	let key = action.payload.key;
   	let val = action.payload.val();
   	newData.push([key, val]);
	newState = addRighe(newState, newData, 'rese');
	}
    break;    
    
	case rigaResaR.DELETED_ITEM:
	//Faccio prima la cancellazione non standard altrimenti non avrei i dati della riga...	
	newState = 	deleteRiga(state, action.payload.key, 'rese');
	newState = rigaResaR.updateState(newState,action,editedItemInitialState, transformAndValidateEditedRigaResa);
		 	

    break;    

    //ADDED_RIGABOLLA
    
    //Per ogni riga bolla potenzialmente potrei associare una riga resa...
    
    
    case INITIAL_LOAD_RIGABOLLA_IN_RESA: 
    case ADDED_RIGABOLLA_IN_RESA: 
    {	
    newState = state;	
    //Gestisco il caso di bolle vuote...
    if (action.payload.val())
    	{
	   	//Creo una matrice di uno (caso ADDED_ITEM) o n valori (caso INTIAL_LOAD)
		let newData = [];
		if (action.type === ADDED_RIGABOLLA_IN_RESA)
			{
			let key = action.payload.key;
	   		let val = action.payload.val();
	   		val.idRigaBolla = action.payload.ref.toString(); //prendo il path completo delle righe
	   		newData.push([key, val]);
			}
		else {
			  newData = Object.entries(action.payload.val());
			  for (let i=0; i<newData.length; i++) newData[i][1].idRigaBolla = action.payload.ref.toString() + '/' + newData[i][0]; //Prendo il path completo delle righe
			 } 
		//Se EAN è del tutto nuovo creo la riga in indice, tabellaEAN e tabelleRigheEAN
	    newState = newEANEntry(newState, newData);
	    newState = addRighe(newState, newData, 'bolle');
    	}
    }	
	
		
    break;
   	case CHANGED_RIGABOLLA_IN_RESA:
   	{
   	 newState = state;	
   	
   	let newData = [];
	let key = action.payload.key;
   	let val = action.payload.val();
   	val.idRigaBolla = action.payload.ref.toString(); //prendo il path completo delle righe
   	
   	newData.push([key, val]);

   	 newState = addRighe(newState, newData, 'bolle');
   	}
   	
        break;
     
        
   case DELETED_RIGABOLLA_IN_RESA:
  	    newState = 	deleteRiga(state, action.payload.key, 'bolle');
  	    break;  
  	    
 
  	    
   case UNLISTEN_BOLLE_PER_FORNITORE:
   	    newState = {...state, listeningFornitore : null};
   	    break;
   
   	case INITIAL_LOAD_BOLLE_PER_FORNITORE: 
		{
			let listaBolleArr = Object.entries(action.payload.val());
			let bolleOsservate = {...state.bolleOsservate};
			for (let i=0; i<listaBolleArr.length; i++)
				{
				let key = listaBolleArr[i][0];
				let val = listaBolleArr[i][1];
				bolleOsservate[key] = {...val};
				}
			newState = {...state, bolleOsservate : bolleOsservate};
   	
		}
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
   
   //Ascolto tutte le bolle collegate a un fornitore... 
   case LISTEN_BOLLE_PER_FORNITORE:
   	    newState = {...state, listeningFornitore : action.params};
   	    break;
  

   //Ascolto le bolle in resa aggiungendole a un elenco di bolle osservate...
   case LISTEN_BOLLA_IN_RESA:
   		{
   		let bolleOsservate = {...state.bolleOsservate};
   	    if (!bolleOsservate[action.params.split('/')[2]].righe) bolleOsservate[action.params.split('/')[2]].righe = {};
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
   //BACO DA SANARE...		
   case rigaResaR.CHANGE_EDITED_ITEM:
   	    {
   		let tabelleRigheEAN = {...state.tabelleRigheEAN};
   		let itemsArray = [...state.itemsArray];
   	    let itemsArrayIndex = state.itemsArrayIndex;
   	    let indiceEAN = state.indiceEAN;
   	    		
   	    if (action.stato=== 'aperta') 
   	    	{
   	    		 //Passo il punto della tabella in cui fare le modifiche...
   	    		 let cei = transformAndValidateEditedRigaResa(tabelleRigheEAN[action.row.values.ean][action.index], action.field, action.value);
   	    		 tabelleRigheEAN[action.row.values.ean][action.index] = {...cei};
   	    		 if (action.row.values.key)
   	    			{
   	    			let rigaResaKey = action.row.values.key;
   	    			let pos = itemsArrayIndex[rigaResaKey].pos;
   	    			itemsArray[pos] = {...cei};
   	    			itemsArray[pos].key = rigaResaKey;
   	    			}
   	    	}
   	    else 
   	    	{
   	    	   let cei = transformAndValidateEditedRigaResa(itemsArray[action.index], action.field, action.value);
   	    	   let pos = indiceEAN[action.row.values.ean].righe[action.row.values.rigaBolla].pos;
   	    	   tabelleRigheEAN[action.row.values.ean][pos] = {...cei};
   	    	}
   	     newState = {...state, tabelleRigheEAN: tabelleRigheEAN, itemsArray : itemsArray};
   	    }
   	    break;
   	    

     case SET_PERIOD_RESA:
     	newState =  {
     		...state,
     		period: action.period
     		}
     	   break;
     case SET_ACTIVE_MODAL: 
     	 newState = {
     	 	...state,
     	 	activeModal: action.activeModal
     	 }
     	 break;
     
     case SET_MODAL_DETAILS: 
     	 newState = {
     	 	...state,
     	 	matrixEAN: action.matrixEAN,
     	 	headerEAN: action.headerEAN
     	 }	 
     	  break;
     	  
     
      
      case rigaResaR.DATI_STORICO_MAGAZZINO:
       	{
       //I valori di stock vanno per default in estratto storico magazzino...		
       newState = rigaResaR.updateState(state,action,editedItemInitialState, transformAndValidateEditedRigaResa);
      //ma li metto anche nella tabella tabellaEAN... se per caso fosse arrivata questa info dopo...
       let tabellaEAN = [...newState.tabellaEAN];
       let indiceEAN = newState.indiceEAN;
       	  	 let allStocks = Object.values(action.values);
    	
    		 for (let i=0; i < allStocks.length; i++) 
    			{   let ean = allStocks[i].ean;
    			    let stock = allStocks[i].pezzi;
    			    
    				if (indiceEAN[ean]!==undefined) tabellaEAN[indiceEAN[ean].pos].values.stock = stock;
    			}
       newState = {...newState, tabellaEAN: tabellaEAN};
       			
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
 export const getActiveModal = (state) => {return state.activeModal};
 export const getPeriod = (state) => {return state.period};
 export const getMatrixEAN = (state) => {return state.matrixEAN};
  export const getHeaderEAN = (state) => {return state.headerEAN};

 export const getRigheResaIndexed = (state) => {
 	let righeResaIndexed = {}
 	for (var index in state.itemsArrayIndex)
 		{
 			righeResaIndexed[index] = {...state.itemsArray[state.itemsArrayIndex[index]].values};
 		}
 	return(righeResaIndexed);	
 }

export const getRigaBolla = (state) => {
 	
 	return(function getRigaBolla(ean,rigaBolla) {
 	  if (state.indiceEAN[ean])
 		{   let idx = state.indiceEAN[ean].righe[rigaBolla].pos;
 			if (idx >=0) return state.tabelleRigheEAN[ean][idx].values.bolla; //La copia che ho salvato...
 		}
 	  return null;	
 	});	
 }
 
 export const getTableScrollByKey = (state)  => {return state.tableScrollByKey};
 
 
      



