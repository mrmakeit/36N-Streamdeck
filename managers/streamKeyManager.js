class StreamKey{
  constructor(id,name,server,key){
    let key = this;
    this.name = name;
    this.server = server;
    this.key = key;
    this.id = id;
  }
}

class KeySender{
  constructor(){
    this.keys = {};
    this.currentKey = null;
  }
  switchToKey(id){
    this.currentKey = id;
  }
  appendKey(Key){
    if(Key instanceof StreamKey){
      this.keys[Key.id] = Key;
      return Key.id;
    }else{
      throw new Error("Key is not a StreamKey Type");
    }
  }
  getCurrentKey(){
    return this.keys[this.currentKey.id]
  }
}

class obsKeySender extends KeySender{
  constructor(obs){
    super();
    this.obs = obs;
    this.parseCurrentStreamKey()
  }
  switchToKey(id){
    let key = this.keys[id];
    this.obs.setStreamKey(key.server,key.key);
    super.switchToKey(id);
  }
}

module.exports ={
  StreamKey: StreamKey,
  KeySender: KeySender,
  obsKeySender: obsKeySender
}
