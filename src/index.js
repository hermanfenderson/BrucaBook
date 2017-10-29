import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'semantic-ui-css/semantic.min.css';

import App from './containers/App';


import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';

export const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);
