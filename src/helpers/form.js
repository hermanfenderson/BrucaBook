//Funzioni di supporto per gestire WrappedForms
//Le scenes che usano wrapped forms persistono nel loro pezzo di stato e quindi nel loro reducer  
//Introduco qui anche la gestione dello stato dell'EAN se il form non ha l'EAN... viene ignorato.

import {isPositiveInteger, isValidBookCode} from './validators';
import {isValidEAN} from './ean';
import {isComplete} from './catalog';
import moment from 'moment';



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
	    
	    
	    if (!(name in cei.errors)) cei.errors[name] = {};
		cei.errors[name][error] = message;
	    }
	else 
		{
		if (name in cei.errors) delete cei.errors[name][error];
		 if (cei.errors[name] && Object.keys(cei.errors[name]).length === 0) delete cei.errors[name];
		}
	if (errorMessageCondition === true) cei.errorMessages[name] = message;
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
	return ((Object.keys(editedItem.errors).length === 0) && editedItem.loading === false)
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