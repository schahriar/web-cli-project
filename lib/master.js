const Terminal = require('./CLI/Terminal.view.js');
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

$(document).ready(function() {
  // Kill Opera's backspace keyboard action.
  document.onkeydown = document.onkeypress = function(e) { return $.hotkeys.specialKeys[e.keyCode] != 'backspace'; };
  applications.forEach(function (App) {
    let app = new App();
    Terminal.output.register(app);
  });
  window.Terminal = Terminal;
  // Reload back to previous state from callbacks
  let state = (getParameterByName('state') || "").split(':');
  if ((state.length > 1) && (state[0] === 'AWAIT')) {
    let app = Terminal.output.getApplication(state[1].toLowerCase());

    if (!app || (typeof app.awaitResponse !== 'function')) return;
    
    // Restore terminal state
    Terminal.restoreState();
    app.awaitResponse(Terminal, getParameterByName('code'), state[2].toLowerCase());
  } else {
    let time = new Date();
    // Display welcome message
    Terminal.print("------------------------------------------");
    Terminal.print("| Welcome to Web Terminal                |");
    Terminal.print(`| Connected at - ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
    Terminal.print($('<span>| Try <span class="green">link</span> <b>nest</b> or <span class="green">help</span>                  |</span>'));
    Terminal.print("------------------------------------------");
    Terminal.print("");
  }
  Terminal.init();
});