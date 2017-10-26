var Az = require('./az'),
    translateText = require('./translateText'),
    isInit = false;

Az.Morph.init('../node_modules/az/dicts', function() {
  isInit = true;
});

onmessage = function(e) {
  if (isInit) {
    postMessage(translateText(e.data));    
  }
}