// поддержка пока что только русского и английского из-за начальной формы
var Az = require('./az'),
    translateText = require('./translateText');

// параллелить через workers,
// английский язык,
// массив со всеми названиями и ключевыми словами, с которым сначала идёт проверка, мол, стоит ли уже дальше проверять все эмоджи или нет
// fallback: https://github.com/lautis/emojie

// init
Az.Morph.init('node_modules/az/dicts', function() {
  var input = document.getElementById('input');
  var output = document.getElementById('output');

  document.getElementsByTagName('button')[0].onclick = function() {
    output.textContent = translateText(input.value);
  };
});