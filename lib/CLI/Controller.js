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
  listCommands() {
    this.map.forEach((command, name) => {
      
    });
  }
  process(terminal, command) {
    // Parse argv
    let argv = command.split(' ');
    let key = argv[0];
    // Ensure command exists
    if (!this.map.has(key)) return;
    
    // Invoke command function
    this.map.get(key).call(argv, terminal);
  }
}

module.exports = Controller;