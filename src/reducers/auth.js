import { AUTH_USER, SIGN_OUT_USER, AUTH_ERROR, AUTH_INFO_RECEIVED} from '../actions';

const initialState =  {
  authenticated: false,
  error: null,
  auth_info: false
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        authenticated: true,
        error: null,
      };
    case SIGN_OUT_USER:
      return {
        ...state,
        authenticated: false,
        error: null
      };
    case AUTH_ERROR:
      return {
        ...state,
        error: action.payload.message
      };
       case AUTH_INFO_RECEIVED:
      return {
        ...state,
        auth_info: true
      };
    default:
      return state;
  }
}