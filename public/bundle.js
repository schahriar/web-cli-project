(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const noop = () => {};

class Application {
  constructor() {
    this.handler = noop;  
  }
  setHandler(func) {
    this.handler = func;
  }
  call(argv, terminal) {
    this.handler.apply(terminal, argv);
  }
}

module.exports = Application;
},{}],2:[function(require,module,exports){
(function (process){
const Map = require('../Utilities/Map')();
const Application = require('./Application');

class Controller {
  constructor() {
    this.map = new Map();
  }
  register(name, func) {
    let application = new Application();
    application.setHandler(func);
    this.map.set(name, application);
    return application; 
  }
  listApplications() {
    this.map.forEach((command, name) => {
      
    });
  }
  process(terminal, command) {
    // Parse argv
    let argv = command.split(' ');
    let key = argv[0];
    // Ensure command exists
    if (!this.map.has(key)) {
      terminal.print(`\`${command}\` not recognized as an internal command or application!`);
      return;
    }
    
    // Invoke command function
    this.map.get(key).call(argv, terminal);
  }
}

module.exports = Controller;
}).call(this,require('_process'))
},{"../Utilities/Map":5,"./Application":1,"_process":7}],3:[function(require,module,exports){
/*!
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(jQuery){
	
	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},
	
		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}
		
		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" ");
	
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				 event.target.type === "text") ) {
				return;
			}
			
			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}
			
			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( jQuery );
},{}],4:[function(require,module,exports){
/* 	
 Client-side logic for Wordpress CLI theme
 R. McFarland, 2006, 2007, 2008
 http://thrind.xamai.ca/
 
 jQuery rewrite and overhaul
 Chromakode, 2010
 http://www.chromakode.com/
*/

/**** start from http://snippets.dzone.com/posts/show/701 ****/
// Removes leading whitespaces
function ltrim(value) {
  if (value) {
    var re = /\s*((\S+\s*)*)/;
    return value.replace(re, '$1');
  }
  return '';
}

// Removes ending whitespaces
function rtrim(value) {
  if (value) {
    var re = /((\s*\S+)*)\s*/;
    return value.replace(re, '$1');
  }
  return '';
}

// Removes leading and ending whitespaces
function trim(value) {
  if (value) {
    return ltrim(rtrim(value));
  }
  return '';
} /**** end from http://snippets.dzone.com/posts/show/701 ****/

function entityEncode(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/  /g, ' &nbsp;');
  if (/msie/i.test(navigator.userAgent)) {
    str = str.replace('\n', '&nbsp;<br />');
  } else {
    str = str.replace(/\x0D/g, '&nbsp;<br />');
  }
  return str;
}

const Hotkeys = require('./Terminal.hotkeys.js');
const Controller = require('./Controller.js');

var Terminal = {
  buffer: '',
  pos: 0,
  history: [],
  historyPos: 0,
  promptActive: true,
  cursorBlinkState: true,
  _cursorBlinkTimeout: null,
  spinnerIndex: 0,
  _spinnerTimeout: null,

  output: new Controller(),

  config: {
    scrollStep: 20,
    scrollSpeed: 100,
    bg_color: '#000',
    fg_color: '#FFF',
    cursor_blink_time: 700,
    cursor_style: 'block',
    prompt: 'guest@terminal:/$ ',
    spinnerCharacters: ['[   ]', '[.  ]', '[.. ]', '[...]'],
    spinnerSpeed: 250,
    typingSpeed: 50
  },

  sticky: {
    keys: {
      ctrl: false,
      alt: false,
      scroll: false
    },

    set: function(key, state) {
      this.keys[key] = state;
      $('#' + key + '-indicator').toggle(this.keys[key]);
    },

    toggle: function(key) {
      this.set(key, !this.keys[key]);
    },

    reset: function(key) {
      this.set(key, false);
    },

    resetAll: function(key) {
      $.each(this.keys, $.proxy(function(name, value) {
        this.reset(name);
      }, this));
    }
  },

  init: function() {
    function ifActive(func) {
      return function() {
        if (Terminal.promptActive) {
          func.apply(this, arguments);
        }
      };
    }

    $(document)
      .keypress($.proxy(ifActive(function(e) {
        if (e.which >= 32 && e.which <= 126) {
          var character = String.fromCharCode(e.which);
          var letter = character.toLowerCase();
        } else {
          return;
        }

        if (this.sticky.keys.ctrl) {
          if (letter == 'w') {
            this.deleteWord();
          } else if (letter == 'h') {
            Terminal.deleteCharacter(false);
          } else if (letter == 'l') {
            this.clear();
          } else if (letter == 'a') {
            this.setPos(0);
          } else if (letter == 'e') {
            this.setPos(this.buffer.length);
          } else if (letter == 'd') {
            this.runCommand('logout');
          }
        } else {
          if (character) {
            this.addCharacter(character);
            e.preventDefault();
          }
        }
      }), this))
      .bind('keydown', 'return', ifActive(function(e) { Terminal.processInputBuffer(); }))
      .bind('keydown', 'backspace', ifActive(function(e) { e.preventDefault(); Terminal.deleteCharacter(e.shiftKey); }))
      .bind('keydown', 'del', ifActive(function(e) { Terminal.deleteCharacter(true); }))
      .bind('keydown', 'left', ifActive(function(e) { Terminal.moveCursor(-1); }))
      .bind('keydown', 'right', ifActive(function(e) { Terminal.moveCursor(1); }))
      .bind('keydown', 'up', ifActive(function(e) {
        e.preventDefault();
        if (e.shiftKey || Terminal.sticky.keys.scroll) {
          Terminal.scrollLine(-1);
        } else if (e.ctrlKey || Terminal.sticky.keys.ctrl) {
          Terminal.scrollPage(-1);
        } else {
          Terminal.moveHistory(-1);
        }
      }))
      .bind('keydown', 'down', ifActive(function(e) {
        e.preventDefault();
        if (e.shiftKey || Terminal.sticky.keys.scroll) {
          Terminal.scrollLine(1);
        } else if (e.ctrlKey || Terminal.sticky.keys.ctrl) {
          Terminal.scrollPage(1);
        } else {
          Terminal.moveHistory(1);
        }
      }))
      .bind('keydown', 'pageup', ifActive(function(e) { Terminal.scrollPage(-1); }))
      .bind('keydown', 'pagedown', ifActive(function(e) { Terminal.scrollPage(1); }))
      .bind('keydown', 'home', ifActive(function(e) {
        e.preventDefault();
        if (e.ctrlKey || Terminal.sticky.keys.ctrl) {
          Terminal.jumpToTop();
        } else {
          Terminal.setPos(0);
        }
      }))
      .bind('keydown', 'end', ifActive(function(e) {
        e.preventDefault();
        if (e.ctrlKey || Terminal.sticky.keys.ctrl) {
          Terminal.jumpToBottom();
        } else {
          Terminal.setPos(Terminal.buffer.length);
        }
      }))
      .bind('keydown', 'tab', function(e) {
        e.preventDefault();
      })
      .keyup(function(e) {
        var keyName = $.hotkeys.specialKeys[e.which];
        if (keyName in { 'ctrl': true, 'alt': true, 'scroll': true }) {
          Terminal.sticky.toggle(keyName);
        } else if (!(keyName in { 'left': true, 'right': true, 'up': true, 'down': true })) {
          Terminal.sticky.resetAll();
        }
      });

    $(window).resize(function(e) { $('#screen').scrollTop($('#screen').attr('scrollHeight')); });

    this.setCursorState(true);
    this.setWorking(false);
    $('#prompt').html(this.config.prompt);
    $('#screen').hide().fadeIn('fast', function() {
      $('#screen').triggerHandler('cli-load');
    });
  },

  setCursorState: function(state, fromTimeout) {
    this.cursorBlinkState = state;
    if (this.config.cursor_style == 'block') {
      if (state) {
        $('#cursor').css({ color: this.config.bg_color, backgroundColor: this.config.fg_color });
      } else {
        $('#cursor').css({ color: this.config.fg_color, background: 'none' });
      }
    } else {
      if (state) {
        $('#cursor').css('textDecoration', 'underline');
      } else {
        $('#cursor').css('textDecoration', 'none');
      }
    }

    // (Re)schedule next blink.
    if (!fromTimeout && this._cursorBlinkTimeout) {
      window.clearTimeout(this._cursorBlinkTimeout);
      this._cursorBlinkTimeout = null;
    }
    this._cursorBlinkTimeout = window.setTimeout($.proxy(function() {
      this.setCursorState(!this.cursorBlinkState, true);
    }, this), this.config.cursor_blink_time);
  },

  updateInputDisplay: function() {
    var left = '', underCursor = ' ', right = '';

    if (this.pos < 0) {
      this.pos = 0;
    }
    if (this.pos > this.buffer.length) {
      this.pos = this.buffer.length;
    }
    if (this.pos > 0) {
      left = this.buffer.substr(0, this.pos);
    }
    if (this.pos < this.buffer.length) {
      underCursor = this.buffer.substr(this.pos, 1);
    }
    if (this.buffer.length - this.pos > 1) {
      right = this.buffer.substr(this.pos + 1, this.buffer.length - this.pos - 1);
    }

    $('#lcommand').text(left);
    $('#cursor').text(underCursor);
    if (underCursor == ' ') {
      $('#cursor').html('&nbsp;');
    }
    $('#rcommand').text(right);
    $('#prompt').text(this.config.prompt);
    return;
  },

  clearInputBuffer: function() {
    this.buffer = '';
    this.pos = 0;
    this.updateInputDisplay();
  },

  clear: function() {
    $('#display').html('');
  },

  addCharacter: function(character) {
    var left = this.buffer.substr(0, this.pos);
    var right = this.buffer.substr(this.pos, this.buffer.length - this.pos);
    this.buffer = left + character + right;
    this.pos++;
    this.updateInputDisplay();
    this.setCursorState(true);
  },

  deleteCharacter: function(forward) {
    var offset = forward ? 1 : 0;
    if (this.pos >= (1 - offset)) {
      var left = this.buffer.substr(0, this.pos - 1 + offset);
      var right = this.buffer.substr(this.pos + offset, this.buffer.length - this.pos - offset);
      this.buffer = left + right;
      this.pos -= 1 - offset;
      this.updateInputDisplay();
    }
    this.setCursorState(true);
  },

  deleteWord: function() {
    if (this.pos > 0) {
      var ncp = this.pos;
      while (ncp > 0 && this.buffer.charAt(ncp) !== ' ') {
        ncp--;
      }
      left = this.buffer.substr(0, ncp - 1);
      right = this.buffer.substr(ncp, this.buffer.length - this.pos);
      this.buffer = left + right;
      this.pos = ncp;
      this.updateInputDisplay();
    }
    this.setCursorState(true);
  },

  moveCursor: function(val) {
    this.setPos(this.pos + val);
  },

  setPos: function(pos) {
    if ((pos >= 0) && (pos <= this.buffer.length)) {
      this.pos = pos;
      Terminal.updateInputDisplay();
    }
    this.setCursorState(true);
  },

  moveHistory: function(val) {
    var newpos = this.historyPos + val;
    if ((newpos >= 0) && (newpos <= this.history.length)) {
      if (newpos == this.history.length) {
        this.clearInputBuffer();
      } else {
        this.buffer = this.history[newpos];
      }
      this.pos = this.buffer.length;
      this.historyPos = newpos;
      this.updateInputDisplay();
      this.jumpToBottom();
    }
    this.setCursorState(true);
  },

  addHistory: function(cmd) {
    this.historyPos = this.history.push(cmd);
  },

  jumpToBottom: function() {
    $('#screen').animate({ scrollTop: $('#screen').attr('scrollHeight') }, this.config.scrollSpeed, 'linear');
  },

  jumpToTop: function() {
    $('#screen').animate({ scrollTop: 0 }, this.config.scrollSpeed, 'linear');
  },

  scrollPage: function(num) {
    $('#screen').animate({ scrollTop: $('#screen').scrollTop() + num * ($('#screen').height() * .75) }, this.config.scrollSpeed, 'linear');
  },

  scrollLine: function(num) {
    $('#screen').scrollTop($('#screen').scrollTop() + num * this.config.scrollStep);
  },

  print: function(text) {
    if (!text) {
      $('#display').append($('<div>'));
    } else if (text instanceof jQuery) {
      $('#display').append(text);
    } else {
      var av = Array.prototype.slice.call(arguments, 0);
      $('#display').append($('<p>').text(av.join(' ')));
    }
    this.jumpToBottom();
  },

  processInputBuffer: function(cmd) {
    this.print($('<p>').addClass('command').text(this.config.prompt + this.buffer));
    var cmd = trim(this.buffer);
    this.clearInputBuffer();
    if (cmd.length == 0) {
      return false;
    }
    this.addHistory(cmd);
    if (this.output) {
      return this.output.process(this, cmd);
    } else {
      return false;
    }
  },

  setPromptActive: function(active) {
    this.promptActive = active;
    $('#inputline').toggle(this.promptActive);
  },

  setWorking: function(working) {
    if (working && !this._spinnerTimeout) {
      $('#display .command:last-child').add('#bottomline').first().append($('#spinner'));
      this._spinnerTimeout = window.setInterval($.proxy(function() {
        if (!$('#spinner').is(':visible')) {
          $('#spinner').fadeIn();
        }
        this.spinnerIndex = (this.spinnerIndex + 1) % this.config.spinnerCharacters.length;
        $('#spinner').text(this.config.spinnerCharacters[this.spinnerIndex]);
      }, this), this.config.spinnerSpeed);
      this.setPromptActive(false);
      $('#screen').triggerHandler('cli-busy');
    } else if (!working && this._spinnerTimeout) {
      clearInterval(this._spinnerTimeout);
      this._spinnerTimeout = null;
      $('#spinner').fadeOut();
      this.setPromptActive(true);
      $('#screen').triggerHandler('cli-ready');
    }
  },

  runCommand: function(text) {
    var index = 0;
    var mine = false;

    this.promptActive = false;
    var interval = window.setInterval($.proxy(function typeCharacter() {
      if (index < text.length) {
        this.addCharacter(text.charAt(index));
        index += 1;
      } else {
        clearInterval(interval);
        this.promptActive = true;
        this.processInputBuffer();
      }
    }, this), this.config.typingSpeed);
  }
};

module.exports = Terminal;
},{"./Controller.js":2,"./Terminal.hotkeys.js":3}],5:[function(require,module,exports){
function MapOrPolyfill() {
  let Map = window.Map;
  if ((!Map) || (typeof Map !== 'function')) {
    // Simple polyfill when ES6 Map is not available
    Map = class MapPolyfill {
      constructor() {
        this.map = {};
      }
      set(key, value) {
        this.map[key] = value;
      }
      get(key) {
        return this.map[key];
      }
      has(key) {
        return this.map.hasOwnProperty(key);
      }
      delete(key) {
        delete this.map[key];
      }
      forEach(callback) {
        Object.keys(this.map).forEach((key) => {
          // Call according to ES6 Map#forEach
          callback(this.map[key], key, this);
        });
      }
    };
  }
  return Map;
}

module.exports = MapOrPolyfill;
},{}],6:[function(require,module,exports){
const Terminal = require('./CLI/Terminal.view.js');

$(document).ready(function() {
  // Kill Opera's backspace keyboard action.
  document.onkeydown = document.onkeypress = function(e) { return $.hotkeys.specialKeys[e.keyCode] != 'backspace'; };
  Terminal.init();
  window.Terminal = Terminal;
});
},{"./CLI/Terminal.view.js":4}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[6]);
