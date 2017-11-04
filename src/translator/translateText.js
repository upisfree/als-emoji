var Az = require('./az')
    franc = require('franc-min'),
    LANG = require('../lang'),
    tokenization = require('./tokenization'),
    normalizeWord = require('./normalizeWord'),
    wordToEmoji = require('./wordToEmoji'),
    languageDetectOptions = { whitelist: Object.keys(LANG.FRANC), minLength: 2 };

module.exports = function(text, settings) {
  var word,
      lang;

  if (settings) { // текст
    var tokens = tokenization(text);

    for (let a = 0; a < tokens.length; a++) {
      if (tokens[a].type === Az.Tokens.WORD) {
        word = tokens[a].toString();
        lang = LANG.FRANC[franc(word, languageDetectOptions)];

        if (lang) {
          word = normalizeWord(word, lang);

          if (word) {
            let emoji = wordToEmoji(word, lang, false);

            if (emoji) {
              if (settings.replaceWords) {
                tokens[a] = emoji;
              } else {
                tokens[a] += ' ' + emoji;
              }
            }
          }
        }
      }
    }

    return tokens.join('');
  } else { // одно слово
    word = text.trim();

    // действительно одно слово?
    if (word.indexOf(' ') === -1) {
      lang = LANG.FRANC[franc(word, languageDetectOptions)];

      if (lang) {
        word = normalizeWord(word, lang);

        if (word) {
          let emojies = wordToEmoji(word, lang, true);

          if (emojies) {
            if (typeof emojies === 'string') {
              return emojies;
            } else {
              return emojies.join(' ');
            }
          }
        }
      }
    }
  }
}