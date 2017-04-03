import {AuthProviders, AuthMethods} from "angularfire2";

export const FIREBASE_CONFIG = {
  apiKey: '...',
  authDomain: '....firebaseapp.com',
  databaseURL: 'https://....firebaseio.com',
  storageBucket: '....appspot.com',
  messagingSenderId: '...'
};

export const FIREBASE_AUTH_CONFIG = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
};
