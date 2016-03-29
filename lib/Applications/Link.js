class Link {
const Application = require('../CLI/Application');
 
class Link extends Application {
  constructor() {
    super();
    this.name = "link";
    const validServices = ['nest'];
    /**
     * @function handler
     * @param {string} service - Name of the service to link to (e.g. `link nest`)
     */
    this.handler = function handler(name, service) {
      if ((!service) || (validServices.indexOf(service) === -1)) return this.print("Link requires a valid service name.", service);
    };
  }
  getName() {
    return this.name;
  }
  getHandler() {
    return this.handler;
  }
}

module.exports = Link;