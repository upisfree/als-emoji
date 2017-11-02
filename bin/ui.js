(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const CONFIG = {
  LONG_TEXT_LENGTH: 6000, // сколько символов нужно, чтобы текст считался длинным?
  LONG_TEXT_DELAY: 300 // поставь 0 для мгновенного перевода. задержка, чтобы не было такого на больших текстах: https://i.imgur.com/6ZChXob.gif
};

module.exports = CONFIG;
},{}],2:[function(require,module,exports){
const LANG = {
  DE: 'de', // German 🇩🇪
  EN: 'en', // English 🇬🇧
  ES: 'es', // Spanish 🇪🇸
  FR: 'fr', // French 🇫🇷
  IT: 'it', // Italian 🇮🇹
  PT: 'pt', // Portuguese 🇵🇹
  RU: 'ru', // Russian 🇷🇺
  TR: 'tr'  // Turkish 🇹🇷
};

// franc (библиотека, что определяет язык) использует ISO 639-2 вместо ISO 639-1, которым пользуется Юникод, поэтому нам нужен преобразователь
LANG.FRANC = {
  'deu': LANG.DE,
  'eng': LANG.EN,
  'spa': LANG.ES,
  'fra': LANG.FR,
  'ita': LANG.IT,
  'por': LANG.PT,
  'rus': LANG.RU,
  'tur': LANG.TR
};

module.exports = LANG;
},{}],3:[function(require,module,exports){
// на старых виндах fallback (это просто): https://github.com/twitter/twemoji
// рефакторинг

var CONFIG = require('./config'),
    LANG = require('./lang'),
    random = require('./utils/random'),
    longTextTime = Date.now(),
    longTextDelay = 0,
    isMouseOnTitleArrow = false,
    now,
    settings = { replaceWords: false },
    input = document.getElementById('input'),
    output = document.getElementById('output'),
    titleWord = document.getElementById('title-word'),
    titleArrow = document.getElementById('title-arrow'),
    titleEmoji = document.getElementById('title-emoji'),
    settingsReplaceWords = document.getElementById('settings-replace-words'),
    worker = new Worker('./bin/worker.js');

worker.onmessage = function(e) {
  output.innerHTML = e.data + '\n\n'; // \n\n — это чёртова гениальная магия, которая чинит textarea и не даёт тексту пропасть внутри окна

  input.style.height = output.getBoundingClientRect().height + 'px';
}

input.oninput = input.onchange = function() {
  longTextTime = Date.now();

  // мгновенный перевод для коротких текстов и задержка для длинных (чтобы не было такого: https://i.imgur.com/6ZChXob.gif)
  if (input.textContent.length >= CONFIG.LONG_TEXT_LENGTH) {
    longTextDelay = CONFIG.LONG_TEXT_DELAY;
  } else {
    longTextDelay = 0;
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

},{"./config":1,"./lang":2,"./utils/random":4}],4:[function(require,module,exports){
module.exports = function(max) {
  return Math.floor(Math.random() * max);
}
},{}]},{},[3]);
