const noop = () => {};

class Application {
  constructor() {
    this.handler = noop;  
  }
  setHandler(func) {
    this.handler = func;
  }
  call(argv, terminal) {
    this.handler(argv, terminal);
  }
}

module.exports = Application;