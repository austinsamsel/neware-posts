import firebase from 'firebase'

var config = {
  apiKey: process.env.NEP_API_KEY,
  authDomain: process.env.NEP_AUTH_DOMAIN,
  databaseURL: process.env.NEP_DATABASE_URL,
  storageBucket: process.env.NEP_STORAGE_BUCKET
}
firebase.initializeApp(config)
