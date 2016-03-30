const Application = require('../CLI/Application');
const NestClientID = "3b0cea1d-8ff8-405f-a673-57e8e41a4d7d";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
 
class Link extends Application {
  constructor() {
    super();
    this.name = "link";
    this.usage = "&lt;service&gt;";
    this.desc = "Links application to a given service";
  }
  _constructFrame() {
    this._frame = this._frame || $('<div class="frame"></div>');
    return this._frame; 
  }
  /**
   * @method awaitResponse
   * @param {Terminal} terminal - an instance of Terminal View
   * @param {string} token - OAuth2 client token
   * @param {string} service - Service name (e.g. Nest)
   * @description Awaits for an OAuth2 callback and restores application state
   * to continue from the response
   */
  awaitResponse(terminal, token, service) {
    // Create a new frame element
    const ConstructFrame = this._constructFrame.bind(this);
    const frame = ConstructFrame();
    
    // Construct common terminate function (removes widget)
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
        logNode.addClass(frame.hasClass('success')?'green':(frame.hasClass('error')?'red':'yellow'));
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
      // Print frame
      terminal.print(frame);
      
      setTimeout(() => {
        // Animate frame to indeterminate status
        frame.addClass('indeterminate status');
      }, 100);
      // Set frame status text (this will probably disappear really fast depending on connection speed)
      frame.text(`Verifying OAuth2 Token with ${capitalizeFirstLetter(service || "service")}.`);
      
      // Connect to back-end and convert client token to access_token
      $.get({
        url: `/get_token/${service}?code=${token}`,
        dataType: "json",
        success: (response) => {
          // Handle/Log response errors
          if (response.error) {
            frame.removeClass('indeterminate').addClass('error');
            frame.text(response.error);
            return terminate();
          }
          // Parse access_token out of response
          let access_token = response.access_token;
          // Set widget state to `success`
          frame.removeClass('indeterminate').addClass('success');
          // Set widget status text
          frame.text(`Successfully linked to ${capitalizeFirstLetter(service || "service")}...`);
          
          // Store access_token in Application storage
          this.store(`@Link::access_token::${service}`, access_token);
          
          // Remove widget
          terminate();
        },
        error: function (xhr, status) {
          // Handler/Log connection errors
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
        auth: "http://home.nest.com/login/oauth2?client_id=" + NestClientID + "&state=AWAIT:LINK:NEST"
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
      if (hasAccessToken(service)) return this.print(`Service \`${service}\` is already linked. Try \`unlink ${service}\` to unlink service and relink again.`);
      
      // Take a copy of terminal state
      // The state is restored after OAuth2 Callback
      this.saveState();
      
      // Set to working
      this.setWorking(true);
      this.setPromptActive(false);
      
      // Construct a new frame View
      const frame = ConstructFrame();

      // Create a new Sandboxed Iframe
      const iframe = $('<iframe src="'+ OAuth2[service].auth +'" sandbox="allow-scripts allow-top-navigation allow-forms allow-same-origin"></iframe>');
      // iframe styling //
      iframe.css({
        width: 500,
        height: 500,
        borderRadius: 10
      });
      iframe.load(() => {
        iframe.animate({ width: 500, height: 550 });
      });
      // -------------- //
      
      // Append iframe to frame
      frame.append(iframe);
      // Print frame to Terminal View
      this.print(frame);
    };
  }
  help(terminal) {
    terminal.print($("<span><span class='green'>link</span> <b>service-name</b></span>"));
  }
}

module.exports = Link;