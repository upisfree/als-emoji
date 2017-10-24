// поддержка пока что только русского и английского из-за начальной формы
var Az = require('./az'),
    specialSymbols = /(@|&|'|\(|\)|<|>|#)/g;

window.update = function() {
  var val = input.value.replace(specialSymbols, '').toLowerCase(),
      tokens = Az.Tokens(val).done(),
      word,
      lang;

  // параллелить через workers,
  // английский язык,
  // код отрефакторить и в разные файлы,
  // массив со всеми названиями и ключевыми словами, с которым сначала идёт проверка, мол, стоит ли уже дальше проверять все эмоджи или нет
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
        let variants = [];

        for (let b in emojiData) {
          if (emojiData[b][lang]) {
            let name = emojiData[b][lang].name;
            let keywords = emojiData[b][lang].keywords;

            if (name == word) {
              variants.push(b);

              break; // самый лучший вариант
            }

            for (let c in keywords) {
              if (keywords[c] == word) {
                variants.push(b);
              }
            }
          }
        }

        if (variants.length) {
          tokens[a] += ' ' + variants[Math.floor(Math.random() * variants.length)];
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