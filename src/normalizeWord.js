var Az = require('./az')
    LANG = require('./lang');

module.exports = function(word, lang) {
  switch (lang) {
    case LANG.RU:
      word = Az.Morph(word)[0];

      // приводим в начальную форму только существительные, глаголы и прилагательные
      if (word.tag.POS === 'NOUN' ||
          // word.tag.POS === 'ADVB' || // наречие
          word.tag.POS === 'INFN' ||
          word.tag.POS === 'ADJF') {
        word = word.normalize().word; // в русском только здесь эмоджи подставляем
      } else {
        word = null;
      }

      break;
    case LANG.EN:
      word = word;

      break;
  }

  return word;
}