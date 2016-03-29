const noop = () => {};

class Command {
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

module.exports = Command;