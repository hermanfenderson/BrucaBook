import {FormActions} from '../helpers/formActions';
import {addCreatedStamp,addChangedStamp, urlFactory} from '../helpers/firebase';
import Firebase from 'firebase';
import {getBolleOsservate, getIndiceEAN, getDettagliEANResa} from '../reducers';
import {getDetailsInMatrix} from '../helpers/form'

export const SCENE = 'RESA';
export const LISTEN_BOLLE_PER_FORNITORE = 'LISTEN_BOLLE_PER_FORNITORE';
export const ADDED_BOLLE_PER_FORNITORE = 'ADDED_BOLLE_PER_FORNITORE';
export const CHANGED_BOLLE_PER_FORNITORE = 'CHANGED_BOLLE_PER_FORNITORE';
export const DELETED_BOLLE_PER_FORNITORE = 'DELETED_BOLLE_PER_FORNITORE';
export const INITIAL_LOAD_BOLLE_PER_FORNITORE = 'INITIAL_LOAD_BOLLE_PER_FORNITORE';


export const UNLISTEN_BOLLE_PER_FORNITORE = 'UNLISTEN_BOLLE_PER_FORNITORE';

//export const LISTEN_DETTAGLI_EAN = 'LISTEN_DETTAGLI_EAN';
//export const UNLISTEN_DETTAGLI_EAN = 'UNLISTEN_DETTAGLI_EAN';
export const GET_DETTAGLI_EAN = 'GET_DETTAGLI_EAN';


export const LISTEN_BOLLA_IN_RESA = 'LISTEN_BOLLA_IN_RESA';
export const ADDED_RIGABOLLA_IN_RESA = 'ADDED_RIGABOLLA_IN_RESA';
export const INITIAL_LOAD_RIGABOLLA_IN_RESA = 'INITIAL_LOAD_RIGABOLLA_IN_RESA';

export const CHANGED_RIGABOLLA_IN_RESA = 'CHANGED_RIGABOLLA_IN_RESA';
export const DELETED_RIGABOLLA_IN_RESA = 'DELETED_RIGABOLLA_IN_RESA';

export const UNLISTEN_BOLLA_IN_RESA = 'UNLISTEN_BOLLA_IN_RESA';
export const SET_ACTIVE_MODAL = 'SET_ACTIVE_MODAL';
export const SET_PERIOD_RESA = 'SET_PERIOD_RESA';
export const SET_MODAL_DETAILS = 'SET_MODAL_DETAILS';


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
        riga['pezzi'] = parseInt(riga['pezzi'],10) || 0;
      riga['gratis'] = parseInt(riga['gratis'],10) || 0;
      riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
     riga['prezzoTotale'] = parseFloat(riga['prezzoTotale']).toFixed(2);
     //Pulizia...
     riga['dataDocumento'] = riga.testata.dataDocumento;
     riga['dataScarico'] = riga.testata.dataScarico;
     riga['fornitore'] = riga.testata.fornitore;
     riga['nomeFornitore'] = riga.testata.nomeFornitore;
     riga['riferimento'] = riga.testata.riferimento;
     riga['data'] = riga['dataScarico'];
     
     
      delete riga['testata'];
      delete riga['maxPezzi'];
      delete riga['maxGratis'];
      delete riga['rese'];
      
    
   }

   
export function listenBollePerFornitore(idFornitore, dataScarico)
{
	
//Genero tre listener... come un'unica funzione...

   
   return function(dispatch, getState) {
  	const url = urlFactory(getState,'bollePerFornitore', idFornitore);
  	if (url)
    {   let first = true;
  
       const listener_added = Firebase.database().ref(url).limitToLast(1).on('child_added', snapshot => {
       	 if (first) first = false;
	     else if (snapshot.val().dataCarico < dataScarico)
       	 {
       	  dispatch({
	        type: ADDED_BOLLE_PER_FORNITORE,
	        payload: snapshot
	      });
	      dispatch(listenBolla(snapshot.val().id))
       	 }
	    });
	   const listener_changed = Firebase.database().ref(url).on('child_changed', snapshot => {
	   	  if (snapshot.val().dataCarico < dataScarico)
          {
	      dispatch({
	        type: CHANGED_BOLLE_PER_FORNITORE,
	        payload: snapshot
	      });
	     //Se non stavo ascoltando... ascolto...
	     let bolle = getBolleOsservate(getState());
	     if (!bolle[snapshot.key]) dispatch(listenBolla(snapshot.val().id))
          }
	   });
	   const listener_removed = Firebase.database().ref(url).on('child_removed', snapshot => {
	     let bolle = getBolleOsservate(getState());
	     if (bolle[snapshot.key]) dispatch(unlistenBolla(bolle[snapshot.key].id));
	      dispatch({
	        type: DELETED_BOLLE_PER_FORNITORE,
	        payload: snapshot
	      });  
	      
	   });
	   
	   Firebase.database().ref(url).once('value', snapshot => {
	       dispatch({
	        type: INITIAL_LOAD_BOLLE_PER_FORNITORE,
	        payload: snapshot
	      });  
	       let listaBolle = Object.values(snapshot.val());
	       for (let i=0; i<listaBolle.length; i++)
	    	{
	    		if (listaBolle[i].dataCarico < dataScarico) dispatch(listenBolla(listaBolle[i].id))
	    	}
	   });
	   
	   dispatch({
	   	type: LISTEN_BOLLE_PER_FORNITORE,
	   	params: idFornitore,
	   	listeners: {added: listener_added,changed: listener_changed, removed: listener_removed} 
	   });
	}   
	else dispatch({
	   	type: LISTEN_BOLLE_PER_FORNITORE,
	   	params: null,
	   });   
  }
  
}

