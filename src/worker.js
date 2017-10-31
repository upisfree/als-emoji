var Az = require('./translator/az'),
    translateText = require('./translator/translateText'),
    isInit = false;

importScripts('emojies.js'); // now we've got global emojies object

Az.Morph.init('../dicts/ru', function() {
  isInit = true;
});

onmessage = function(e) {
  if (isInit) {
    postMessage(translateText(e.data));    
  }
}