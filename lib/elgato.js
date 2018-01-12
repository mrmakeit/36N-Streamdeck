const path = require("path");
const StreamDeck = require("elgato-stream-deck");
const theDeck = new StreamDeck();

let Page = function(myName){
  let name = myName;
  let page = this;
  let keys = [];
  page.onPress = function(index){
    keys[index].onPress();
  }
  page.getKey = function(index){
    return keys[index];
  }
  for(var x = 0; x<15; x++){
    keys[x]=new Key(x);
  }
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
    state = newState;
    key.draw();
  }
  key.draw = function(){
    if(state){
      let image = states[state].image;
      theDeck.fillImageFromFile(index,image);
    }
  }
  key.onPress = function(){
    if(state){
      states[state].onPress();
    }else{
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

let pages = {
  Default:new Page("Default")
};
let activePage = pages.Default;


module.exports = {
  addPage:addPage,
  getPage:getPage,
  activatePage:activatePage
}
