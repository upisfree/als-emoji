var CONFIG = require('./config'),
    twemoji = require('twemoji'),
    el = require('./ui/elements.js'),
    tmp = require('./ui/tmp.js'),
    tick = require('./tick.js'),
    worker = new Worker('./bin/worker.js'),
    isFallbackNeeded = require('./utils/isFallbackNeeded'),
    isWindows = require('./utils/isWindows'),
    settings = JSON.parse(localStorage.getItem('settings')) || { replaceWords: false, selectOnClick: true };

if (isFallbackNeeded || isWindows) { // все винды пока не показывают флаги стран, чиним
  twemoji.parse(el.aboutBlock);
}

worker.onmessage = function(e) {
  el.variants.style.opacity = 0;

  if (e.data.text) {
    el.output.textContent = e.data.text + '\n\n'; // \n\n — это чёртова гениальная магия, которая чинит textarea и не даёт тексту пропасть внутри окна
    el.input.style.height = el.output.getBoundingClientRect().height + 'px';
  } else if (e.data.variants) {
    el.variants.style.opacity = 1;
    el.variantsWord.textContent = tmp.variantsSelectedWord;
    el.variantsValue.textContent = e.data.variants;
  }

  if (isFallbackNeeded) {
    twemoji.parse(el.output);
    twemoji.parse(el.variants);
  }
}

el.input.oninput = function() {
  tmp.longTextTime = Date.now();

  // мгновенный перевод для коротких текстов и задержка для длинных (чтобы не было такого: https://i.imgur.com/6ZChXob.gif)
  if (el.input.value.length >= CONFIG.LONG_TEXT_LENGTH) {
    tmp.longTextDelay = CONFIG.LONG_TEXT_DELAY;
  } else {
    tmp.longTextDelay = 0;
  }
}

el.output.onclick = function() {
  if (settings.selectOnClick) {
    window.getSelection().selectAllChildren(el.output);
  }

  document.execCommand('copy');

  tmp.copiedTime = Date.now();
  el.subtitle.textContent = CONFIG.SUBTITLE_COPIED_TEXT;
}

el.input.onselect = function() {
  let text = window.getSelection().toString();

  tmp.variantsSelectedWord = text.trim();

  worker.postMessage({ text: tmp.variantsSelectedWord } );
}

el.titleArrow.onmousemove = function() {
  tmp.isMouseOnTitleArrow = true;
}

el.titleArrow.onmouseleave = el.subtitle.onclick = function() {
  tmp.isMouseOnTitleArrow = false;
}

el.settingsReplaceWords.onchange = function() {
  settings.replaceWords = el.settingsReplaceWords.checked;

  localStorage.setItem('settings', JSON.stringify(settings));

  worker.postMessage({ text: el.input.value, settings: settings } );
}

el.settingsSelectOnClick.onchange = function() {
  settings.selectOnClick = el.settingsSelectOnClick.checked;

  localStorage.setItem('settings', JSON.stringify(settings));
}

// старт
requestAnimationFrame(tick.bind(this, worker, settings));

el.settingsReplaceWords.checked = settings.replaceWords;
el.settingsSelectOnClick.checked = settings.selectOnClick;

if (tmp.lastText) {
  el.input.textContent = tmp.lastText;
}