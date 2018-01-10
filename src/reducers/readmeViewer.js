import { LOAD_README, README_LOADED, SET_SHOW_MODAL } from '../actions/readmeViewer';
import {STORE_MEASURE} from '../actions';


const initialState =  {
 readme: null, 
 readmeHeight: 0,
 showModal: true,
};

export default function readmeViewer(state = initialState, action) {
  switch (action.type) {
    case LOAD_README:
         return state;
        
    case README_LOADED:
      return {
        ...state, readme: action.readme
      };
    
    case STORE_MEASURE:
   	    var measures = {...action.allMeasures};
   	    measures[action.newMeasure.name] = action.newMeasure.number;
   	    let height = (measures['viewPortHeight'] > 0 && measures['headerHeight'] > 0) ? measures['viewPortHeight'] - measures['headerHeight'] - 48 :100;
   	    let newState = {...state, readmeHeight: height};
        return newState; 
    
    case SET_SHOW_MODAL: 
    	return {
        ...state, showModal: action.showModal
    	}
    default:
      return state;
  }
}

export const getReadme = (state) => { return state.readme};
export const getReadmeHeight = (state) => { return state.readmeHeight};
export const getShowModal = (state) => {return state.showModal};