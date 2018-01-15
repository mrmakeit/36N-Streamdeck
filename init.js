require('sharp') // to handle lovell/sharp#1078
const Deck = require("streamdeck").Deck;
const Keys = require('./keys')
const loadPages = require('./lib/loadPage.js')
const pages = require('./pages.json')
const OBSWS = require('./lib/obs.js')
const obs = new OBSWS('localhost','4444','password');

const myDeck = new Deck
myDeck.pages = loadPages(pages,{deck:myDeck,obs:obs})
setTimeout(function(){myDeck.draw()},100);
