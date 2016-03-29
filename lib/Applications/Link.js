const Application = require('../CLI/Application');
 
class Link extends Application {
  constructor() {
    super();
    this.name = "link";
    const OAuth2 = {
      nest: {
        auth: "http://home.nest.com/login/oauth2?client_id=3b0cea1d-8ff8-405f-a673-57e8e41a4d7d&state=AWAIT:LINK:NEST"
      }
    };
    const validServices = ['nest'];
    /**
     * @function handler
     * @param {string} service - Name of the service to link to (e.g. `link nest`)
     */
    this.handler = function handler(name, service) {
      if ((!service) || (validServices.indexOf(service) === -1)) return this.print("Link requires a valid service name.", service);
      
      if (!OAuth2[service]) return this.print(`Service \`${service}\` is not valid.`);
      
      // Take a copy of terminal state
      // The state is restored after OAuth2 Callback
      this.saveState();
      
      // Set to working
      this.setWorking(true);
      this.setPromptActive(false);
      
      const frame = $('<div class="frame"></div>');

      const iframe = $('<iframe src="'+ OAuth2[service].auth +'" sandbox="allow-scripts allow-top-navigation allow-forms allow-same-origin"></iframe>');
      let redirects = 0;
      iframe.css({
        width: 500,
        height: 500,
        borderRadius: 10
      });
      iframe.load(() => {
        iframe.animate({ width: 500, height: 550 });
      });
      frame.append(iframe);
      this.print(frame);
    };
  }
  awaitResponse(token) {
    setTimeout(() => {
      // Set to working
      this.setWorking(true);
      this.setPromptActive(false);
    }, 100);
  }
}

module.exports = Link;