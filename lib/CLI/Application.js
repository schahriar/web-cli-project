const noop = () => {};

class Application {
  constructor() {
    this.handler = noop;  
  }
  setHandler(func) {
    this.handler = func;
  }
  store(key, value) {
    window.localStorage.setItem("@Terminal::Storage::" + key, JSON.stringify(value));
  }
  fetch(key) {
    return JSON.parse(window.localStorage.getItem("@Terminal::Storage::" + key));
  }
  getName() {
    return this.name;
  }
  getHandler() {
    return this.handler;
  }
  getUsage() {
    return this.usage;
  }
  getDesc() {
    return this.desc;
  }
  call(argv, terminal) {
    // Handle Help's special case
    if (((argv[1] || "").toLowerCase() === 'help') && (typeof this.help === 'function')) {
      this.help(terminal);
    } else {
      this.getHandler().apply(terminal, argv);
    }
  }
}

module.exports = Application;