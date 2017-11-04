// рефакторинг
// — фикс сафари и фолбэка (или забить хуй)
// — рефакторинг
// — гифки
// — описание проекта и техчасть
// — свои главные проекты
// — минирезюме

var CONFIG = require('./config'),
    LANG = require('./lang'),
    random = require('./utils/random'),
    isFallbackNeeded = !(require('detect-emoji-support')()),
    now,
    longTextTime = Date.now(),
    longTextDelay = 0,
    isMouseOnTitleArrow = false,
    settings = { replaceWords: false, copyOnClick: true },
    input = document.getElementById('input'),
    output = document.getElementById('output'),
    variantsBlock = document.getElementById('variants'),
    variantsValue = document.getElementById('variants-value'),
    variantsWord = document.getElementById('variants-word'),
    variantsSelectedWord,
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

if (isFallbackNeeded) {
  var twemoji = require('twemoji');

  twemoji.parse(document.getElementById('about'));
}

worker.onmessage = function(e) {
  variants.style.opacity = 0;

  if (e.data.text) {
    output.innerHTML = e.data.text + '\n\n'; // \n\n — это чёртова гениальная магия, которая чинит textarea и не даёт тексту пропасть внутри окна    
    input.style.height = output.getBoundingClientRect().height + 'px';
  } else if (e.data.variants) {
    variants.style.opacity = 1;
    variantsWord.textContent = variantsSelectedWord;
    variantsValue.textContent = e.data.variants;
  }

  if (isFallbackNeeded) {
    twemoji.parse(output);
    twemoji.parse(variants);
  }
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

output.onclick = function() {
  window.getSelection().selectAllChildren(output);

  if (settings.copyOnClick) {
    document.execCommand('copy');

    copiedTime = Date.now();
    subtitle.textContent = subtitleCopiedText;
  }
}

input.onselect = function() {
  let text = window.getSelection().toString();

  variantsSelectedWord = text.trim();

  worker.postMessage({ text: text } );
}

titleArrow.onmousemove = function() {
  isMouseOnTitleArrow = true;
}

titleArrow.onmouseleave = subtitle.onclick = function() {
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

    if (isFallbackNeeded) {
      twemoji.parse(titleEmoji);
    }
  } else {
    changeTitle();
  }
}
