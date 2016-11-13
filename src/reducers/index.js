import { combineReducers } from 'redux';
import AuthReducer from './auth';
import GifsReducer from './gifs';
import ModalReducer from './modal';
import BolleReducer from './bolle';

import { reducer as FormReducer } from 'redux-form';

const rootReducer = combineReducers({
  auth: AuthReducer,
  bolle: BolleReducer,
  form: FormReducer,
  gifs: GifsReducer,
  modal: ModalReducer
});

export default rootReducer;