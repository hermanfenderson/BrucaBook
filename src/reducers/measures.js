import { STORE_MEASURE, REMOVE_MEASURE } from '../actions';

const initialState =  {
 measures: {}
};

export default function measures(state = initialState, action) {
  switch (action.type) {
    case STORE_MEASURE:
       var newMeasures = {...state['measures']};
       console.log(action.newMeasure.name);
       newMeasures[action.newMeasure.name] = action.newMeasure.number;
         return {
        ...state, measures: newMeasures
      };
  
    case REMOVE_MEASURE:
      var newMeasures = {...(state['measures'])};
      delete newMeasures[action.measureName];
      return {
        ...state, measures: newMeasures
      };
    default:
      return state;
  }
}