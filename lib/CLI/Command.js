const noop = () => {};

class Command {
  constructor() {
    this.handler = noop;    
  }
  setHandler(func) {
    this.handler = func;
  }
  call(...argv) {
    this.handler(...argv);
  }
}

module.exports = Command;