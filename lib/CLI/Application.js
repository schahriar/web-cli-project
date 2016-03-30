const noop = () => {};

class Application {
  constructor() {
    this.handler = noop;  
  }
  setHandler(func) {
    this.handler = func;
  }
  store(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  fetch(key) {
    return JSON.parse(window.localStorage.getItem(key));
  }
  getName() {
    return this.name;
  }
  getHandler() {
    return this.handler;
  }
  call(argv, terminal) {
    this.getHandler().apply(terminal, argv);
  }
}

module.exports = Application;