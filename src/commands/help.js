const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'Lunch',
  icon_emoji: config('ICON_EMOJI')
}

let attachments = [
  {
    title: 'Discover lunch for today',
    color: '#2FA44F',
    text: '`/lunch` returns a lunch suggestion',
    mrkdwn_in: ['text']
  },
  {
    title: 'Configuring /lunch',
    color: '#E3E4E6',
    text: '`/lunch help` Shows helpful things',
    mrkdwn_in: ['text']
  }
]

const handler = (payload, req, res) => {
  let msg = _.defaults({
    channel: payload.channel_name,
    attachments: attachments
  }, msgDefaults)

  res.set('content-type', 'application/json')
  res.status(200).json(msg)
  return
}

module.exports = { pattern: /help/ig, handler: handler }