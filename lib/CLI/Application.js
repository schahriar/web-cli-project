// Simple No Operation (noop) function
const noop = () => {};

/**
 * Creates a new application with storage, invocation & help
 * @class Application
 * 
 * @description Applications are first-class commands in the Web command-line interface
 * and are invoked with commands such as `ls -a` similar to a Unix CLI. Each application
 * is responsible for attaching 3 variables to the instance in the constructor, `name`
 * will represent application name and its command, `usage` describes a sample usage and
 * `desc` describes the purpose of the application. A `handler` function is essential to
 * the execution of the application and is a must but alternatively `getHandler` method
 * can be overriden to return a handler function. A method `help` is an optional function
 * for displaying the help context of the app and may be implemented internally.
 */
class Application {
  constructor() {
    // Init handler
    this.handler = noop;  
  }
  /* - SETTERS - */
  setHandler(func) {
    this.handler = func;
  }
  /* - ------- - */
  /**
   * @method store
   * @param {string} key
   * @param {Object} value
   * @description Stores a key, value combination in a namespaced part of localStorage
   */
  store(key, value) {
    window.localStorage.setItem("@Terminal::Storage::" + key, JSON.stringify(value));
  }
  /**
   * @method fetch
   * @param {string} key
   * @description Fetches the value of a key from the namespaced storage
   */
  fetch(key) {
    return JSON.parse(window.localStorage.getItem("@Terminal::Storage::" + key));
  }
  /* - GETTERS - */
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
  /* - ------- - */
  /**
   * @method call
   * @param {array} argv - Argument vector similar to Unix's argv
   * @param {Terminal} terminal - CLI View instance
   * @description Passes a routed command to the handler function
   */
  call(argv, terminal) {
    // Handle Help's special case
    if (((argv[1] || "").toLowerCase() === 'help') && (typeof this.help === 'function')) {
      // Display help
      this.help(terminal);
    } else {
      // Call handler
      this.getHandler().apply(terminal, argv);
    }
  }
}

module.exports = Application;