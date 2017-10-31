var random = require('../utils/random');

module.exports = function(word, lang) {
  word = word.toLowerCase();

  if (emojies[lang]['names'][word]) {
    return emojies[lang]['names'][word];
  }

  if (emojies[lang]['keywords'][word]) {
    let keywords = emojies[lang]['keywords'][word];

    return keywords[random(keywords.length)];
  }
}