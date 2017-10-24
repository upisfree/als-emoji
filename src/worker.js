var Az = require('./az'),
    translateText = require('./translateText');

Az.Morph.init('../node_modules/az/dicts', function() {
  onmessage = function(e) {
    postMessage(translateText(e.data));
  }
});