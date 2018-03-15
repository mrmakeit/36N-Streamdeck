const ObsWS = require('obs-websocket-js');
const EventEmitter = require('events');

class OBS extends EventEmitter {
  constructor(address,port,password){
    super()
    let obs = this;
    this.client = new ObsWS();
    this.recording = 0;
    this.streaming = 0;
    this.currentScene = "";
    this.client.connect({address:address+':'+port,password:password}).then(function(){
      console.log("Looks like we are ready");
      obs.getStreamSettings(console.log);
    })
    this.client.on('ConnectionOpened', function(data){
      console.log("Connected to OBS Instance.  Response: ",data);
    });
    this.client.on('ConnectionClosed', function(data){
      console.log("Closed Connection to OBS.  Response: ",data);
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
    this.client.send('GetStreamSettings',{}).then(function(data){done(data)})
  }
  setStreamSettings(url,key){
    this.client.send('SetStreamSettings',{type: "rtmp_custom",settings:{server:url,key:key}})
  }
}

module.exports = OBS





