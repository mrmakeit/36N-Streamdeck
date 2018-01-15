var normalizedPath = require("path").join(__dirname);
let keys = {};

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  if(file != "index.js"){
    console.log('loading keys from: ',file);
    keys = require("./" + file);
    for(key in keys){
      module.exports[key] = keys[key]
    }
  }
});

