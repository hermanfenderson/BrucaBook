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
		    tableScrollByKey: null,
			tableHeight:0,
			listeningItem: null,
			messageBuffer: [],
			 filters: {},
		    totali: {},
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
		  				 if (righe[propt].tipo === "bolle")
		  					{
			    			totalePezzi = parseInt(righe[propt].pezzi,10) + parseInt(righe[propt].gratis,10)+ totalePezzi;
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}
					    if (righe[propt].tipo === "rese")
		  					{
			    			totalePezzi = totalePezzi - (parseInt(righe[propt].pezzi,10) + parseInt(righe[propt].gratis,10));
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}	
						if (righe[propt].tipo === "scontrini")
		  					{
		  					totalePezzi = totalePezzi - parseInt(righe[propt].pezzi,10);
			    		
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}
							
						if (righe[propt].tipo === "inventari")
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
				 matrix.anno[anno]['totali']['bolle'] = 0;
				 matrix.anno[anno]['totali']['rese'] = 0;
				 matrix.anno[anno]['totali']['scontrini'] = 0;
				 matrix.anno[anno]['totali']['inventari'] = 0;
				 matrix.anno[anno]['totali']['delta'] = 0;
				 matrix.anno[anno]['totali']['stock'] = 0;
				 
				}
			if (!matrix.anno[anno].mese[mese]) 
				{
				 matrix.anno[anno].mese[mese] = {righe: {}, totali: {}, giorno: {}};
				  
				 matrix.anno[anno].mese[mese]['totali']['bolle'] = 0;
				 matrix.anno[anno].mese[mese]['totali']['rese'] = 0;
				 matrix.anno[anno].mese[mese]['totali']['scontrini'] = 0;
				 matrix.anno[anno].mese[mese]['totali']['inventari'] = 0;
				  matrix.anno[anno].mese[mese]['totali']['delta'] = 0;
				 matrix.anno[anno].mese[mese]['totali']['stock'] = 0;
				
				}	
				if (!matrix.anno[anno].mese[mese].giorno[giorno]) 
				{
				 matrix.anno[anno].mese[mese].giorno[giorno] = {righe: {}, totali: {}};
				
				 matrix.anno[anno].mese[mese].giorno[giorno]['totali']['bolle'] = 0;
				 matrix.anno[anno].mese[mese].giorno[giorno]['totali']['rese'] = 0;
				 matrix.anno[anno].mese[mese].giorno[giorno]['totali']['scontrini'] = 0;
				 matrix.anno[anno].mese[mese].giorno[giorno]['totali']['inventari'] = 0;
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
		
	let matrix = {anno: {}, totale: {righe: {}, totali: {bolle: 0, rese: 0, scontrini: 0, inventari: 0, stock: 0}}};
	 let date = details;	
            	  for(var propt2 in date)
		  			{
		  			  let righe = date[propt2];
		  				for (var propt in righe)	
		  				{
		  				let totalePezzi = 0;
		  				 if (righe[propt].tipo === "bolle")
		  					{
			    			totalePezzi = parseInt(righe[propt].pezzi,10) + parseInt(righe[propt].gratis,10);
			    			
			    			}
					    if (righe[propt].tipo === "rese")
		  					{
		  						
			    			totalePezzi =  - (parseInt(righe[propt].pezzi,10) + parseInt(righe[propt].gratis,10));
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}	
						if (righe[propt].tipo === "scontrini")
		  					{
		  					totalePezzi =  - parseInt(righe[propt].pezzi,10);
			    		
			    			//parseFloat(righe[propt].prezzoTotale) + parseFloat(totaleImporto);
							}
							
						if (righe[propt].tipo === "inventari")
		  					{
		  					totalePezzi = parseInt(righe[propt].pezzi,10);
			    			}		
			    		updateCell(matrix,propt2,righe[propt].tipo, totalePezzi);	
			    		copyDetails(matrix,propt2, propt, righe[propt]);
		  				}
		  			}	
   return matrix;		  			
}

