import {GET_REPORT_DATA, RESET_LISTENING_DASHBOARD} from '../actions/dashboard';

const initialState =  {
 serieIncassi: [],
 serieIncassiMesi: [],
 serieIncassiAnni: [],
 top5thisYear: [],
 top5lastYear: [],
 top5lastMonth: [],
 
 
 listening: false,
};

export default function dashboard(state = initialState, action) {
  switch (action.type) {
    
    case RESET_LISTENING_DASHBOARD: 
      return {...state, listening: false};
      
     case GET_REPORT_DATA:
     	let reportData = action.payload.val();
     	let serieIncassi = action.payload.val().serieIncassi;
       let serieIncassiMesi = action.payload.val().serieIncassiMesi;
       let serieIncassiAnni = action.payload.val().serieIncassiAnni;
       let top5thisYear = action.payload.val().top5thisYear;
       let top5lastYear = action.payload.val().top5lastYear;
       let top5lastMonth =  action.payload.val().top5lastMonth;
       
     	return {
        ...state, reportData: reportData, serieIncassi: serieIncassi, serieIncassiMesi: serieIncassiMesi, serieIncassiAnni: serieIncassiAnni, top5thisYear: top5thisYear, top5lastYear: top5lastYear, top5lastMonth: top5lastMonth, listening: true
      };
		
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

export const isListeningReportData = (state) => {return state.listening};


