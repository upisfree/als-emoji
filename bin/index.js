(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const CONFIG = {
  TYPING_END_DELAY: 300 // set 0 for instant translate. it's delay for preventing thing like this: https://i.imgur.com/6ZChXob.gif
};

module.exports = CONFIG;
},{}],2:[function(require,module,exports){
// лол кек фу и прочее добавить !
// гульпом при релизе копировать json и делать из него js и подключать в html. эмоджи вынести в отдельный файл, что коннектится в index.html, чтобы можно было использовать эмоджи в UI (название тулзы: радость —> 😂, когда наводишь, делает это очень быстро)
// пора начать оформлять дизайн
// на старых виндах fallback: https://github.com/lautis/emojie
// (?) diff таки надо, время последней отправки 
//
var CONFIG = require('./config'),
    time = Date.now(),
    input = document.getElementById('input'),
    output = document.getElementById('output'),
    worker = new Worker('./bin/worker.js');

function tick() {
  if ((Date.now() - time) > CONFIG.TYPING_END_DELAY && time !== 0) {
    time = 0;

    worker.postMessage(input.value);
  }

  requestAnimationFrame(tick);
}

worker.onmessage = function(e) {
  output.textContent = e.data;
}

input.oninput = input.onchange = function() {
  time = Date.now();
}

requestAnimationFrame(tick);
},{"./config":1}]},{},[2]);
