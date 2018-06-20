import {FormActions} from '../helpers/formActions';
import {setDay} from '../helpers/form';
import Firebase from 'firebase';
import {urlFactory} from '../helpers/firebase';
import {aoa_to_xlsx} from '../helpers/file';
import moment from 'moment';

export const SCENE = 'ELENCOINVENTARI';
export const SAVE_INVENTARIO = 'SAVE_INVENTARIO'


//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   	riga['dataInventario'] = setDay(riga['dataInventario']);
   	riga['data'] = riga['dataInventario']; 
  
    
     }




export const saveInventario = (inventarioId) => 
{

    /* PER SALVARE DOCX
    let content = '<!DOCTYPE html> <html><head><title>Title of the document</title></head><body><div>The content of the document......</div><br clear="all" style="page-break-before:always" /><div  style="page-break-after: always">Another row</div></body></html>'
	var data2 = htmlDocx.asBlob(content);

	fileDownload(data2, 'filename.docx');*/
	
	return function(dispatch,getState) 
	   {
	
	//carico la tabella dal database...
	
	const url = urlFactory(getState,'righeInventario', inventarioId);
  	if (url)
    {  
       Firebase.database().ref(url).once('value', snapshot => {
       	  let data = [];
       	  data.push(['EAN','Titolo','Autore','Prezzo','Stock','Delta', 'Pezzi','Valore']);
       	  let righeInventario = snapshot.val();
       	  let riga = null
       	 		for (var idRiga in righeInventario)
       				{
       				riga =  righeInventario[idRiga];
       				let pezzi = parseInt(riga.stock, 10) + parseInt(riga.pezzi, 10);
       				let valore = pezzi * parseFloat(riga.prezzoListino);
       				data.push([riga.ean, riga.titolo, riga.autore, parseFloat(riga.prezzoListino), parseInt(riga.stock, 10), parseInt(riga.pezzi, 10), pezzi, valore]);	
       				}
       		
       	  let date = riga ? moment(riga.data).format('YYYYMMDD') : null; 	
       	  let fileName =  date ? date : 'empty';
       	  
       	  aoa_to_xlsx(data,fileName, true,[3,4,5,6,7]);

	      dispatch({
	        type: 'SAVE_INVENTARIO',
	        fileName: fileName
	      })
	    });
    }
  }	 
}




//METODI DEL FORM
export const inventarioFA = new FormActions(SCENE, preparaItem, 'righeElencoInventari');


