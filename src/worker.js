var Az = require('./translator/az'),
    translateText = require('./translator/translateText');

importScripts('emojies.js'); // получаем глобальную переменную со всеми эмоджами

Az.Morph.init('../dicts/ru', function() {
  postMessage({ azLoaded: true });
});

onmessage = function(e) {
  if (e.data.settings) {
    postMessage({ text: translateText(e.data.text, e.data.settings) });
  }
  else {
    postMessage({ variants: translateText(e.data.text) });
  }
}