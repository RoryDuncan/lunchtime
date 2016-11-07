const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const _ = require('lodash')
const config = require('./src/config')
const commands = require('./src/commands')
const helpCommand = require('./src/commands/help')

let bot = require('./src/bot')

let app = express()

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.send('\n 👋 🌍 \n') })
app.get('/places', (req, res) => {
  
});

app.post('/commands/:command', (req, res) => {
  let payload = req.body
  var command = req.params.command || "help";

  if (!payload || payload.token !== config('SLACK_TOKEN')) {
    let err = 'An invalid slash token was provided\n' +
              '   Is your Slack slash token correctly configured?'
    console.log(err)
    res.status(401).end(err)
    return
  }

  let cmd = commands[command];
  cmd.handler(payload, req, res)
})

app.listen(config('PORT'), (err) => {
  if (err) throw err

  console.log("Running Server")

  if (config('SLACK_TOKEN')) {
    
    // disable bot, for now
    // console.log("Bot Listening")
    // bot.listen({ token: config('SLACK_TOKEN') })
    
  }
})
