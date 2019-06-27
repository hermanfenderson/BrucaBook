import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist'
import {config} from './firebase';

import rootReducer from '../reducers';
import Firebase from 'firebase';

export var persistor;



Firebase.initializeApp(config);

export function purgeLocalStorage()
{
	persistor.purge();
}

export function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose (
      applyMiddleware(reduxThunk),
      autoRehydrate(),
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f 
      //window.devToolsExtension ? window.devToolsExtension() : f => f      
    )
  );
  
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

 // store.dispatch(Actions.verifyAuth()); Probabilmente qui non serve più
  persistor = persistStore(store,{whitelist: ['status']}); //Stato dell'app per bootstrap in caso di refresh
  return store;
}

