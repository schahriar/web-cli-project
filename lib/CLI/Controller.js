const Map = require('../Utilities/Map')();
const Application = require('./Application');

class Controller {
  constructor() {
    this.map = new Map();
  }
  register(name, func) {
    let application = new Application();
    application.setHandler(func);
    this.map.set(name, application);
    return application; 
  }
  listApplications() {
    this.map.forEach((command, name) => {
      
    });
  }
  process(terminal, command) {
    // Parse argv
    let argv = command.split(' ');
    let key = argv[0];
    // Ensure command exists
    if (!this.map.has(key)) {
      terminal.print(`\`${command}\` not recognized as an internal command or application!`);
      return;
    }
    
    // Invoke command function
    this.map.get(key).call(argv, terminal);
  }
}

module.exports = Controller;