export function unlistenBollePerFornitore(idFornitore)
{
return function(dispatch, getState) {	
	 let bolle = getBolleOsservate(getState());
	 for (var bolla in bolle) dispatch(unlistenBolla(bolle[bolla].id));
	Firebase.database().ref(urlFactory(getState,'bollePerFornitore', idFornitore)).off();
		dispatch({
		   	type: UNLISTEN_BOLLE_PER_FORNITORE,
		   	params: idFornitore
		   })
     //Mi sgancio anche da tutti i dettagli di libri che ho ascoltato finora...NON SERVE PIU'
     /*
     let dettagliEAN = getDettagliEANResa(getState());
	 for (var ean in dettagliEAN) dispatch(unlistenDettagliEAN(ean));
     */
	}
}	   


   
export function listenBolla(idBolla)
{
	
//Genero tre listener... come un'unica funzione...

   
   return function(dispatch, getState) {
  	const url = urlFactory(getState,'righeBollaInResa', idBolla);
  	if (url)
    {  
       let first = true;
  	
       const listener_added = Firebase.database().ref(url).limitToLast(1).on('child_added', snapshot => {
       	/*NON SERVE PIU'... CAMBIO STRATEGIA*/
       	/*
       	let indiceEAN = getIndiceEAN(getState());
	      if (!indiceEAN[snapshot.val().ean]) {dispatch(listenDettagliEAN(snapshot.val().ean))} //Ascolto i dettagli...
	    */
	   if (first) first  = false;
	    else  dispatch({
	        type: ADDED_RIGABOLLA_IN_RESA,
	        payload: snapshot
	      })
	      });
	   const listener_changed = Firebase.database().ref(url).on('child_changed', snapshot => {
	      dispatch({
	        type: CHANGED_RIGABOLLA_IN_RESA,
	        payload: snapshot
	      })  
	   });
	   const listener_removed = Firebase.database().ref(url).on('child_removed', snapshot => {
	      dispatch({
	        type: DELETED_RIGABOLLA_IN_RESA,
	        payload: snapshot
	      })  
	   });
	   
	   Firebase.database().ref(url).once('value', snapshot => {
	       dispatch({
	        type: INITIAL_LOAD_RIGABOLLA_IN_RESA,
	        payload: snapshot
	      });  
	   });
	   
	   dispatch({
	   	type: LISTEN_BOLLA_IN_RESA,
	   	params: idBolla,
	   	listeners: {added: listener_added,changed: listener_changed, removed: listener_removed} 
	   })
	}   
	else dispatch({
	   	type: LISTEN_BOLLA_IN_RESA,
	   	params: null,
	   })   
  }
  
}

//Uso il fatto che id ha già il path giusto... trucchismo...
export function unlistenBolla(idBolla)
{
return function(dispatch, getState) {	
	Firebase.database().ref(urlFactory(getState,'righeBollaInResa', idBolla)).off();
		dispatch({
		   	type: UNLISTEN_BOLLA_IN_RESA,
		   	params: idBolla
		   })

	}
}

export function getDettagliEAN(ean)
{
return function(dispatch, getState) {
  	const url = urlFactory(getState,'registroEAN', null, ean);
	Firebase.database().ref(url).once('value', snapshot => {
	      dispatch({
	        type: GET_DETTAGLI_EAN,
	        payload: snapshot
	      })
	    });
}
}
//Questa non serve più...
/*
export function listenDettagliEAN(ean)
{
	
//Genero tre listener... come un'unica funzione...

   
   return function(dispatch, getState) {
  	const url = urlFactory(getState,'registroEAN', null, ean);
  	if (url)
    {  
       const listener_value = Firebase.database().ref(url).on('value', snapshot => {
	      dispatch({
	        type: GET_DETTAGLI_EAN,
	        payload: snapshot
	      })
	    });
	   
	   dispatch({
	   	type: LISTEN_DETTAGLI_EAN,
	   	params: ean,
	   	listener_value: listener_value 
	   })
	}   
	else dispatch({
	   	type: LISTEN_DETTAGLI_EAN,
	   	params: null,
	   })   
  }
  
}

//Uso il fatto che id ha già il path giusto... trucchismo...
export function unlistenDettagliEAN(ean)
{
return function(dispatch, getState) {	
	Firebase.database().ref(urlFactory(getState,'registroEAN', null, ean)).off();
		dispatch({
		   	type: UNLISTEN_DETTAGLI_EAN,
		   	params: ean
		   })

	}
}	   

*/

