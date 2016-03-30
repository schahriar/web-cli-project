const Application = require('../CLI/Application');

class LS extends Application {
  constructor() {
    super();
    this.name = "ls";
    this.usage = "-a";
    this.desc = "Lists all keys stored in Terminal storage";
  }
  getHandler() {
    /**
     * @function handler
     */
    return function handler(name, tag) {
      let i = 0;
      for (i = 0; i < window.localStorage.length; i++){
        let key = localStorage.key(i);
        // Skip items without @Terminal prefix
        if (key.substring(0, 11) !== "@Terminal::") continue;
        // Hide internal keys unless -a is set
        if ((key.substring(0, 20) !== "@Terminal::Storage::") && (tag !== '-a')) continue;
        
        // Log key
        this.print(key);
      }
    };
  }
  help(terminal) {
    terminal.print($("<span class='green'>ls</span>"));
  }
}

module.exports = LS;