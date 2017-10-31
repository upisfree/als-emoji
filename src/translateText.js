var Az = require('./az')
    franc = require('franc-min'),
    LANG = require('./lang'),
    emojies = require('../converter/emojies.json'),
    tokenization = require('./tokenization'),
    normalizeWord = require('./normalizeWord'),
    wordToEmoji = require('./wordToEmoji'),
    languageDetectOptions = { whitelist: ['eng', 'rus'], minLength: 2 };

module.exports = function(text) {
  var tokens = tokenization(text),
      word,
      lang;

  for (let a = 0; a < tokens.length; a++) {
    if (tokens[a].type === Az.Tokens.WORD) {
      word = tokens[a].toString();
      lang = LANG.FRANC[franc(word, languageDetectOptions)];

      if (lang) {
        word = normalizeWord(word, lang);

        if (word) {
          let emoji = wordToEmoji(word, lang, emojies);

          if (emoji) {
            tokens[a] += ' ' + emoji;
          }
        }
      }
    }
  }

  return tokens.join('');
}