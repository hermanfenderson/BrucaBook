import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist'


import rootReducer from '../reducers';
import Firebase from 'firebase';

var persistor;

const config = {
 apiKey: "AIzaSyAfrGzYIIRlmtN50IiChv8raxSKve-a0Sc",
    authDomain: "brucabook.firebaseapp.com",
    databaseURL: "https://brucabook.firebaseio.com",
    storageBucket: "brucabook.appspot.com",
    messagingSenderId: "684965752152"
};

Firebase.initializeApp(config);

export function purgeLocalStorage()
{
	console.log("sono qui");
	persistor.purge();
}

export function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose (
      applyMiddleware(reduxThunk),
      autoRehydrate(),
      window.devToolsExtension ? window.devToolsExtension() : f => f      
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