export const getMatrixVenditeFromRegistroData = (registroData, today=setDay(moment())) =>
{
	//Creo una matrice con i dati anno per anno e mese per mese...
	//Stock, deltaStock, bolla, resa, scontrino, inventario...
	const isYTD = (date, today) =>
	{
	//Vero se sto in un mese precedente o nel medesimo mese in un giorno precedente
	let dateMmt = moment(parseInt(date,10));
	let todayMmt = moment(parseInt(today,10)); 
	
    let meseIn = dateMmt.format('MM');
    let mese = todayMmt.format('MM');
    let giornoIn = dateMmt.format('DD');
    let giorno = todayMmt.format('DD');
    let ytd = ((meseIn < mese) || ((meseIn === mese) && (giornoIn < giorno)));
	return (ytd);
	}
	
   	const updateCellSublevel = (submatrix, period, details, ytd) =>
	{
		if (!submatrix[period])  submatrix[period] = {ean: {}, 
													  totalePezzi: 0, 
													  ricavoTotale: parseFloat(0.0), 
													  listinoTotale: parseFloat(0.0),
													  totalePezziYTD: 0, 
													  ricavoTotaleYTD: parseFloat(0.0), 
													  listinoTotaleYTD: parseFloat(0.0),
													  totalePezziDTY: 0, 
													  ricavoTotaleDTY: parseFloat(0.0), 
													  listinoTotaleDTY: parseFloat(0.0),
													 };
													 
		submatrix[period].totalePezzi += details.totalePezzi;
		submatrix[period].ricavoTotale += details.ricavoTotale;
		submatrix[period].listinoTotale += details.listinoTotale;
		if (ytd)
			{
			submatrix[period].totalePezziYTD += details.totalePezzi;
			submatrix[period].ricavoTotaleYTD += details.ricavoTotale;
			submatrix[period].listinoTotaleYTD += details.listinoTotale;
			}
		else 
			{
			submatrix[period].totalePezziDTY += details.totalePezzi;
			submatrix[period].ricavoTotaleDTY += details.ricavoTotale;
			submatrix[period].listinoTotaleDTY += details.listinoTotale;
			}
		if (!submatrix[period].ean[details.ean]) submatrix[period].ean[details.ean] = {totalePezzi: 0, 
													  ricavoTotale: parseFloat(0.0), 
													  listinoTotale: parseFloat(0.0)};
			submatrix[period].ean[details.ean].titolo = details.titolo;
			submatrix[period].ean[details.ean].autore = details.autore;
			submatrix[period].ean[details.ean].editore = details.editore;
			submatrix[period].ean[details.ean].imgFirebaseUrl = details.imgFirebaseUrl;
		
			submatrix[period].ean[details.ean].ean = details.ean;
			submatrix[period].ean[details.ean].totalePezzi += details.totalePezzi;
			submatrix[period].ean[details.ean].ricavoTotale += details.ricavoTotale;
			submatrix[period].ean[details.ean].listinoTotale += details.listinoTotale;
	
	}
	
	const updateCell = (matrix, dataIn, details, ytd) =>
		{ 
	 	let data = (moment(parseInt(dataIn,10)));
		let anno = data.format('YYYY');
		  let mese = data.format('MM');
		  let giorno = data.format('DD');
		   updateCellSublevel(matrix.anno, anno, details, ytd);
		   if (!matrix.anno[anno].mese) matrix.anno[anno].mese = {};
		   updateCellSublevel(matrix.anno[anno].mese, mese, details, ytd);
		   if (!matrix.anno[anno].mese[mese].giorno) matrix.anno[anno].mese[mese].giorno = {};
		   updateCellSublevel(matrix.anno[anno].mese[mese].giorno, giorno, details, ytd);
		 }
		
	let matrix = {anno: {}, totale: {ean: {}, totalePezzi: 0, ricavoTotale: parseFloat(0.0), listinoTotale: parseFloat(0.0) }};
	 
	 let date = registroData;	
            	  for(var propt2 in date)
		  			{
		  			  let righe = date[propt2];
		  				for (var propt in righe)	
		  				{
		  				 	if (righe[propt].tipo === "scontrini")
		  					{
		  					let ean = righe[propt].ean;
		  					let totalePezzi =  parseInt(righe[propt].pezzi,10);
			    		    let ricavoTotale = parseFloat(righe[propt].prezzoTotale);
			    		    let listinoTotale = totalePezzi * (parseFloat(righe[propt].prezzoListino));
			    		     let dettagli = {
			    		    	titolo: righe[propt].titolo, 
			    		    	autore: righe[propt].autore, 
			    		    	editore: righe[propt].editore,
			    		    	imgFirebaseUrl: righe[propt].imgFirebaseUrl,
			    		    	ean: ean,
			    		    	totalePezzi: totalePezzi,
			    		    	ricavoTotale: ricavoTotale,
			    		    	listinoTotale: listinoTotale
			    		    	}
			    		    	updateCell(matrix,propt2, dettagli, isYTD(propt2,today));
		  					}
							
		  				}
		  			}	
    return matrix;		  			
}
//Data una matrice di ricavi... e un livello richiesto formato 'anno/mese' o 'anno' o 'anno/mese/giorno' ritorna la sequenza completa

