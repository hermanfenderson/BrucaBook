//Funzioni di supporto per gestire WrappedForms
//Le scenes che usano wrapped forms persistono nel loro pezzo di stato e quindi nel loro reducer  
//Introduco qui anche la gestione dello stato dell'EAN se il form non ha l'EAN... viene ignorato.

import {isPositiveInteger, isValidBookCode} from './validators';
import {isValidEAN} from './ean';
import {isComplete} from './catalog';
import moment from 'moment';
import {store} from '../';


export const editedItemInitialState = (editedItemValuesInitialState, initOverrides) =>
{
	return {
		 values:{...editedItemValuesInitialState},
		 errors:{}, 
		 errorMessages:{}, 
		 isValid:false, 
		 selectedItem:null, 
		 loading:false, 
		 readOnlyForm: false,
		 willFocus: 'ean', 
		 eanState: 'BLANK',
		 ...initOverrides
	}
}

export const initialState = (editedItemInitialState, extraInitialState) =>
{   const initOverrides = {...extraInitialState};
	return {
			itemsArray: [],
			itemsArrayIndex: {},
		    tableScroll: false,
			tableHeight:0,
			listeningItem: null,
			messageBuffer: [],
			 filters: {},
		
			editedItem: editedItemInitialState,
			...initOverrides
	    	}
	
}

//Passo il pezzo di stato e copio deep anzichè shallow per sicurezza
export const editedItemCopy = (editedItem) => {
	let copiedEditedItemValues = {...editedItem.values};
	let copiedEditedItem = {...editedItem, values: copiedEditedItemValues};
	return (copiedEditedItem);
}



//funzione di cortesia... aggiunge un errore a un array all'interno della chiave name
//cei = changed edited item
export function errMgmt(cei, name,error,message, errorCondition, errorMessageCondition = errorCondition)
{  
	if (errorCondition === true) 
	    {
	    
	    if (!cei.errors) cei.errors = {};
	    if (!(name in cei.errors)) cei.errors[name] = {};
		cei.errors[name][error] = message;
	    }
	else 
		{
		if (cei.errors && name in cei.errors) delete cei.errors[name][error];
		 if (cei.errors && cei.errors[name] && Object.keys(cei.errors[name]).length === 0) delete cei.errors[name];
		}
	if (errorMessageCondition === true) {if (!cei.errorMessages) cei.errorMessages = {}; cei.errorMessages[name] = message;}
}

export function showError(cei,name)
{
		if (name in cei.errors) cei.errorMessages[name] = cei.errors[name][Object.keys(cei.errors[name])[0]]; 
	
}

export function showAllErrors(cei)
{
	for (var key in cei.errors) showError(cei,key);
}

export function noErrors(cei, name)
{
	if (name in cei.errors) delete cei.errors[name];
	if (name in cei.errorMessages) delete cei.errorMessages[name];	
}

export function isValidEditedItem(editedItem) {
	return (((!editedItem.errors) || (Object.keys(editedItem.errors).length === 0)) && (!editedItem.loading))
}


//Aggiorma EAN state... se non lo passo esplicitamente lo valuto.
/*Gli stati sono 
BLANK 
CODE (numero da 1 a 8)
NAN (mon un numero)
FILL (numero da 9 a 12)
VALID (numero da 13 EAN valido)
INVALID (numero da 13 EAN non valido)
TOOLONG (numero > 13)
PARTIAL (ricerca non completa... devo riempire a mano... un not found definitivo è comunque "non completa")
Lo stato PARTIAL NON viene mai triggerato qui... lo passa una funzione esterna.
COMPLETE (ricerca completa)
*/

export function eanState(cei, newState=null)
{    const ean = cei.values.ean;
     let eanState = cei.eanState;
     if (newState) cei.eanState = newState;
      else 
    	{
	     if (ean.length === 0) eanState = 'BLANK';
	     else if (!isPositiveInteger(ean)) eanState = 'NAN';
	     else if (isValidBookCode(ean)) eanState = 'CODE';
	     else if (ean.length < 13) eanState = 'FILL';
	     else if (ean.length > 13) eanState = 'TOOLONG';
	     else if (!isValidEAN(ean)) eanState = 'INVALID';
	     else eanState = 'VALID';
    	}
	     if (eanState === 'VALID' && isComplete(cei.values)) eanState = 'COMPLETE'; //Come detto... PARTIAL viene gestito esternamente...

    cei.eanState = eanState;	

	return(cei);
}


