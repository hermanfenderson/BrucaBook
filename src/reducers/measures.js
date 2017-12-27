import { STORE_MEASURE, REMOVE_MEASURE } from '../actions';

const initialState =  {
 measures: {}
};

export default function measures(state = initialState, action) {
  switch (action.type) {
    case STORE_MEASURE:
       var newMeasures = {...state['measures']};
       newMeasures[action.newMeasure.name] = action.newMeasure.number;
         return {
        ...state, measures: newMeasures
      };
  
    case REMOVE_MEASURE:
      var newMeasures2 = {...(state['measures'])};
      delete newMeasures2[action.measureName];
      return {
        ...state, measures: newMeasures2
      };
    default:
      return state;
  }
}

export const getMeasures = (state) => {return state.measures};
 