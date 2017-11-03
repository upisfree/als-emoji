// на старых виндах fallback (это просто): https://github.com/twitter/twemoji
// рефакторинг

var CONFIG = require('./config'),
    LANG = require('./lang'),
    random = require('./utils/random'),
    longTextTime = Date.now(),
    longTextDelay = 0,
    isMouseOnTitleArrow = false,
    now,
    settings = { replaceWords: false, copyOnClick: true },
    input = document.getElementById('input'),
    output = document.getElementById('output'),
    titleWord = document.getElementById('title-word'),
    titleArrow = document.getElementById('title-arrow'),
    titleEmoji = document.getElementById('title-emoji'),
    subtitle = document.getElementById('subtitle'),
    subtitleDefaultText = 'перевод с восьми языков в эмоджи',
    subtitleCopiedText = 'скопировано!',
    copiedTextDelay = 2000,
    copiedTime = 0,
    settingsReplaceWords = document.getElementById('settings-replace-words'),
    settingsCopyOnClick = document.getElementById('settings-copy-on-click'),
    worker = new Worker('./bin/worker.js');

// var twemoji = require('twemoji');
// twemoji.parse(document.body);

worker.onmessage = function(e) {
  output.innerHTML = e.data + '\n\n'; // \n\n — это чёртова гениальная магия, которая чинит textarea и не даёт тексту пропасть внутри окна

  input.style.height = output.getBoundingClientRect().height + 'px';
}

input.oninput = input.onchange = function() {
  longTextTime = Date.now();

  // мгновенный перевод для коротких текстов и задержка для длинных (чтобы не было такого: https://i.imgur.com/6ZChXob.gif)
  if (input.value.length >= CONFIG.LONG_TEXT_LENGTH) {
    longTextDelay = CONFIG.LONG_TEXT_DELAY;
  } else {
    longTextDelay = 0;
  }
}


// window.addEventListener 'touchend', (e) ->

output.onclick = function() {
  window.getSelection().selectAllChildren(output);

  if (settings.copyOnClick) {
    document.execCommand('copy');

    copiedTime = Date.now();
    subtitle.textContent = subtitleCopiedText;
  }
}

titleArrow.onmousemove = function() {
  isMouseOnTitleArrow = true;
}

titleArrow.onmouseleave = function() {
  isMouseOnTitleArrow = false;
}

settingsReplaceWords.onchange = function() {
  settings.replaceWords = settingsReplaceWords.checked;

  worker.postMessage({ text: input.value, settings: settings } );
}

settingsCopyOnClick.onchange = function() {
  settings.copyOnClick = settingsCopyOnClick.checked;
}

// старт
requestAnimationFrame(tick);

// funcs
function tick() {
  now = Date.now();

  // перевод
  if ((now - longTextTime) > longTextDelay && longTextTime !== 0) {
    longTextTime = 0;

    changeTitle();
    worker.postMessage({ text: input.value, settings: settings } );
  }

  // заголовок
  if (isMouseOnTitleArrow) {
    changeTitle();
  }

  // подзаголовок
  if ((now - copiedTime) > copiedTextDelay && copiedTime !== 0) {
    copiedTime = 0;

    subtitle.textContent = subtitleDefaultText;
  }

  requestAnimationFrame(tick);
}

function changeTitle() {
  var langKeys = Object.keys(LANG);
  langKeys.splice(langKeys.indexOf('FRANC'), 1);

  var lang = LANG[langKeys[random(langKeys.length)]],
      words = emojies[lang]['keywords'],
      wordsKeys = Object.keys(words),
      word = wordsKeys[random(wordsKeys.length)],
      _emojies = words[word],
      emoji = _emojies[random(_emojies.length)];

  if (word.length === 3 && emoji.length === 2) { // отсекаем эмоджи с модификатором пола
    titleWord.textContent = word.toLowerCase();
    titleEmoji.textContent = emoji;
  } else {
    changeTitle();
  }
}
