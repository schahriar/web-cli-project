const Map = require('../Utilities/Map')();

class Controller {
  constructor() {
    this.map = new Map();
  }
  register(app) {
    this.map.set(app.getName(), app);
    return app; 
  }
  getApplication(name) {
    return this.map.get(name);
  }
  listApplications(callback) {
    this.map.forEach(callback);
  }
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
        terminal.print($(`<span class="green">${app.getName()}</span> <i>${app.getUsage()}</i>`));
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