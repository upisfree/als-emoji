var Az = require('./translator/az'),
    translateText = require('./translator/translateText'),
    isInit = false;

Az.Morph.init('../dicts/ru', function() {
  isInit = true;
});

onmessage = function(e) {
  if (isInit) {
    postMessage(translateText(e.data));    
  }
}