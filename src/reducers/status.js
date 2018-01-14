//Gestione dello stato della applicazione (componente da persistere in caso di refresh della pagina)
import {USER_INFO_CHANGED, MASTER_DATA_LOADED, LOCAL_MASTER_DATA_LOADED } from '../actions';
import {USER_CONFIGURATION_CHANGED} from '../actions/userMgmt'
import moment from 'moment';

const initialState =  {
  catena: null,
  libreria: null,
  nomeLibreria: '',
  nick: '', 
  masterData: null,
  localMasterData: null
};

export default function status(state = initialState, action) {
  switch (action.type) {
  	 case USER_INFO_CHANGED:
      	return {
      	 ...state,
        catena: (action.info ? action.info.defaultCatena : null), //Questo in futuro cambia quando avrò gestione multi catena e multi libreria
        libreria: (action.info ? action.info.defaultLibreria : null), //Idem
        nomeLibreria: (action.info ? action.info.elencoLibrerie[action.info.defaultCatena].librerie[action.info.defaultLibreria] : null), //Idem
        nick: (action.info ? action.info.nick : ''),
        nome: (action.info ? action.info.nome : ''),
        cognome: (action.info ? action.info.cognome : ''),
        email: (action.info ? action.info.email : ''),
        elencoLibrerie: (action.info ? action.info.elencoLibrerie : null),
       	}	
     case USER_CONFIGURATION_CHANGED:
     	let info = {nick: action.info.nick};
     	if (action.info.defaultLibreria) info.libreria = action.info.defaultLibreria;
     	if (action.info.defaultCatena) info.catena = action.info.defaultCatena;
     	if (action.info.defaultLibreria) info.nomeLibreria = state.elencoLibrerie[action.info.defaultCatena].librerie[action.info.defaultLibreria]; //Idem
        
     	return {
     		...state, ...info
     	}
     case MASTER_DATA_LOADED:
     	return {...state, masterData: action.payload}
     
     case LOCAL_MASTER_DATA_LOADED:
     	return {...state, localMasterData: action.payload}
     
     
    default:
      return state;
  }
}

export const getCatena = (state) => {return state.catena}; 
export const getLibreria = (state) => {return state.libreria};
export const getInfo = (state) => {return state};
export const getAnagrafiche = (state) => {return state.masterData};
export const getAnagraficheLocali = (state) => {return state.localMasterData};
//Funzione derivata dallo stato
export const getSelettoreIVA = (state) => {
	const IVA = state.masterData.IVA;
	const aliquote = state.masterData.AliquoteIVA;
	const now = moment().valueOf();
	let aliquoteNow = {};
	let aliquoteOut = {};
	for (var propt in aliquote) 
		{aliquoteNow[propt] = 0;
		for (var propt2 in aliquote[propt])
			{
				if (propt2 < now) aliquoteNow[propt] = aliquote[propt][propt2];
			}
		
		aliquoteOut[propt] = aliquoteNow[propt]*100 + '% (' + IVA[propt] +')';
		}
     return(aliquoteOut);		
}

