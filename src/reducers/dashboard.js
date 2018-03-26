import {GET_REGISTRO_DATA} from '../actions/dashboard';
import {getMatrixVenditeFromRegistroData,getTimeSeries } from '../helpers/form';
import moment from 'moment';


const initialState =  {
 registroData: {},
 matrixVendite: {},
 serieIncassi: [],
 serieIncassiMesi: [],
 listening: false,
};

export default function dashboard(state = initialState, action) {
  switch (action.type) {
    case GET_REGISTRO_DATA:
       let registroData = action.payload.val();
       let matrixVendite = getMatrixVenditeFromRegistroData(registroData);
       let serieIncassi = generateSerieIncassi(matrixVendite);
       let serieIncassiMesi = generateSerieIncassiMesi(matrixVendite);
         return {
        ...state, registroData: registroData, serieIncassi: serieIncassi, serieIncassiMesi: serieIncassiMesi, matrixVendite: matrixVendite, listening: true
      };
  
    
    default:
      return state;
  }
}

export const getRegistroData = (state) => {return state.registroData};
export const getSerieIncassi = (state) => {return state.serieIncassi};
export const getSerieIncassiMesi = (state) => {return state.serieIncassiMesi};  

export const isListeningRegistroData = (state) => {return state.listening};


export const generateSerieIncassi = (matrixVendite) => {
		let ts = getTimeSeries(matrixVendite,'anno/mese/giorno',null,null);
		for (let i=0; i<ts.length;i++) 
			{ts[i].period = moment(ts[i].period, 'YYYY/MM/DD').format('DD/MM/YY');
			ts[i].incasso = ts[i].ricavoTotale;
			}
		return ts;
};

export const generateSerieIncassiMesi = (matrixVendite) => {
		let ts = getTimeSeries(matrixVendite,'anno/mese',null,null);
		let tsOut = [];
		//Inizializzo la sequenza dei mesi
		for (let i=1; i<13; i++) tsOut.push({mese: i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) });
		//Poggio totale, ytd e dty per mese e per anno
		for (let j=0; j<ts.length; j++) 
			{   
			     
			    let tag = ts[j].period.split('/');
			    let year = tag[0];
			    let period = parseInt(tag[1])-1;
			    let ytd = year+'ytd';
			    let dty = year+'dty';
			   
				tsOut[period][ytd] = ts[j].ricavoTotaleYTD;
				tsOut[period][dty] = ts[j].ricavoTotaleDTY;
				tsOut[period][year] = ts[j].ricavoTotale;
			};	
		return tsOut;	
} 




 
