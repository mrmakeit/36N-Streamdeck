const ObsWS = require('obs-websocket-js');
const env = require('node-env-file')
const EventEmitter = require('events');

class OBSWS extends EventEmitter {
  constructor(address,port,password){
    super()
    let obs = this;
    this.client = new ObsWS();
    this.recording = 0;
    this.streaming = 0;
    this.currentScene = "";
    this.connectionAttempt = 0;
    this.maxConnectionAttempts = 10;
    this.connected = false;
    let connectArgs = {
      address:address+':'+port
    }
    if(password){
      connectArgs.password = password
    }
    this.connectArgs = connectArgs;
    this.client.on('error', err => {
            console.log('socket error:', err);
    });
    this.client.on('close', err => { console.log('socket error:', err); });
    this.client.on('ConnectionOpened', function(data){
      console.log("Connected to OBS Instance.  Response: ",data);
    });
    this.client.on('ConnectionClosed', function(data){
      obs.emit('disconnected');
      if(obs.connected){
        obs.connected = false;
        obs.connect();
      }
      console.log("Connection to OBS Instance closed.  Response: ",data);
    });
    this.client.on('AuthenticationSuccess', function(data){
      console.log("Successfully Authenticated with OBS.  Response: ",data);
    });
    this.client.on('AuthenticationFailure', function(data){
      console.error("Couldn't authenticate with OBS.  Response: ",data);
    });
    this.client.on('RecordingStarted', function(){
      obs.recording = 1;
      obs.emit('RecordingOn');
    })
    this.client.on('RecordingStopped', function(){
      obs.recording = 0;
      obs.emit('RecordingOff');
    })
    this.client.on('StreamStarted', function(){
      obs.streaming = 1;
      obs.emit('StreamingOn');
    })
    this.client.on('StreamStopped', function(){
      obs.streaming = 0;
      obs.emit('StreamingOff');
    })
    this.client.on('SwitchScenes', function(data){
      obs.currentScene = data['scene-name']
      obs.emit('SceneSwitch',data['scene-name']);
    })
  }
  connect(){
    let obs = this;
    this.client.connect(this.connectArgs)
      .then(()=>{
        console.log("Looks like we are ready");
        obs.connected = true;
        obs.connectionAttempt=0;
        obs.emit('connected');
        obs.getStreamSettings(console.log);
      })
      .catch(err => { // Promise convention dicates you have a catch on every chain.
        if(err.error.code=='ECONNREFUSED'){
          if(obs.connectionAttempt < obs.maxConnectionAttempts){
            obs.connectionAttempt++
            console.log("Connection Refused. Attempting to reconnect: "+obs.connectionAttempt);
            setTimeout(((obs2)=>{
              return function(){
                obs2.connect()
              }
            })(obs),3000)
          }
        }
      });
  }
  disconnect(){
    this.connected = false;
    this.client.disconnect();
  }
  startRecording(){
    this.client.send('StartRecording');
  }
  stopRecording(){
    this.client.send('StopRecording');
  }
  startStopRecording(){
    this.client.send('StartStopRecording');
  }
  startStreaming(){
    this.client.send('StartStreaming');
  }
  stopStreaming(){
    this.client.send('StopStreaming');
  }
  startStopStreaming(){
    this.client.send('StartStopStreaming');
  }
  setCurrentScene(name){
    this.client.send('SetCurrentScene',{"scene-name":name})
  }
  getStreamSettings(done){
    this.client.send('GetStreamSettings',{})
      .then(function(data){done(data)})
      .catch((error) => {
        console.log(error)
      })
  }
  setStreamSettings(url,key){
    this.client.SetStreamSettings({type: "rtmp_custom",settings:{server:url,key:key}})
    .then((data)=>{
      console.log("Stream Settings Updated")
      console.log(data)
    })
    .catch((err)=>{
      console.log("Couldn't set stream settings")
      console.log(err);
    })
  }
}

module.exports = OBSWS
