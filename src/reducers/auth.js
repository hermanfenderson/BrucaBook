import { AUTH_USER,  AUTH_ERROR} from '../actions';

const initialState =  {
  error: null,
 };

export default function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        error: null,
      };
     case AUTH_ERROR:
      return {
        ...state,
        error: action.payload.message
      };
      
    default:
      return state;
  }
}