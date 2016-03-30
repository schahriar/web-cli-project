// Map & Polyfill
const Map = require('../Utilities/Map')();

/**
 * High-level CLI controller that stores applications and interacts with Terminal View
 * @class Controller
 * 
 * @description Controller is a manager that sits on top of Terminal View and powers
 * applications and command routing. Applications are mapped and called according top
 * their internal call method.
 */
class Controller {
  constructor() {
    this.map = new Map();
  }
  /**
   * @method register
   * @param {Application} app - An instance of an application
   * @description Maps an application based on `getName` method of that application
   */
  register(app) {
    this.map.set(app.getName(), app);
    return app; 
  }
  /**
   * @method getApplication
   * @param {string} name
   * @description Returns instance of mapped application
   */
  getApplication(name) {
    return this.map.get(name);
  }
  /**
   * @method listApplications
   * @param {function} callback
   * @description Calls the callback n number of times per each registered application
   */
  listApplications(callback) {
    this.map.forEach(callback);
  }
  /**
   * @method process
   * @param {Terminal} terminal - an instance of Terminal View
   * @param {string} command - full command
   * @description A simple command router that supports a `help` case. It parses arguments
   * into an argument vector `argv` and routes the command to a corresponding application
   * or logs an error.
   */
  process(terminal, command) {
    // Parse argv
    let argv = command.split(' ');
    let key = argv[0];
    
    // Handle help's special case
    if (key === 'help') {
      // Header
      terminal.print($("<br><b>List of installed applications</b><br><span>-------------</span><br>"));
      // Usage of each application
      this.listApplications((app) => {
        terminal.print($(`<span class="green">${app.getName()}</span> <i>${app.getUsage()}</i><span class="dim"> → ${app.getDesc()}</span><br>`));
      });
      // EOL
      terminal.print();
      return;
    }
    
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