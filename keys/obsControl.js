const Key = require('streamdeck').Key
const path = require('path')
const sharp = require('sharp')

class recordKey extends Key {
  constructor(deck,obs){
    super()
    let key = this;
    this.deck = deck;
    this.obs = obs;
    sharp(path.resolve(__dirname,'../resources/keyIcons/record_off.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.image = buffer
        key.imageOff = buffer
      })
      .catch(err => {
        console.error(err);
      })
    sharp(path.resolve(__dirname,'../resources/keyIcons/record_on.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.imageOn = buffer
      })
      .catch(err => {
        console.error(err);
      })
    this.obs.on("RecordingOn",function(){
      key.image = key.imageOn;
      key.deck.draw()
    })
    this.obs.on("RecordingOff", function(){
      key.image = key.imageOff;
      key.deck.draw()
    })
  }
  onPress(){
    this.obs.startStopRecording();
  }
}

class obsConnectionKey extends Key {
  constructor(deck,obs){
    super()
    let key = this;
    this.deck = deck;
    this.obs = obs;
    sharp(path.resolve(__dirname,'../resources/keyIcons/obs_off.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.image = buffer
        key.imageOff = buffer
      })
      .catch(err => {
        console.error(err);
      })
    sharp(path.resolve(__dirname,'../resources/keyIcons/obs_on.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.imageOn = buffer
      })
      .catch(err => {
        console.error(err);
      })
    this.obs.on("connected",function(){
      key.image = key.imageOn;
      key.deck.draw()
    })
    this.obs.on("disconnected", function(){
      key.image = key.imageOff;
      key.deck.draw()
    })
  }
  onPress(){
    if(!this.obs.connected){
      this.obs.connect();
    }else{
      this.obs.disconnect();
    }
  }
}

class streamKey extends Key {
  constructor(deck,obs){
    super()
    let key = this;
    this.deck = deck;
    this.obs = obs;
    sharp(path.resolve(__dirname,'../resources/keyIcons/stream_off.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.image = buffer
        key.imageOff = buffer
      })
      .catch(err => {
        console.error(err);
      })
    sharp(path.resolve(__dirname,'../resources/keyIcons/stream_on.png'))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.imageOn = buffer
      })
      .catch(err => {
        console.error(err);
      })
    this.obs.on("StreamingOn",function(){
      key.image = key.imageOn;
      key.deck.draw()
    })
    this.obs.on("StreamingOff", function(){
      key.image = key.imageOff;
      key.deck.draw()
    })
  }
  onPress(){
    this.obs.startStopStreaming();
  }
}

class sceneKey extends Key {
  constructor(deck,obs,scene,icon){
    super()
    let key = this;
    this.deck = deck;
    this.sceneName = scene;
    this.obs = obs;
    let sceneIcon = path.resolve(__dirname,'../resources/sceneIcons/'+icon);
    sharp(path.resolve(__dirname,'../resources/keyIcons/scene_off.png'))
      .overlayWith(sceneIcon,{gravity:sharp.gravity.south})
      .flatten()
      .resize(72,72)
      .toBuffer()
      .then(buffer => {
        return sharp(buffer)
        .flatten()
        .resize(72,72)
        .raw()
        .toBuffer()
      })
      .then(buffer => {
        console.log(buffer);
        if(key.obs.currentScene!=key.sceneName){
          key.image = buffer
        }
        key.imageOff = buffer
      })
      .catch(err => {
        console.error(err);
      })
    sharp(path.resolve(__dirname,'../resources/keyIcons/scene_on.png'))
      .overlayWith(sceneIcon,{gravity:sharp.gravity.south})
      .flatten()
      .resize(72,72)
      .toBuffer()
      .then(buffer => {
        return sharp(buffer)
        .flatten()
        .resize(72,72)
        .raw()
        .toBuffer()
      })
      .then(buffer => {
        if(key.obs.currentScene==key.sceneName){
          key.image = buffer
        }
        key.imageOn = buffer
      })
      .catch(err => {
        console.error(err);
      })
    this.obs.on("SceneSwitch",function(name){
      if(name == key.sceneName){
        key.image = key.imageOn;
      }else{
        key.image = key.imageOff;
      }
      key.deck.draw()
    })
  }
  onPress(){
    this.obs.setCurrentScene(this.sceneName);
  }
}

module.exports = {
  recordKey:recordKey,
  streamKey:streamKey,
  sceneKey:sceneKey,
  obsConnectionKey:obsConnectionKey
}
