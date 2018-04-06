import {FormActions} from '../helpers/formActions';
import {moment2period, setDay} from '../helpers/form';
import moment from 'moment';
import Firebase from 'firebase';
import {urlFactory} from '../helpers/firebase';

import {aoa_to_xlsx} from '../helpers/file';


export const SCENE = 'ELENCORESE';
export const SET_PERIOD_ELENCORESE = 'SET_PERIOD_ELENCORESE'


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataDocumento'] = setDay(riga['dataDocumento']);
   	riga['dataScarico'] = setDay(riga['dataScarico']);
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	if ('totali' in riga) {delete riga.totali}
   	
    
     }




export const setPeriodElencoRese = (moment) =>
{
	const period = moment2period(moment);
	return(
		 {
		 	'type': SET_PERIOD_ELENCORESE,
		 	period: period
		 }
		)
}

export const saveResa = (period, resaId) => 
{

    /* PER SALVARE DOCX
    let content = '<!DOCTYPE html> <html><head><title>Title of the document</title></head><body><div>The content of the document......</div><br clear="all" style="page-break-before:always" /><div  style="page-break-after: always">Another row</div></body></html>'
	var data2 = htmlDocx.asBlob(content);

	fileDownload(data2, 'filename.docx');*/
	
	return function(dispatch,getState) 
	   {
	
	//carico la tabella dal database...
	
	const url = urlFactory(getState,'righeResa', [period[0], period[1], resaId]);
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
	        type: 'SAVE_RESA',
	        fileName: fileName
	      })
	    });
    }
  }	 
}


//METODI DEL FORM
export const resaFA = new FormActions(SCENE, preparaItem, 'righeElencoRese');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...

//Setto bolla aperta o chiusa
export const setStato = (listeningTestata, testata, stato)	=> 
{   
let newTestata = {...testata, dataDocumento: moment(testata.dataDocumento), dataScarico: moment(testata.dataScarico), stato : stato};
return function(dispatch)
	{
	dispatch(resaFA.aggiornaItem(listeningTestata.params, listeningTestata.itemId, newTestata));
	}
}

