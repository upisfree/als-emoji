// поддержка пока что только русского и английского из-за начальной формы
var Az = require('./az'),
    specialSymbols = /(@|&|'|\(|\)|<|>|#)/g;

window.update = function() {
  var val = input.value.replace(specialSymbols, '').toLowerCase(),
      tokens = Az.Tokens(val).done(),
      word,
      lang;

  // параллелить через workers
  for (let a = 0; a < tokens.length; a++) {
    if (tokens[a].type === Az.Tokens.WORD) {
      switch (tokens[a].subType) {
        case Az.Tokens.CYRIL:
          word = Az.Morph(tokens[a].toString())[0];
          lang = 'ru';

          // приводим в начальную форму только существительные, глаголы и прилагательные
          if (word.tag.POS == 'NOUN' ||
              // word.tag.POS == 'ADVB' || // наречие
              word.tag.POS == 'INFN' ||
              word.tag.POS == 'ADJF') {
            word = word.normalize().word; // в русском только здесь эмоджи подставляем
          }

          break;
        case Az.Tokens.LATIN:
          word = tokens[a].toString();
          lang = 'en';

          break;
      }
        
      if (typeof word == 'string') { // отсекаем не существительные, глаголы или прилагательные
        for (let b in emojiData) {
          if (emojiData[b][lang]) {
            let keywords = emojiData[b][lang].keywords.split(' ');

            if (emojiData[b][lang].name == word ||
                keywords[0] == word ||
                keywords[1] == word ||
                keywords[2] == word ||
                keywords[3] == word) { // бывает по десять кейвордов, переделать
              tokens[a] += b;

              break;
            }
          }
        }
      }
    }
  }

  output.textContent = tokens.join(' ');
}

var input = document.getElementById('input');
var output = document.getElementById('output');

var xhr = new XMLHttpRequest();

xhr.open('GET', 'converter/emojies.json', true);
xhr.onreadystatechange = function() {
  if (xhr.readyState != 4)
    return;

  window.emojiData = JSON.parse(xhr.responseText);
};

// init
Az.Morph.init('node_modules/az/dicts', function() {
  xhr.send();
});