export function updateEANErrors(cerb)
{
		switch (cerb.eanState)
			{
				case 'BLANK':
					errMgmt(cerb, 'ean','invalidBookCode','EAN è un numero',true,false);
				break;
				case 'NAN':
					errMgmt(cerb, 'ean','invalidBookCode','EAN è un numero',true,true);
				break;
				case 'TOOLONG':
					errMgmt(cerb, 'ean','tooLongBookCode','Codice troppo lungo',  true, true);
				break;	
				case 'CODE':
				case 'FILL':	
					errMgmt(cerb, 'ean','invalidEAN','EAN non valido',  true, false);
				break;
				case 'INVALID':
				    errMgmt(cerb, 'ean','invalidEAN','EAN non valido',  true, true);
				break;    
				default:
				break;
			}
}

export function date2period(data)
{
	const anno=moment(data, "DD/MM/YYYY").format("YYYY");
	const mese=moment(data, "DD/MM/YYYY").format("MM");
	return ({anno: anno, mese: mese})
}

export function moment2period(momento)
{
	const anno=momento.format("YYYY");
	const mese=momento.format("MM");
	return ([anno, mese])
}



export function period2month(period)
{
	return (period[0]+'/'+period[1]);
	
}

export function period2moment(period)
{
	return (moment(period2month(period),'YYYY/MM'));
}


export function isEqual(value, other) {

    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    var compare = function (item1, item2) {

        // Get the object type
        var itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {

            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }
    };

    // Compare properties
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;

};

//Serve a generare una lista per selettori
export const objSelector = (obj, field) =>
{   let selector = {};
	for (var propt in obj) selector[propt] = obj[propt][field];
	return(selector);
}

export const nomeFornitoreById = (id) =>
{
	return(store.getState().status.localMasterData.fornitori[id].nome); //Sporchissima ma me ne fotto!

}


//Metodi per inserire in un array sulla base di un indice... e rimuovere...
//L'array ha un sotto-oggetto... valori per avere anche errors e riportarsi al caso noto della gestione delle righe...
export const insertRow = (index, array, row, key, posField, keyField, afterKey) =>
{
if (afterKey) 
	{
	if (!index[afterKey]) index[afterKey] = {};	
	let afterPos = index[afterKey][posField];
	array.splice(afterPos+1,0,{values: row});
	for (let i = afterPos+1; i < array.length; i++) index[array[i][keyField]][posField] = i;	
	}
else
	{
	let newPos = array.length;
	if (!index[key]) index[key] = {};	
	index[key][posField] = newPos;
	array.push({key: key, values: row});
	}
}

export const removeRow = (index, array, key, posField, keyField) => 
{
		

	let pos = index[key][posField];
	array.splice(pos,1);
	for (let i = pos + 1; i < array.length; i++) 
		if (array[i].values[keyField]>=0 && index[array[i].values[keyField]]) index[array[i].values[keyField]][posField] = i;
	delete index[key];
}

//data una lista di dettagli di un EAN calcola i pezzi a stock... saltando se necessario il documento corrente, eventualmente fino a una data
export const getStock = (details, excludedDoc=null, fromDate=null, toDate=null) =>
{      			 
				  var totalePezzi = 0;
        		  var righe;
            	  let date = details;	
            	  for(var propt2 in date)
		  			{
		  			if ((!fromDate || propt2 >= fromDate) && (!toDate || propt2 <=toDate))
		  			  {
		  			  righe = date[propt2];
		  				for (var propt in righe)	
		  				{
		  				 if (righe[propt].tipo === "bolla")
		  					{
			    			totalePezzi = parseInt(righe[propt].pezzi,10) + parseInt(righe[propt].gratis,10)+ totalePezzi;
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}
					    if (righe[propt].tipo === "resa")
		  					{
			    			totalePezzi = totalePezzi - (parseInt(righe[propt].pezzi,10) + parseInt(righe[propt].gratis,10));
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}	
						if (righe[propt].tipo === "scontrino")
		  					{
		  					totalePezzi = totalePezzi - parseInt(righe[propt].pezzi,10);
			    		
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}
							
						if (righe[propt].tipo === "inventario")
		  					{
		  					totalePezzi = totalePezzi + parseInt(righe[propt].pezzi,10);
			    		
			    			}		
		  				}
		  			  }	
		  			}	
		  		   return totalePezzi;  
}


