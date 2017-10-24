// поддержка пока что только русского и английского из-за начальной формы
var Az = require('./az'),
    translateText = require('./translateText');

// параллелить через workers,
// английский язык,
// массив со всеми названиями и ключевыми словами, с которым сначала идёт проверка, мол, стоит ли уже дальше проверять все эмоджи или нет
// fallback: https://github.com/lautis/emojie

var input = document.getElementById('input');
var output = document.getElementById('output');

document.getElementsByTagName('button')[0].onclick = function() {
  output.textContent = translateText(input.value);
}

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