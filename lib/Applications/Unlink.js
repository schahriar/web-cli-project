const Application = require('../CLI/Application');

class CAT extends Application {
  constructor() {
    super();
    this.name = "unlink";
    this.usage = "&lt;service&gt;";
    this.desc = "Unlink from a given service";
  }
  getHandler() {
    const fetchFromStore = (key) => { return this.fetch(key); };
    /**
     * @function handler
     */
    return function handler(name, service) {
      // Make sure service is linked
      if (!fetchFromStore(`@Link::access_token::${service}`)) {
        return this.print($("<span class='yellow'>Service wasn't linked.</span>"));
      }
      // Remove from localStorage
      localStorage.removeItem(`@Terminal::Storage::@Link::access_token::${service}`);
      // Log
      this.print($("<span class='green'>Successfully unlinked service.</span>"));
    };
  }
  help(terminal) {
    terminal.print($("<span><span class='green'>unlink</span> <b>service-name</b></span>"));
  }
}

module.exports = CAT;