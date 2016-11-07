
const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

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
  ICON_EMOJI: ':fork_and_knife:'
}

module.exports = (key) => {
  if (!key) return config

  return config[key]
}