export const getTimeSeries = (matrix, level, from, to) =>
{

let ts = [];
let levels	= level.split('/');
let count = levels.length;
let list = matrix[levels[0]];
let tag = [];
let period = '';
//Array from formato anno/mese/giorno... o comunque i livelli che mi servono
const branchExplorer = (branch, depth) =>
{
	for (let propt in branch)
	   {
	   	tag[depth] = propt;
	    let subbranch = branch[propt];
	   if (depth+1 === count) 
			{
			period = tag.join('/');
			if (((!from) || (period >= from)) && ((!to) || (period <=to))) ts.push(
				{period: period, 
				ricavoTotale: parseFloat(subbranch.ricavoTotale.toFixed(2)), 
				listinoTotale: parseFloat(subbranch.listinoTotale.toFixed(2)),
				tatalePezzi: parseInt(subbranch.totalePezzi,10),
				ricavoTotaleYTD: parseFloat(subbranch.ricavoTotaleYTD.toFixed(2)), 
				listinoTotaleYTD: parseFloat(subbranch.listinoTotaleYTD.toFixed(2)),
				tatalePezziYTD: parseInt(subbranch.totalePezziYTD,10),
				ricavoTotaleDTY: parseFloat(subbranch.ricavoTotaleDTY.toFixed(2)), 
				listinoTotaleDTY: parseFloat(subbranch.listinoTotaleDTY.toFixed(2)),
				tatalePezziDTY: parseInt(subbranch.totalePezziDTY,10),
				});	
				
			}
		else
			{
			branchExplorer(subbranch[levels[depth+1]],depth+1);	
			}
			
	   }
}
branchExplorer(list,0);
return ts;	
}

//Dato un pezzo di matriceVenditeEAN ritorna un array ordinato secondo totalePezzi decrescente e a paritù di pezzi listinoTotale decrescente
export const topList = (eanObj) =>
{  if (eanObj)
		{
		let eanArray = Object.values(eanObj);
		eanArray.sort((a,b) => {return ((a.totalePezzi !== b.totalePezzi) ? b.totalePezzi - a.totalePezzi : (a.listinoTotale !== b.listinoTotale) ? b.listinoTotale - a.listinoTotale : 0) })
		return eanArray;
		}
	return null;	
}

//Trova i primi in classifica (su array ordinato)
export const firstX = (eanSortedArray, number) =>
{
let rank = 0;
let lastPezzi = 0;
let outputArray = [];
for (let i=0; i<eanSortedArray.length; i++)
	{
		if (i===0 || eanSortedArray[i].totalePezzi < lastPezzi) {rank++; lastPezzi = eanSortedArray[i].totalePezzi}
		outputArray.push({...eanSortedArray[i], rank: rank, key: i});
		if (outputArray.length === number) break;
	}
	
return outputArray;	
}


export const setDay = (moment) =>
{
	return(moment.startOf('day').add(12,'hours').valueOf());
}




