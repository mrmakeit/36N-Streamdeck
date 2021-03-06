const Key = require('streamdeck').Key
const path = require('path')
const sharp = require('sharp')

class pageUpKey extends Key {
  constructor(deck){
    super()
    let key = this;
    this.deck = deck
    sharp(path.resolve(__dirname,'../resources/keyIcons/page_up.png'))
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
    this.deck.currentPage--
    this.deck.draw()
  }
}

class pageDownKey extends Key {
  constructor(deck){
    super()
    let key = this;
    this.deck = deck
    sharp(path.resolve(__dirname,'../resources/keyIcons/page_down.png'))
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
    this.deck.currentPage++
    this.deck.draw()
  }
}

module.exports = {
  pageDownKey: pageDownKey,
  pageUpKey: pageUpKey
}