export const getDetailsInMatrix = (details) =>
{
	//Creo una matrice con i dati anno per anno e mese per mese...
	//Stock, deltaStock, bolla, resa, scontrino, inventario...
	const copyDetails = (matrix, dataIn, key, row) =>
	{
		let data = (moment(parseInt(dataIn,10)));
		let anno = data.format('YYYY');
		let mese = data.format('MM');
		let giorno = data.format('DD');
		if (!matrix.totale.righe[dataIn])
			{
			matrix.totale.righe[dataIn] = {};
			matrix.anno[anno].righe[dataIn] = {};
			matrix.anno[anno].mese[mese].righe[dataIn] = {};
			matrix.anno[anno].mese[mese].giorno[giorno].righe[dataIn] = {};
			}
		matrix.totale['righe'][dataIn][key] = row;	
		matrix.anno[anno]['righe'][dataIn][key] = row;
		matrix.anno[anno].mese[mese]['righe'][dataIn][key] = row;
		matrix.anno[anno].mese[mese].giorno[giorno]['righe'][dataIn][key] = row;
		
	}
	
	const updateCell = (matrix, dataIn, tipo, value) =>
		{ 
		let data = (moment(parseInt(dataIn,10)));
		let anno = data.format('YYYY');
		  let mese = data.format('MM');
		  let giorno = data.format('DD');
			if (!matrix.anno[anno]) 
				{
				 matrix.anno[anno] = {righe: {}, totali: {}, mese: {}};
				 matrix.anno[anno]['totali']['bolla'] = 0;
				 matrix.anno[anno]['totali']['resa'] = 0;
				 matrix.anno[anno]['totali']['scontrino'] = 0;
				 matrix.anno[anno]['totali']['inventario'] = 0;
				 matrix.anno[anno]['totali']['delta'] = 0;
				 matrix.anno[anno]['totali']['stock'] = 0;
				 
				}
			if (!matrix.anno[anno].mese[mese]) 
				{
				 matrix.anno[anno].mese[mese] = {righe: {}, totali: {}, giorno: {}};
				  
				 matrix.anno[anno].mese[mese]['totali']['bolla'] = 0;
				 matrix.anno[anno].mese[mese]['totali']['resa'] = 0;
				 matrix.anno[anno].mese[mese]['totali']['scontrino'] = 0;
				 matrix.anno[anno].mese[mese]['totali']['inventario'] = 0;
				  matrix.anno[anno].mese[mese]['totali']['delta'] = 0;
				 matrix.anno[anno].mese[mese]['totali']['stock'] = 0;
				
				}	
				if (!matrix.anno[anno].mese[mese].giorno[giorno]) 
				{
				 matrix.anno[anno].mese[mese].giorno[giorno] = {righe: {}, totali: {}};
				
				 matrix.anno[anno].mese[mese].giorno[giorno]['totali']['bolla'] = 0;
				 matrix.anno[anno].mese[mese].giorno[giorno]['totali']['resa'] = 0;
				 matrix.anno[anno].mese[mese].giorno[giorno]['totali']['scontrino'] = 0;
				 matrix.anno[anno].mese[mese].giorno[giorno]['totali']['inventario'] = 0;
				  matrix.anno[anno].mese[mese].giorno[giorno]['totali']['delta'] = 0;
				 matrix.anno[anno].mese[mese].giorno[giorno]['totali']['stock'] = 0;
				}		
			matrix.totale.totali[tipo] += value;
			matrix.totale.totali.stock += value;
			
			matrix.anno[anno]['totali'][tipo] += value;
			matrix.anno[anno].mese[mese]['totali'][tipo] += value;
			matrix.anno[anno].mese[mese].giorno[giorno]['totali'][tipo] += value;
			matrix.anno[anno]['totali'].delta += value;
			matrix.anno[anno].mese[mese]['totali'].delta += value;
			matrix.anno[anno].mese[mese].giorno[giorno]['totali'].delta += value;
			matrix.anno[anno]['totali'].stock = matrix.totale.totali.stock;
			matrix.anno[anno].mese[mese]['totali'].stock = matrix.totale.totali.stock;
			matrix.anno[anno].mese[mese].giorno[giorno]['totali'].stock = matrix.totale.totali.stock;
		}
		
	let matrix = {anno: {}, totale: {righe: {}, totali: {bolla: 0, resa: 0, scontrino: 0, inventario: 0, stock: 0}}};
	 let date = details;	
            	  for(var propt2 in date)
		  			{
		  			  let righe = date[propt2];
		  				for (var propt in righe)	
		  				{
		  				let totalePezzi = 0;
		  				 if (righe[propt].tipo === "bolla")
		  					{
			    			totalePezzi = parseInt(righe[propt].pezzi,10) + parseInt(righe[propt].gratis,10);
			    			
			    			}
					    if (righe[propt].tipo === "resa")
		  					{
		  						
			    			totalePezzi =  - (parseInt(righe[propt].pezzi,10) + parseInt(righe[propt].gratis,10));
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}	
						if (righe[propt].tipo === "scontrino")
		  					{
		  					totalePezzi =  - parseInt(righe[propt].pezzi,10);
			    		
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}
							
						if (righe[propt].tipo === "inventario")
		  					{
		  					totalePezzi = parseInt(righe[propt].pezzi,10);
			    			}		
			    		updateCell(matrix,propt2,righe[propt].tipo, totalePezzi);	
			    		copyDetails(matrix,propt2, propt, righe[propt]);
		  				}
		  			}	
   return matrix;		  			
}

export const setDay = (moment) =>
{
	return(moment.startOf('day').add(12,'hours').valueOf());
}




