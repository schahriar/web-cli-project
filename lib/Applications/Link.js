const Firebase = require('../firebase.js');
const Application = require('../CLI/Application');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
 
class Link extends Application {
  constructor() {
    super();
    this.name = "link";
  }
  _constructFrame() {
    this._frame = this._frame || $('<div class="frame"></div>');
    return this._frame; 
  }
  awaitResponse(terminal, token, service) {
    // Create a new frame element
    const ConstructFrame = this._constructFrame.bind(this);
    const frame = ConstructFrame();
    
    // Construct common terminate function
    const terminate = () => {
      // Reset terminal state to accept prompt
      terminal.setWorking(false);
      terminal.setPromptActive(true);
      
      // Clean Query & State from URL
      history.pushState('data', '', window.location.protocol + '//' + window.location.host + window.location.pathname);
      
      // Delay widget exit
      setTimeout(() => {
        // Flatten down widget to log
        let logNode = $('<span></span>');
        logNode.html(frame.html());
        frame.addClass('flat');
        // Apply color to log
        logNode.css({
          color: frame.hasClass('success')?'green':(frame.hasClass('error')?'red':'yellow')
        });
        setTimeout(() => {
          // Print log and remove widget
          terminal.print(logNode);
          frame.remove();
        }, 500);
      }, 5000);
    };
    setTimeout(() => {
      // Set to working
      terminal.setWorking(true);
      terminal.setPromptActive(false);
      terminal.print(frame);
      setTimeout(() => {
        frame.addClass('indeterminate status');
      }, 100);
      frame.text(`Verifying OAuth2 Token with ${capitalizeFirstLetter(service || "service")}.`);
      $.get({
        url: "/get_token?code=" + token,
        dataType: "json",
        success: (response) => {
          if (response.error) {
            frame.removeClass('indeterminate').addClass('error');
            frame.text(response.error);
            return terminate();
          }
          let access_token = response.access_token;
          frame.removeClass('indeterminate').addClass('success');
          frame.text(`Successfully linked to ${capitalizeFirstLetter(service || "service")}...`);
          
          this.store(`@Link::access_token::${service}`, access_token);
          
          terminate();
        },
        error: function (xhr, status) {
          frame.removeClass('indeterminate').addClass('error');
          frame.text("Failed to connect");
          return terminate();
        }
      });
    }, 10);
  }
  getHandler() {
    const OAuth2 = {
      nest: {
        auth: "http://home.nest.com/login/oauth2?client_id=3b0cea1d-8ff8-405f-a673-57e8e41a4d7d&state=AWAIT:LINK:NEST"
      }
    };
    const validServices = ['nest'];
    const ConstructFrame = this._constructFrame.bind(this);
    const hasAccessToken = (service) => {
      // Fetch and covert to bool
      return !!this.fetch("@Link::access_token::" + service);
    };
    /**
     * @function handler
     * @param {string} service - Name of the service to link to (e.g. `link nest`)
     */
    return function handler(name, service) {
      if ((!service) || (validServices.indexOf(service) === -1)) return this.print("Link requires a valid service name.", service);
      
      if (!OAuth2[service]) return this.print(`Service \`${service}\` is not valid.`);
      
      // Check whether we already have an access_token
      if (hasAccessToken(service)) return this.print(`Service \`${service}\` is already linked.`);
      
      // Take a copy of terminal state
      // The state is restored after OAuth2 Callback
      this.saveState();
      
      // Set to working
      this.setWorking(true);
      this.setPromptActive(false);
      
      const frame = ConstructFrame();

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
}

module.exports = Link;