const Application = require('../CLI/Application');

class CAT extends Application {
  constructor() {
    super();
    this.name = "cat";
    this.usage = "&lt;key&gt;";
    this.desc = "log the value of the given storage key";
  }
  getHandler() {
    /**
     * @function handler
     */
    return function handler(name, key) {
      // Fetch from localStorage
      let value = localStorage.getItem(key);
      // Log value
      this.print(value);
    };
  }
  help(terminal) {
    terminal.print($("<span><span class='green'>cat</span> <b>storage-key</b></span>"));
  }
}

module.exports = CAT;