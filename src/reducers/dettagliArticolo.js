import {LISTEN_EAN , ITEM_DETAILS, ITEM_HEADER, OFF_LISTEN_EAN, SET_PERIOD_DETAILS} from '../actions/dettagliArticolo';

const initialState =  {
  listeningEAN: null,
  dettagliEAN: null,
  headerEAN: null,
  period: {anno: null, mese: null}
};

export default function dettagliArticolo(state = initialState, action) {
  switch (action.type) {
  	 case LISTEN_EAN:
      	return {
      	 ...state,
        listeningEAN: action.ean
      	}	
     case ITEM_DETAILS:
     	return {
      	 ...state,
        dettagliEAN: action.payload.val()
      	}
        case ITEM_HEADER:
     	return {
      	 ...state,
        headerEAN: action.payload.val()
      	}	
     case OFF_LISTEN_EAN:
     	return {
     		...state,
     		dettagliEAN: null,
     		headerEAN: null,
     		listeningEAN: null
     	}
     case SET_PERIOD_DETAILS:
     	return {
     		...state,
     		period: action.period
     	}
     	
    default:
      return state;
  }
}

export const getListeningEAN = (state) => {return state.listeningEAN};
export const getDettagliEAN = (state) => {return state.dettagliEAN};
export const getHeaderEAN = (state) => {return state.headerEAN};
export const getPeriod = (state) => {return state.period};
