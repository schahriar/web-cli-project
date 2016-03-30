const Terminal = require('./CLI/Terminal.view.js');

// Application Index, Imports all applications listed in './Applications/_index.js'
const applications = require('./Applications/_index.js');

// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getTimeString() {
  let str = "";
  let time = new Date();
 
  // Add leading or trailing zeroes to format time
  str += (time.getHours() < 10)?('0' + time.getHours()):time.getHours();
  str += ":";
  str += (time.getMinutes() < 10)?('0' + time.getMinutes()):time.getMinutes();
  str += ":";
  str += (time.getSeconds() < 10)?('0' + time.getSeconds()):time.getSeconds(); 
  
  return str;
}

$(document).ready(function() {
  // Kill Opera's backspace keyboard action.
  document.onkeydown = document.onkeypress = function(e) { return $.hotkeys.specialKeys[e.keyCode] != 'backspace'; };
  // Import every application in './Applications/_index.js'
  applications.forEach(function (App) {
    let app = new App();
    // Terminal.output is our controller
    // Register app with controller
    Terminal.output.register(app);
  });
  // For Debugging purposes
  window.Terminal = Terminal;
  // Reload back to previous state from callbacks
  let state = (getParameterByName('state') || "").split(':');
  // AWAIT Sequence, fundamental to OAuth2 callbacks
  if ((state.length > 1) && (state[0] === 'AWAIT')) {
    // Parse application awaiting from the query
    let app = Terminal.output.getApplication(state[1].toLowerCase());

    // Ensure application exists
    if (!app || (typeof app.awaitResponse !== 'function')) return;
    
    // Restore terminal state
    Terminal.restoreState();
    // Call application's awaiting function
    app.awaitResponse(Terminal, getParameterByName('code'), state[2].toLowerCase());
  } else {
    
    // Display welcome message
    Terminal.print("------------------------------------------");
    Terminal.print("| Welcome to Web Terminal                |");
    Terminal.print(`| Connected at - ${getTimeString()}                |`);
    Terminal.print($('<span>| Try <span class="green">link</span> <b>nest</b> or <span class="green">help</span>                  |</span>'));
    Terminal.print("------------------------------------------");
    Terminal.print("");
  }
  // Initialize Terminal View
  Terminal.init();
});