import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Firebase, { FirebaseContext } from './server';

import { initialState } from './sesion/initialState';
import { StateProvider } from './sesion/store';
import sesionReducer from './sesion/reducers/sesionReducer';
import { mainReducer } from './sesion/reducers';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <StateProvider initialState={initialState} reducer={mainReducer}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </StateProvider>
  </FirebaseContext.Provider>
  , document.getElementById('root')
);
/*
if(firebase.messagingValidation.isSupported()){

  if("serviceWorker" in navigator){
      navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then(registration => {
              console.log("Registracion completa en el service worker", registration.scope);
          })
          .catch(err =>{
              console.log("Fallo en registrar en el service worker")
          })
  }

}
*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
