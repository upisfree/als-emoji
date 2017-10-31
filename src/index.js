// пора начать оформлять дизайн
// на старых виндах fallback: https://github.com/twitter/twemoji

var CONFIG = require('./config'),
    random = require('./utils/random'),
    longTextTime = Date.now(),
    longTextDelay = 0,
    isMouseOnTitle = false,
    input = document.getElementById('input'),
    output = document.getElementById('output'),
    title = document.getElementById('title'),
    worker = new Worker('./bin/worker.js');

worker.onmessage = function(e) {
  output.textContent = e.data;
}

input.oninput = input.onchange = function() {
  longTextTime = Date.now();

  // instant translate for short texts and delay for long texts (to prevent this: https://i.imgur.com/6ZChXob.gif)
  if (input.value.length >= CONFIG.LONG_TEXT_LENGTH) {
    longTextDelay = CONFIG.LONG_TEXT_DELAY;
  } else {
    longTextDelay = 0;
  }
}

title.onmouseenter = function() {
  isMouseOnTitle = true;
}

title.onmouseleave = function() {
  isMouseOnTitle = false;
}

// start
requestAnimationFrame(tick);

// funcs
function tick() {
  // translate
  if ((Date.now() - longTextTime) > longTextDelay && longTextTime !== 0) {
    longTextTime = 0;

    worker.postMessage(input.value);
  }

  // title
  if (isMouseOnTitle && !(Date.now() % 14)) {
    changeTitle();
  }

  requestAnimationFrame(tick);
}

function changeTitle() {
  let dict = emojies['ru']['keywords'],
      keys = Object.keys(dict),
      key = keys[random(keys.length)],
      variants = dict[key],
      emoji = variants[random(variants.length)];

  title.textContent = key + ' ⇒ ' + emoji;
}
