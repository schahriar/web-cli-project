const noop = () => {};

class Application {
  constructor() {
    this.handler = noop;  
  }
  setHandler(func) {
    this.handler = func;
  }
  call(argv, terminal) {
    this.handler.apply(terminal, argv);
  }
}

module.exports = Application;