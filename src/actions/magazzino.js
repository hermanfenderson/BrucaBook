import {FormActions} from '../helpers/formActions';
import Firebase from 'firebase';
import {urlFactory} from '../helpers/firebase';
import {aoa_to_xlsx} from '../helpers/file';
import moment from 'moment';

export const SCENE = 'MAGAZZINO';


//METODI DEL FORM
//Lavora per EAN
export const magazzinoFA = new FormActions(SCENE, null, 'magazzino',null, false, false, true);

//Se devo fare override.... definisco metodi alternativi qui...



export const saveMagazzino = () => 
{

    /* PER SALVARE DOCX
    let content = '<!DOCTYPE html> <html><head><title>Title of the document</title></head><body><div>The content of the document......</div><br clear="all" style="page-break-before:always" /><div  style="page-break-after: always">Another row</div></body></html>'
	var data2 = htmlDocx.asBlob(content);

	fileDownload(data2, 'filename.docx');*/
	
	return function(dispatch,getState) 
	   {
	
	//carico la tabella dal database...
	
	const url = urlFactory(getState,'magazzino');
  	if (url)
    {  
       Firebase.database().ref(url).once('value', snapshot => {
       	  let data = [];
       	  data.push(['EAN','Titolo','Autore','Editore','Prezzo', 'Pezzi','Valore']);
       	  let righeMagazzino = snapshot.val();
       	  let riga = null
       	 		for (var idRiga in righeMagazzino)
       				{
       				riga =  righeMagazzino[idRiga];
       				let pezzi = parseInt(riga.pezzi, 10);
       				let valore = pezzi * parseFloat(riga.prezzoListino);
       				data.push([idRiga, riga.titolo, riga.autore, riga.editore, parseFloat(riga.prezzoListino), pezzi, valore]);	
       				}
       		
       	  let date = riga ? moment(riga.data).format('YYYYMMDD') : null; 	
       	  let fileName =  date ? date : 'empty';
       	  
       	  aoa_to_xlsx(data,fileName, true,[4,5,6]);

	      dispatch({
	        type: 'SAVE_MAGAZZINO',
	        fileName: fileName
	      })
	    });
    }
  }	 
}
