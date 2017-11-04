var LANG = require('../lang'),
    twemoji = require('twemoji'),
    random = require('../utils/random'),
    el = require('./elements.js');

function changeTitle(isFallbackNeeded) {
  var langKeys = Object.keys(LANG);
  langKeys.splice(langKeys.indexOf('FRANC'), 1);

  var lang = LANG[langKeys[random(langKeys.length)]],
      words = emojies[lang]['keywords'],
      wordsKeys = Object.keys(words),
      word = wordsKeys[random(wordsKeys.length)],
      _emojies = words[word],
      emoji = _emojies[random(_emojies.length)];

  if (word.length === 3 && emoji.length === 2) { // отсекаем эмоджи с модификатором пола
    el.titleWord.textContent = word.toLowerCase();
    el.titleEmoji.textContent = emoji;

    if (isFallbackNeeded) {
      twemoji.parse(el.titleEmoji);
    }
  } else {
    changeTitle(isFallbackNeeded);
  }
}

module.exports = changeTitle;