const child_process = require('child_process')

class OBS {
  let instance = null
  constructor(){
    instance = child_process.spawn('obs')
  }
}
