import {FormActions} from '../helpers/formActions';
import {moment2period, setDay} from '../helpers/form';
import {addCreatedStamp, addChangedStamp, urlFactory} from '../helpers/firebase';
import Firebase from 'firebase';
import moment from 'moment';

import {aoa_to_xlsx} from '../helpers/file';


//import {isInternalEAN} from './ean';
export const SCENE = 'ELENCOBOLLE';
export const SET_PERIOD_ELENCOBOLLE = 'SET_PERIOD_ELENCOBOLLE'


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataDocumento'] = setDay(riga['dataDocumento']);
   	riga['dataCarico'] = setDay(riga['dataCarico']);
   	if (riga['dataRendiconto']) riga['dataRendiconto'] = setDay(riga['dataRendiconto']);
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	
    
     }




export const setPeriodElencoBolle = (moment) =>
{
	const period = moment2period(moment);
	return(
		 {
		 	'type': SET_PERIOD_ELENCOBOLLE,
		 	period: period
		 }
		)
}


export const saveBolla = (period, resaId) => 
{

    /* PER SALVARE DOCX
    let content = '<!DOCTYPE html> <html><head><title>Title of the document</title></head><body><div>The content of the document......</div><br clear="all" style="page-break-before:always" /><div  style="page-break-after: always">Another row</div></body></html>'
	var data2 = htmlDocx.asBlob(content);

	fileDownload(data2, 'filename.docx');*/
	
	return function(dispatch,getState) 
	   {
	
	//carico la tabella dal database...
	
	const url = urlFactory(getState,'righeBolla', [period[0], period[1], resaId]);
  	if (url)
    {  console.log(url);
       Firebase.database().ref(url).once('value', snapshot => {
       	  let data = [];
       	  data.push(['EAN','Titolo','Autore','Editore','Pezzi','Gratis','Prezzo', 'Totale']);
       	  console.log(snapshot.val());
       	  let riga = null
       			for (var idRiga in snapshot.val())
       				{
       				riga =  snapshot.val()[idRiga];
       				console.log(riga);
       				data.push([riga.ean, riga.titolo, riga.autore, riga.editore, parseInt(riga.pezzi, 10),  parseInt(riga.gratis, 10), parseFloat(riga.prezzoUnitario), parseFloat(riga.prezzoTotale)]);	
       				}
       		  let date = riga ? moment(riga.data).format('YYYYMMDD') : null; 	
       	  let fileName =  date ? date : 'empty';
       	  
       	  aoa_to_xlsx(data,fileName, true,[4,5,6,7]);

	      dispatch({
	        type: 'SAVE_BOLLA',
	        fileName: fileName
	      })
	    });
    }
  }	 
}



//METODI DEL FORM
export const bollaFA = new FormActions(SCENE, preparaItem, 'righeElencoBolle');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...

bollaFA.aggiungiItem = (params, valori) => {
  const typeAdd =  bollaFA.ADD_ITEM;
  var nuovoItem = {...valori};
  const itemsUrl = bollaFA.itemsUrl;
  const stockMessageQueue = bollaFA.stockMessageQueue;
  const stockMessageQueueListener = bollaFA.stockMessageQueueListener;
  const toggleTableScroll = bollaFA.toggleTableScroll;
   addCreatedStamp(nuovoItem);
   bollaFA.preparaItem(nuovoItem);
    return function(dispatch,getState) {
   
   dispatch(toggleTableScroll(true));    //Mi metto alla fine della tabella
   var ref; 
    if(!bollaFA.onEAN) ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params)).push();
    else ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params, valori.ean));
    ref.set(nuovoItem);
   var bollaKey = params[0] + '/' + params[1] + '/' + ref.key; //Dato da persistere come bolla per fornitore
   var ref2 = Firebase.database().ref(urlFactory(getState,'bollePerFornitore', valori.fornitore, ref.key)); //Persisto per fornitore... il riferimentoa alla bolla (che è chiave unica)
   ref2.set({'id': bollaKey, 'dataCarico': valori.dataCarico.valueOf(), 'dataDocumento': valori.dataDocumento.valueOf()}); //Persisto il percorso a cui trovarla
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

bollaFA.aggiornaItem = (params,itemId, valori) => {
    const typeChange = bollaFA.CHANGE_ITEM;
 	 const stockMessageQueue = bollaFA.stockMessageQueue;
 const stockMessageQueueListener = bollaFA.stockMessageQueueListener;
  
    var nuovoItem = {...valori};
      addChangedStamp(nuovoItem);
   bollaFA.preparaItem(nuovoItem);
    const itemsUrl = bollaFA.itemsUrl;
      return function(dispatch,getState) 
    		{
		    if (nuovoItem.oldFornitore !== nuovoItem.fornitore) Firebase.database().ref(urlFactory(getState,'bollePerFornitore', valori.oldFornitore, itemId)).remove(); 
		    var bollaKey = params[0] + '/' + params[1] + '/' + itemId; //Dato da persistere come bolla per fornitore
			var ref2 = Firebase.database().ref(urlFactory(getState,'bollePerFornitore', valori.fornitore, itemId)); //Persisto per fornitore... il riferimentoa alla bolla (che è chiave unica)
			ref2.set({'id': bollaKey, 'dataCarico': valori.dataCarico.valueOf(), 'dataDocumento': valori.dataDocumento.valueOf()}); //Persisto il percorso a cui trovarla
		    delete nuovoItem.oldFornitore;		
		    const ref  = Firebase.database().ref(urlFactory(getState,itemsUrl, params, itemId));
		    ref.update(nuovoItem);
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
bollaFA.deleteItem = (params, itemId, valori=null) => {
const typeDelete = bollaFA.DELETE_ITEM;
const itemsUrl = bollaFA.itemsUrl;
const stockMessageQueue = bollaFA.stockMessageQueue;
 const stockMessageQueueListener = bollaFA.stockMessageQueueListener;
  

  return function(dispatch, getState) {
    Firebase.database().ref(urlFactory(getState,itemsUrl,params, itemId)).remove();
    Firebase.database().ref(urlFactory(getState,'bollePerFornitore', valori.fornitore, itemId)).remove();
    
     dispatch(
					{
   					type: typeDelete,
   					key: itemId
   					}
   					)   
   	if (stockMessageQueue) dispatch(stockMessageQueueListener(valori));				
    };
  }
	
	

