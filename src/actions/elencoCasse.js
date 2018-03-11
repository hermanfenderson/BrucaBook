import {FormActions} from '../helpers/formActions';
import {moment2period, setDay} from '../helpers/form';
import Firebase from 'firebase';
import {urlFactory} from '../helpers/firebase';
import {aoa_to_xlsx} from '../helpers/file';
import moment from 'moment';



export const SCENE = 'ELENCOCASSE';
export const SET_PERIOD_ELENCOCASSE = 'SET_PERIOD_ELENCOCASSE'
export const SAVE_CASSA = 'SAVE_CASSA'


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataCassa'] = setDay(riga['dataCassa']);
   	//Non voglio persistere i totali da qui! Li calcola la funzione del database...
   	if ('totali' in riga) {delete riga.totali}
   	
    
     }




export const setPeriodElencoCasse = (moment) =>
{
	const period = moment2period(moment);
	return(
		 {
		 	'type': SET_PERIOD_ELENCOCASSE,
		 	period: period
		 }
		)
}


export const saveCassa = (period, cassaId) => 
{
	return function(dispatch,getState) 
	   {
	
	//carico la tabella dal database...
	
	const url = urlFactory(getState,'righeCassa', [period[0], period[1], cassaId]);
  	if (url)
    {  
       Firebase.database().ref(url).once('value', snapshot => {
       	  let data = [];
       	  data.push(['Scontrino','EAN','Titolo','Autore','Editore','Pezzi','Prezzo', 'Totale']);
       	  let elencoScontrini = snapshot.val();
       	  let riga = null
       	  for (var scontrino in elencoScontrini)
       		{	
       			for (var idRiga in elencoScontrini[scontrino])
       				{
       				riga =  elencoScontrini[scontrino][idRiga];
       				data.push([riga.numero, riga.ean, riga.titolo, riga.autore, riga.editore, parseInt(riga.pezzi, 10), parseFloat(riga.prezzoUnitario), parseFloat(riga.prezzoTotale)]);	
       				}
       		}
       	  let date = riga ? moment(riga.data).format('YYYYMMDD') : null; 	
       	  let fileName =  date ? date : 'empty';
       	  
       	  aoa_to_xlsx(data,fileName, true,[0,5,6,7]);

	      dispatch({
	        type: 'SAVE_CASSA',
	        fileName: fileName
	      })
	    });
    }
  }	 
}


//METODI DEL FORM
export const elencoCasseFA = new FormActions(SCENE, preparaItem, 'righeElencoCasse');

//Se devo fare override.... definisco metodi alternativi qui...
//Override di submit.... devo gestire il salvataggio in gerarchia....
//Metto qui anche aggiungi e aggiorna...


	

