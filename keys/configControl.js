const Key = require('streamdeck').Key
const sharp = require('sharp');
const path = require('path');

class communityKey extends Key {
  constructor(deck,obs,streamServer,streamKey,icon){
    super()
    let key = this;
    this.deck = deck;
    this.obs = obs;
    this.stream = {}
    this.stream.server = streamServer
    this.stream.key = streamKey
    this.stream.icon = icon
    console.log(this.stream.icon);
    sharp(path.resolve(__dirname,'../resources/communityIcons/'+this.stream.icon))
      .flatten()
      .resize(72,72)
      .raw()
      .toBuffer()
      .then(buffer => {
        key.image = buffer
      })
      .catch(err => {
        console.error(err);
      })
  }
  onPress(){
    this.obs.setStreamSettings(this.stream.server,this.stream.key);
  }
}

module.exports = {
  communityKey: communityKey
}
