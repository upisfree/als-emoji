var Az = require('./az'),
    stemmer = require('stemmer'),
    LANG = require('../lang');

module.exports = function(word, lang) {
  switch (lang) {
    case LANG.RU:
      // с удовольствием бы не использовал try, если бы в Az.Morph был бы флаг init
      // но если текст уже приходит, а словари ещё не загрузились, переводим пока без приведения в начальную форму
      try { 
        word = Az.Morph(word)[0];

        // случается, что предсказыватель ничего не предсказывает
        if (word) {
          // приводим в начальную форму только существительные, глаголы и прилагательные
          if (word.tag.POS === 'NOUN' ||
              word.tag.POS === 'INFN' ||
              word.tag.POS === 'ADJF') {
            word = word.normalize().word;
          } else {
            word = null;
          }
        }
      }
      catch (e) { }

      break;
    case LANG.EN:
      if (word !== 'on' && word !== 'a' && word !== 'it' && word !== 'is') {
        word = stemmer(word);
      } else {
        word = null;
      }

      break;
  }

  return word;
}