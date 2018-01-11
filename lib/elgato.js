const path = require("path");
const StreamDeck = require("elgato-stream-deck");
const theDeck = new StreamDeck();

let keys = []

let Key = function(keyIndex,defaultImage){
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
      let image = states[state];
      theDeck.fillImageFromFile(index,image);
    }
  }
  key.onPress = function(){
    if(state){
      states[state].onPress();
    }
  }
  return this;
}

function addKey(index,image){
  let key = new Key(index,image);
  keys[index] = key;
  return key;
}

function getKey(index){
  return keys[index];
}

module.exports = {
  addKey:addKey,
  getKey:getKey
}
