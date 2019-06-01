import {FormActions} from '../helpers/formActions';
import {urlFactory, encodeSlash} from '../helpers/firebase';
import {eanArrayFromSubEanTree} from '../helpers/ordiniAperti';
import {getEanArray, getCatena, getLibreria} from '../reducers';
import Firebase from 'firebase';

export const SCENE = 'ORDINIAPERTI';
export const SET_ORDINIAPERTI_PER_EAN = 'SET_ORDINIAPERTI_PER_EAN';

export const SET_SHOW_ORDINIAPERTI_MODAL = 'SET_SHOW_ORDINIAPERTI_MODAL';

export const SAVE_ORDINI_APERTI_DIFF = 'SAVE_ORDINI_APERTI_DIFF';

//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così. Gestisco le date...
function preparaItem(riga)
   {
   
     }
//Source = 'bolla' oppure 'scontrino'
//Path punta alla specifica bolla o allo specifico scontrino (non riesco a puntare la specifica riga)
export function saveOrdiniApertiDiff(source, params) {
	
  return function(dispatch, getState) {
  	        let ordiniApertiDiff = getEanArray(getState());
  	        ordiniApertiDiff.pop();//Non mi serve la riga della vendita libera...
  	         let ordiniApertiUpdate = {}; //Tutti gli ordini che devo aggiornare
	  	     console.log(ordiniApertiDiff);
  	        if (ordiniApertiDiff.length > 0) //Altrimenti non devo fare assolutamente nulla
  	        {
  	             let path = params.join("/");
  	             //Dove vado ad aggiornare gli ordini...
	  	        let ref = Firebase.database().ref(getCatena(getState()) + '/' + getLibreria(getState()) + '/ordini');
	  	        let nextState = (source === 'bolla') ? 'R' : 'Z'; //Se è una bolla vado ad arrivato altrimenti a consegnato
	  	        ordiniApertiDiff.forEach((element) => {
	  	        let subpath = element.cliente+'/'+element.ordine+'/'+element.key;	
	  	        let pezziDelta = element.pezziDelta;
	  	        let pezzi = element.pezzi;
	  	        delete element.key;
	  	        delete element.pezziDelta;
	  	        console.log(path);
	  	        if (source === 'bolla') element.bolla = path;
	  	        else element.scontrino = path;
	  	        if (pezziDelta > 0) {
	  	        	 if (pezziDelta !== pezzi) 
	  	        	     {element.pezzi = pezziDelta;
	  	        	      let clonedElement = {...element};
	  	        	      clonedElement.pezzi = pezzi - pezziDelta;
	  	        	      clonedElement.prezzoTotale = (clonedElement.prezzoTotale * clonedElement.pezzi / pezzi).toFixed(2);
	  	        	      element.prezzoTotale = (element.prezzoTotale * element.pezzi / pezzi).toFixed(2);
	  	        	      
	  	        	      let clonedHistory = {...clonedElement.history};
	  	        	      clonedElement.history = clonedHistory; //Così è un oggetto diverso...
	  	        	      clonedElement.history[ref.push().key] = {at: Firebase.database.ServerValue.TIMESTAMP, stato: clonedElement.stato, source: 'clone', path: path};
	  	        	      let subpath2 = element.cliente+'/'+element.ordine+'/'+ref.push().key;	
	  	                  ordiniApertiUpdate[subpath2] = clonedElement; 
	  	        	     }
	  	        	     
	  	        	 let oldStato = (element.stato) ? element.stato : null;   
	  	        	 element.stato = nextState;
	  	             if (oldStato) element.oldStato = oldStato;
	  	        	 //Qui ci metto l'aggiornamento della storia...
	  	        	 element.history[ref.push().key] = {at: Firebase.database.ServerValue.TIMESTAMP, oldStato: oldStato, stato: nextState, source: source, path: path};
	  	        	ordiniApertiUpdate[subpath] = element;	
	  	           
	  	           //Finalmente posso fare l'update...
	  	           ref.update(ordiniApertiUpdate);
	  	            
	  	        }
	  	       
	  	        });
	  	       
  	        }  
  	        else ordiniApertiUpdate = null;
	 		//Firebase.database().ref(urlFactory(getState, 'ordini')).update(ordiniApertiUpdate);
	 		dispatch ({type: SAVE_ORDINI_APERTI_DIFF});	
	 		//Devo fare encoding di questa informazione per farla persistere al chiamante...
	 		let ordiniApertiUpdateEncoded = {};
	 		let ordiniApertiUpdateMatrix = (ordiniApertiUpdate) ? Object.entries(ordiniApertiUpdate) : {};
	 		for (const [key, value] of ordiniApertiUpdateMatrix) {
					ordiniApertiUpdateEncoded[encodeSlash(key)] = value;
				}
			return(ordiniApertiUpdateEncoded);
	 		}
	 		
	}	



export function setOrdiniApertiperEAN(subEanTree, qty) {
	let eanArray = eanArrayFromSubEanTree(subEanTree,qty);
	return {
		type: SET_ORDINIAPERTI_PER_EAN,
      
		eanArray: eanArray
	}	
}

export function setShowOrdiniApertiModal(showBool) {
	return {
		type: SET_SHOW_ORDINIAPERTI_MODAL,
      
		showOrdiniApertiModal: showBool
	}	
}
//METODI DEL FORM
export const ordiniApertiFA = new FormActions(SCENE, preparaItem, 'ordiniAperti');
