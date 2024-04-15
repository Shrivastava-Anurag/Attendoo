import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store} from './app/store';
import { Provider } from 'react-redux';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from "redux-persist";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <Provider store = {store}>
    <PersistGate loading={null} persistor={persistStore(store)}>
      <App />
    </PersistGate>
  </Provider>
  </React.StrictMode>
);

