import {FormActions} from '../helpers/formActions';

export const SCENE = 'SCONTRINO';
export const SET_SCONTO_SCONTRINO = 'SET_SCONTO_SCONTRINO';

//FUNZIONI DA VERIFICARE
//Prepara riga con zeri ai fini della persistenza... resta così
function preparaItem(riga)
   {
     riga['sconto'] = parseInt(riga['sconto'],10) || 0;
      riga['pezzi'] = parseInt(riga['pezzi'],10) || 0;
     riga['prezzoUnitario'] = parseFloat(riga['prezzoUnitario']).toFixed(2);
     riga['prezzoTotale'] = parseFloat(riga['prezzoTotale']).toFixed(2);
     //Elimino i riferimenti ai totali (che vengono calcolati e non vanno persistiti... e al tipo che serve solo in visualizzazione)
     	if ('totali' in riga) {delete riga.totali};
     	if ('tipo' in riga) {delete riga.tipo};
     	
    
   }

   
export const setSconto = (params, sconto, righe) =>
//Modifico per tutte le righe in essere e cambio il default dello sconto 
{
return function(dispatch, getState) {
    dispatch({type: SET_SCONTO_SCONTRINO, sconto: sconto});
	for (let item in righe)
	{
	let riga = righe[item];
	let itemId = riga.key;
	let oldSconto = riga.sconto;
	if (sconto !== oldSconto && !riga.manSconto) //Modifico solo le righe con manSconto falso
				{
					let prezzoListino = riga.prezzoListino;
					let pezzi = riga.pezzi;
					
					let prezzoUnitario = ((1 - sconto/100) * prezzoListino).toFixed(2);
					let prezzoTotale = (pezzi * prezzoUnitario).toFixed(2);
					riga.sconto = sconto;
					riga.prezzoUnitario = prezzoUnitario;
					riga.prezzoTotale = prezzoTotale;
					dispatch(rigaScontrinoFA.aggiornaItem(params, itemId, riga))
				}
						
	}
  }	
}


//METODI DEL FORM
export const rigaScontrinoFA = new FormActions(SCENE, preparaItem, 'righeScontrino','righeElencoScontrini', true);

//Se devo fare override.... definisco metodi alternativi qui...


