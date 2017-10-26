var Az = require('./az'),
    LANG = require('./lang'),
    emojies = require('../converter/emojies.json'),
    prepareText = require('./prepareText'),
    tokenization = require('./tokenization'),
    normalizeWord = require('./normalizeWord'),
    wordToEmoji = require('./wordToEmoji');

module.exports = function(text) {
  var text = prepareText(text),
      tokens = tokenization(text),
      word,
      lang;

  console.log(tokens);

  for (let a = 0; a < tokens.length; a++) {
    // if (tokens[a].type === Az.Tokens.WORD) {
      switch (tokens[a].subType) {
        case Az.Tokens.CYRIL:
          lang = LANG.RU;

          break;
        case Az.Tokens.LATIN:
          lang = LANG.EN;

          break;
        default:
          lang = LANG.ZH;

          break;
      }

      console.log(tokens[a]);

      word = normalizeWord(tokens[a].toString(), lang);

      if (word) { // отсекаем не существительные, глаголы или прилагательные
        let emoji = wordToEmoji(word, lang, emojies);

        if (emoji) {
          tokens[a] += ' ' + emoji;
        }
      }
    // }
  }

  return tokens.join(' ');
}