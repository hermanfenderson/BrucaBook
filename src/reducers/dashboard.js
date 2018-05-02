import {GET_REPORT_DATA,  GET_REPORT_DATA_INITIAL_LOAD, REPORT_DATA_ASKED, REPORT_DATA_CALCULATED} from '../actions/dashboard';

const initialState =  {
 serieIncassi: [],
 serieIncassiMesi: [],
 serieIncassiAnni: [],
 top5thisYear: [],
 top5lastYear: [],
 top5lastMonth: [],
 
 
 waitingForData: false,
};

export default function dashboard(state = initialState, action) {
  switch (action.type) {
    
        
    case REPORT_DATA_ASKED: 
      return {...state, waitingForData: true};  
    
    case GET_REPORT_DATA:
    	{
     	let reportData = action.payload.val();
     	let serieIncassi = action.payload.val().serieIncassi;
       let serieIncassiMesi = action.payload.val().serieIncassiMesi;
       let serieIncassiAnni = action.payload.val().serieIncassiAnni;
       let top5thisYear = action.payload.val().top5thisYear;
       let top5lastYear = action.payload.val().top5lastYear;
       let top5lastMonth =  action.payload.val().top5lastMonth;
       
     	return {
        ...state, reportData: reportData, serieIncassi: serieIncassi, serieIncassiMesi: serieIncassiMesi, serieIncassiAnni: serieIncassiAnni, top5thisYear: top5thisYear, top5lastYear: top5lastYear, top5lastMonth: top5lastMonth, waitingForData: false
      };
       }
     //Identico ma non cambia lo stato di loading... 
	case GET_REPORT_DATA_INITIAL_LOAD:
		{
     	let reportData = action.payload.val();
     	let serieIncassi = action.payload.val().serieIncassi;
       let serieIncassiMesi = action.payload.val().serieIncassiMesi;
       let serieIncassiAnni = action.payload.val().serieIncassiAnni;
       let top5thisYear = action.payload.val().top5thisYear;
       let top5lastYear = action.payload.val().top5lastYear;
       let top5lastMonth =  action.payload.val().top5lastMonth;
       
     	return {
        ...state, reportData: reportData, serieIncassi: serieIncassi, serieIncassiMesi: serieIncassiMesi, serieIncassiAnni: serieIncassiAnni, top5thisYear: top5thisYear, top5lastYear: top5lastYear, top5lastMonth: top5lastMonth
      };
		}
	case REPORT_DATA_CALCULATED:
		return state;
    default:
      return state;
  }
}

export const getSerieIncassi = (state) => {return state.serieIncassi};
export const getSerieIncassiMesi = (state) => {return state.serieIncassiMesi};  
export const getSerieIncassiAnni = (state) => {return state.serieIncassiAnni};  
export const getTop5thisYear = (state) => {return state.top5thisYear};  
export const getTop5lastYear = (state) => {return state.top5lastYear};  
export const getTop5lastMonth = (state) => {return state.top5lastMonth};  

export const isWaitingForData = (state) => {return state.waitingForData};


