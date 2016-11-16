
const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'
const firebase = require('firebase');
if (ENV === 'development') {
  dotenv.load()
  console.log("loading development environment")
}



const config = {
  FIREBASE_KEY: process.env.FIREBASE_KEY,
  FIREBASE_NAME: process.env.FIREBASE_NAME,
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PROXY_URI: process.env.PROXY_URI,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  SLACK_COFFEE_TOKEN: process.env.SLACK_COFFEE_TOKEN,
  ICON_EMOJI: ':fork_and_knife:'
}

// Initialize Firebase
const fireApp = firebase.initializeApp({
  apiKey: config.FIREBASE_KEY,
  databaseURL: `https://${config.FIREBASE_NAME}.firebaseio.com`,
});


config.firebase = firebase;


module.exports = (key) => {
  if (!key) return config

  return config[key]
}