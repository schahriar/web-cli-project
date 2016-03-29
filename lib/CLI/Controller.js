const Map = require('../Utilities/Map');
const Command = require('./Command');

class Controller {
  constructor() {
    this.map = new Map();
  }
  createCommand(command, func) {
    let commandObject = new Command();
    commandObject.setHandler(func);
    this.map.set(command, commandObject);
    return commandObject; 
  }
}

module.exports = Controller;