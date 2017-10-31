(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const CONFIG = {
  LONG_TEXT_LENGTH: 6000, // when text is long?
  LONG_TEXT_DELAY: 300 // set 0 for instant translate. it's delay for preventing thing like this: https://i.imgur.com/6ZChXob.gif
};

module.exports = CONFIG;
},{}],2:[function(require,module,exports){
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

},{"./config":1,"./utils/random":3}],3:[function(require,module,exports){
module.exports = function(max) {
  return Math.floor(Math.random() * max);
}
},{}]},{},[2]);
