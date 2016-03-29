const Terminal = require('./CLI/Terminal.view.js');

$(document).ready(function() {
  // Kill Opera's backspace keyboard action.
  document.onkeydown = document.onkeypress = function(e) { return $.hotkeys.specialKeys[e.keyCode] != 'backspace'; };
  Terminal.init();
  window.Terminal = Terminal;
});