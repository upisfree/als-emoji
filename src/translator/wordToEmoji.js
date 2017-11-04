var random = require('../utils/random'),
    LANG = require('../lang');

module.exports = function(word, lang, variants) {
  if (lang !== LANG.DE) { // в немецком все существительные пишутся с большой буквы
    word = word.toLowerCase();    
  }

  if (emojies[lang]['names'][word]) {
    return emojies[lang]['names'][word];
  }

  if (emojies[lang]['keywords'][word]) {
    let keywords = emojies[lang]['keywords'][word];

    if (variants) {
      return keywords;
    } else {
      return keywords[random(keywords.length)];
    }
  }
}