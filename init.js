require('sharp') // to handle lovell/sharp#1078
const Deck = require("streamdeck").Deck;
const Keys = require('./keys')
const loadPages = require('./lib/loadPage.js')
const pages = require('./pages.json')
const OBSWS = require('./lib/obsws.js')
//const OBS = require('./lib/obs.js')
const env = require('node-env-file')

env(__dirname + "/.env")

let obs = null
if(process.env.LOCAL_OBS){
  obs = new OBSWS('127.0.0.1','4444');
}else{
  obs = new OBSWS(process.env.OBS_HOST,process.env.OBS_PORT,process.env.OBS_PASSWORD)
  console.log("Connecting with params",process.env.OBS_HOST,process.env.OBS_PORT);
}
const myDeck = new Deck


myDeck.pages = loadPages(pages,{deck:myDeck,obs:obs})
setTimeout(function(){myDeck.draw()},100);
