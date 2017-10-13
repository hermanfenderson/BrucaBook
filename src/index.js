import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'semantic-ui-css/semantic.min.css';

import App from './containers/App';
import Home from './containers/Home';
import Signup from './containers/Signup';
import Login from './containers/Login';
import GestioneBollaOld from './containers/GestioneBollaOld';
import GestioneBolla from './scenes/bolla';

import GestioneScontrino from './containers/GestioneScontrino';
import GestioneItemCatalog from './containers/GestioneItemCatalog';

import RequireAuth from './containers/RequireAuth';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
   <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="signup" component={Signup} />
        <Route path="login" component={Login} />
         <Route path="cassa/:idCassa/:idScontrino" component={RequireAuth(GestioneScontrino)} />
{
/*
         <Route path="cassa/:idCassa" component={RequireAuth(GestioneCassa)} />
*/
}
         <Route path="bolla/:id" component={RequireAuth(GestioneBolla)} />
         <Route path="bollaold/:id" component={RequireAuth(GestioneBollaOld)} />
        <Route path="itemCatalogo" component={RequireAuth(GestioneItemCatalog)} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
