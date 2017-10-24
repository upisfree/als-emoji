var Az = require('./az'),
    stemmer = require('stemmer'),
    LANG = require('./lang');

module.exports = function(word, lang) {
  switch (lang) {
    case LANG.RU:
      word = Az.Morph(word)[0];

      if (word) { // случается, что предсказыватель ничего не предсказывает
        // приводим в начальную форму только существительные, глаголы и прилагательные
        if (word.tag.POS === 'NOUN' ||
            // word.tag.POS === 'ADVB' || // наречие
            word.tag.POS === 'INFN' ||
            word.tag.POS === 'ADJF') {
          word = word.normalize().word; // в русском только здесь эмоджи подставляем
        } else {
          word = null;
        }
      }

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