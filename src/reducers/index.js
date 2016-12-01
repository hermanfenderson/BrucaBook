import { combineReducers } from 'redux';
import AuthReducer from './auth';
import GifsReducer from './gifs';
import MeasuresReducer from './measures';

import ModalReducer from './modal';
import BolleReducer from './bolle';
import StatusReducer from './status';

import { reducer as FormReducer } from 'redux-form';

const rootReducer = combineReducers({
  auth: AuthReducer,
  bolle: BolleReducer,
  form: FormReducer,
  gifs: GifsReducer,
  measures: MeasuresReducer,
  modal: ModalReducer,
  status: StatusReducer
});

export default rootReducer;