const Firebase = require('../firebase.js');
const Application = require('../CLI/Application');

// http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
function FLATTEN_JSON(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop + "[" + i + "]");
            if (l === 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}

class Nest extends Application {
  constructor() {
    super();
    this.name = "nest";
    this.usage = "&lt;command&gt;";
    this.desc = "Nest services.";
  }
  getHandler() {
    const fetchFromStore = (key) => { return this.fetch(key); };
    const validCommands = ['struct'];
    /**
     * @function handler
     */
    return function handler(name, command) {
      // Validate argv
      if ((!command) || (validCommands.indexOf(command) === -1)) return this.print("Nest requires a valid command");
      // Fetch access_token
      let access_token = fetchFromStore("@Link::access_token::nest");
      // Check for access_token
      if (!access_token) {
        this.print($("<span><span class='yellow'>No access_token found!</span><br>Try: <span class='green'>link</span> <b>nest</b></span>"));
        return;
      }
      
      let nest = new window.Firebase('wss://developer-api.nest.com');
      nest.auth(access_token);
      
      // Set to working
      this.setWorking(true);
      this.setPromptActive(false);
      
      if (command === 'struct') {
        nest.on('value', (snapshot) => {
          const structures = snapshot.val().structures;
          // Special flattened formatting
          for (let key in structures) {
            let tObject = structures[key];
            let wheres = tObject.wheres;
            delete tObject.wheres;
            let object = FLATTEN_JSON(tObject);
            for (let item in object) {
              this.print($(`<span class="dim">${item}: </span><span class="blue">${object[item]}</span><br>`));
            }
            for (let item in wheres) {
              this.print($(`<span class="dim">wheres.name: </span><span class="green">${wheres[item].name}</span><br>`));
              this.print($(`<span class="dim">whreas.where_id: </span><span class="green">${wheres[item].where_id}</span><br>`));
            }
          }
          // Set to done
          this.setWorking(false);
          this.setPromptActive(true);
        }); 
      }
    };
  }
  help(terminal) {
    terminal.print($("<span><span class='green'>nest</span> <b>command</b></span>"));
  }
}

module.exports = Nest;