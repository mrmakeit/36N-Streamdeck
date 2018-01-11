const path = require("path");
const logger = require("./logger.js");
const StreamDeck = require("elgato-stream-deck");
const theDeck = new StreamDeck();

let pages = {
  Default:new Page("Default")
};
let activePage = pages.Default;

let Page = function(myName){
  let name = myName;
  let page = this;
  let keys = [];
  page.onPress = function(index){
    logger.info("Key press for index "+index+" on page "+name);
    keys[index].onPress();
  }
  page.getKey = function(index){
    return keys[index];
  }
  for(var x = 0; x<15; x++){
    keys[x]=new Key(x);
  }
  logger.info("Created page "+name);
  return this;
}

let Key = function(keyIndex){
  let key = this;
  let index = keyIndex;
  let state = null;
  let states = {
  };

  key.addState = function(stateName,image,onPress){
    let newState = {}
    newState.image = image;
    newState.onPress = onPress;
    states[stateName]=newState;
  }
  key.setState = function(newState){
    logger.info("added state "+newState+" to key index "+index);
    state = newState;
    key.draw();
  }
  key.draw = function(){
    if(state){
      let image = states[state];
      theDeck.fillImageFromFile(index,image);
    }
  }
  key.onPress = function(){
    if(state){
      states[state].onPress();
    }else{
      logger.warn("No state enabled on key "+index);
    }
  }
  return this;
}

function addPage(name){
  let page = new Page(name);
  pages[name] = page;
  return page;
}

function getPage(name){
  return pages[name];
}

function activatePage(name){
  activePage = pages[name];
}

function runPress(index){
  activePage.onPress(index);
}

theDeck.on('down',function(index){
  runPress(index);
})

module.exports = {
  addKey:addKey,
  getKey:getKey,
  activatePage:activatePage
}
