import {GET_REGISTRO_DATA} from '../actions/dashboard';
import {getMatrixVenditeFromRegistroData,getTimeSeries } from '../helpers/form';
import moment from 'moment';

const initialState =  {
 registroData: {},
 listening: false,
};

export default function dashboard(state = initialState, action) {
  switch (action.type) {
    case GET_REGISTRO_DATA:
       let registroData = action.payload.val();
         return {
        ...state, registroData: registroData, listening: true
      };
  
    
    default:
      return state;
  }
}

export const getRegistroData = (state) => {return state.registroData};
export const isListeningRegistroData = (state) => {return state.listening};

export const getSerieIncassi = (state) => {
	let registroData = state.registroData;
	
	if (registroData) 
		{let ts = getTimeSeries(getMatrixVenditeFromRegistroData(registroData),'anno/mese/giorno');
		for (let i=0; i<ts.length;i++) 
			{ts[i].period = moment(ts[i].period, 'YYYY/MM/DD').format('DD/MM/YYYY');
			ts[i].incasso = ts[i].ricavoTotale;
			}
		return ts;
		}
	else return null;
	
};
 
