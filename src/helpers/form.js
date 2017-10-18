//Funzioni di supporto per gestire WrappedForms
//Le scenes che usano wrapped forms persistono nel loro pezzo di stato e quindi nel loro reducer  



export const editedItemInitialState = (editedItemValuesInitialState, errors={}, errorMessages={}, isValid=false, selectedItem=null, loading=false) => {
	
 //La form viene gestita con uno stato di validità generale... isValid
 //errors è un oggetto con chiavi uguali ai campi e uno per il form in se..
 //ha codici di errore non parlanti...
 
 //errorMessages è identico ad errors ma contiene SOLO gli errori da mostrare...
 //entrambe le strutture vengono calcolate ad ogni change...
 
	return { values:{...editedItemValuesInitialState},
			errors: errors,
			errorMessages: errorMessages,
			isValid: isValid,
			selectedItem: selectedItem,
			loading: false
			};
}	

//Passo il pezzo di stato e copio deep anzichè shallow per sicurezza
export const editedItemCopy = (editedItem) => {
	let copiedEditedItemValues = {...editedItem.values};
	let copiedEditedItem = {...editedItem, values: copiedEditedItemValues};
	return (copiedEditedItem);
}



//funzione di cortesia... aggiunge un errore a un array all'interno della chiave name

export function errMgmt(cerb, name,error,message, errorCondition, errorMessageCondition = errorCondition)
{  
	if (errorCondition === true) 
	    {
	    
	    
	    if (!(name in cerb.errors)) cerb.errors[name] = {};
		cerb.errors[name][error] = message;
	    }
	else 
		{
		if (name in cerb.errors) delete cerb.errors[name][error];
		 if (cerb.errors[name] && Object.keys(cerb.errors[name]).length === 0) delete cerb.errors[name];
		}
	if (errorMessageCondition === true) cerb.errorMessages[name] = message;
}
