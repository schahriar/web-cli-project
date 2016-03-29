const noop = () => {};

class Application {
  constructor() {
    this.handler = noop;  
  }
  setHandler(func) {
    this.handler = func;
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