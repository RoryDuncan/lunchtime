
const config = require('../config')
const _ = require('lodash')
const firebase = require('firebase');

// Initialize Firebase
const fireApp = firebase.initializeApp({
  apiKey: config.FIREBASE_KEY,
  databaseURL: `https://${config("FIREBASE_NAME")}.firebaseio.com`,
});
const firedb = fireApp.database();
const ref = firedb.ref("coffee")
const msgDefaults = {
  response_type: 'in_channel',
  username: 'Coffee Suggestion',
  icon_emoji: "coffee"
}

const randomInt = (ceil) => {
  return ~~(Math.random() * ceil)
}

var lastPicked = null;
const suggestions = {
  
  // retrieves a single random suggestion
  getOne: (payload, req, res) => {
    res.set('content-type', 'application/json')
    let msg = _.defaults({}, msgDefaults);
    let q = ref.once('value')
    q.then((snapshot) => {
      
      if (!snapshot) return res.status(200).json({text: "No Options in database"});
        let options = snapshot.val();
        
        if (lastPicked == null) {
          lastPicked = randomInt(options.length)
        }
        let index = lastPicked;
        
        
        do {
          index = randomInt(options.length)
        } while (index == lastPicked);
        
        lastPicked = index;
        let suggestion = options[index]
        msg.text = `${suggestion}!`
        res.status(200).json(msg);
    })
  },
  
  // add a new option
  add: (payload, req, res) => {
    res.set('content-type', 'application/json')
    let msg = {
      text: "Unable to added new option.."
    };
    
    let newOption = payload.text.substring(3).trim()
    if (newOption.length < 2) {
      msg.text = "...was that an accident?"
      return res.status(200).json(msg);
    }
    let q = ref.once('value')
    q.then((snapshot) => {
      if (snapshot == null) {
        msg.text = "There was a problem accessing the list of options"
        return res.status(200).json(msg);
      }
      
      let options = snapshot.val();
      if (options.indexOf(newOption) >= 0) {
        msg.text = `${newOption} was already an option.`
        return res.status(200).json(msg);
      }
      let nextIndex = options.length
      let newEntry = {}
      newEntry[nextIndex] = newOption;
      ref.update(newEntry)
      msg.text = `${newOption} has been added [${nextIndex}]!`
      res.status(200).json(msg);
    })
  },
  
  list: (payload, req, res) => {
    res.set('content-type', 'application/json')
    let msg = {};
    let q = ref.once('value').then((snapshot) => {
      if (snapshot == null) {
        msg.text = "There are no options"
        return res.status(200).json(msg);
      }
      let options = snapshot.val()
      msg.text = "Here are your options: \n\n\t" + options.join("\n\t")
      return res.status(200).json(msg);
    })
  }
  
}



const handler = (payload, req, res) => {
  if (payload.text.length == 0) return suggestions.getOne(payload, req, res)
  if (payload.text.includes("add")) suggestions.add(payload, req, res);
  if (payload.text.includes("list")) suggestions.list(payload, req, res);
}

module.exports = { 
  pattern: /coffee/ig, 
  handler: handler
}