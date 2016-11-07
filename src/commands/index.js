const _ = require('lodash')
const fs = require('fs')


const commands = {};

// adds all the files in this folder as an available command
fs.readdirSync(__dirname).forEach((file, i) => {
  let command = file.split(".js")[0];
  if (file !== 'index.js') commands[command] = (require(`./${file}`))
});

module.exports = commands