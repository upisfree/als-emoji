var Az = require('./az'),
    translateText = require('./translateText'),
    isInit = false;

Az.Morph.init('../dicts/ru', function() {
  isInit = true;
});

onmessage = function(e) {
  if (isInit) {
    postMessage(translateText(e.data));    
  }
}