export const setPeriodResa = (period) =>
{
	return({type: SET_PERIOD_RESA, period: period})
};

export const setActiveModal = (activeModal) =>
{
	return({type: SET_ACTIVE_MODAL, activeModal: activeModal})
};


export const setModalDetails = (matrixEAN, headerEAN) =>
{
	return({type: SET_MODAL_DETAILS, matrixEAN: matrixEAN, headerEAN: headerEAN})
};


export const showModalDetails = (headerEAN) =>
{
return function(dispatch, getState) {
	let ean = headerEAN.ean;
  	const url = urlFactory(getState,'registroEAN', null, ean);
 	Firebase.database().ref(url).once('value', snapshot => {
	      let registro = snapshot.val();
	      let matrixEAN = getDetailsInMatrix(registro);
	      dispatch(setModalDetails(matrixEAN, headerEAN));
	        dispatch(setActiveModal(true));
   dispatch(setPeriodResa([null, null]));

	    });
}
}
//METODI DEL FORM
//Il true... indica che voglio la gestione dello stock nei messaggi informativi
export const rigaResaFA = new FormActions(SCENE, preparaItem, 'righeResa','righeElencoRese', true);

//Se devo fare override.... definisco metodi alternativi qui...

rigaResaFA.changeEditedItem = (name, value, row, index, ean) => {
	   	return {
			type: rigaResaFA.CHANGE_EDITED_ITEM,
	    	field: name,
	    	value: value,
	    	row: row,
	    	index: index,
	    	ean: ean
			}
	}


rigaResaFA.aggiungiItem = (params, valori) => {
  const typeAdd =  rigaResaFA.ADD_ITEM;
  var nuovoItem = {...valori};
  const itemsUrl = rigaResaFA.itemsUrl;
  const stockMessageQueue = rigaResaFA.stockMessageQueue;
  const stockMessageQueueListener = rigaResaFA.stockMessageQueueListener;
  const toggleTableScroll = rigaResaFA.toggleTableScroll;
   addCreatedStamp(nuovoItem);
   rigaResaFA.preparaItem(nuovoItem);
    return function(dispatch,getState) {
   
   dispatch(toggleTableScroll(true));    //Mi metto alla fine della tabella
   var ref; 
    ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params)).push();
    ref.set(nuovoItem);
    let idRigaBolla = valori.idRigaBolla;
    let idRigaResa = params[0] + '/' + params[1] + '/' + params[2] + '/' + ref.key; //Ricostruisco l'id Riga resa
    let updatedRese = {};
    updatedRese[ref.key] = {pezzi: valori.pezzi, gratis: valori.gratis, idResa: params[2], idRigaResa: idRigaResa};
    Firebase.database().ref(urlFactory(getState,'reseInRigheBolla', idRigaBolla)).update(updatedRese);
   
    
   dispatch(
   	{
   		type: typeAdd,
   		key: ref.key
   	}
   	)  	
   if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));	
   return(ref.key);
  }
  
}

rigaResaFA.aggiornaItem = (params,itemId, valori) => {
    const typeChange = rigaResaFA.CHANGE_ITEM;
 	 const stockMessageQueue = rigaResaFA.stockMessageQueue;
 const stockMessageQueueListener = rigaResaFA.stockMessageQueueListener;
  
    var nuovoItem = {...valori};
      addChangedStamp(nuovoItem);
   rigaResaFA.preparaItem(nuovoItem);
    const itemsUrl = rigaResaFA.itemsUrl;
      return function(dispatch,getState) {

    const ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params, itemId));
    ref.update(nuovoItem);
    let idRigaBolla = valori.idRigaBolla;
     let idRigaResa = params[0] + '/' + params[1] + '/' + params[2] + '/' + itemId; //Ricostruisco l'id Riga resa
   
    let updatedRese = {};
   updatedRese[itemId] = {pezzi: valori.pezzi, gratis: valori.gratis, idResa: params[2], idRigaResa: idRigaResa};
   Firebase.database().ref(urlFactory(getState,'reseInRigheBolla', idRigaBolla)).update(updatedRese);
   
    dispatch(
   	{
   		type: typeChange,
   		key: ref.key
   	}
   	)  	 
   	if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));
   	 return(itemId); 
  }
 
}




//Una forzatura chiedere ean come parametro aggiuntivo in alcuni casi......ma mi evito una chiamata del tutto inutile
rigaResaFA.deleteItem = (params, itemId, valori=null) => {
const typeDelete = rigaResaFA.DELETE_ITEM;
const itemsUrl = rigaResaFA.itemsUrl;
const stockMessageQueue = rigaResaFA.stockMessageQueue;
 const stockMessageQueueListener = rigaResaFA.stockMessageQueueListener;
  

  return function(dispatch, getState) {
    Firebase.database().ref(urlFactory(getState,itemsUrl,params, itemId)).remove();
      let idRigaBolla = valori.idRigaBolla;
  
   
   Firebase.database().ref(urlFactory(getState,'reseInRigheBolla', idRigaBolla, itemId)).remove();
  
     dispatch(
					{
   					type: typeDelete,
   					key: itemId
   					}
   					)   
   	if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));				
    };
  }

