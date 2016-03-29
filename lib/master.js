const Terminal = require('./CLI/Terminal.view.js');
const applications = require('./Applications/_index.js');

$(document).ready(function() {
  // Kill Opera's backspace keyboard action.
  document.onkeydown = document.onkeypress = function(e) { return $.hotkeys.specialKeys[e.keyCode] != 'backspace'; };
  Terminal.init();
  applications.forEach(function (App) {
    let app = new App();
    Terminal.output.register(app.getName(), app.getHandler());
  });
  window.Terminal = Terminal;
});