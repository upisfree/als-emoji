// лол кек фу и прочее добавить !
// гульпом при релизе копировать json и делать из него js и подключать в html. эмоджи вынести в отдельный файл, что коннектится в index.html, чтобы можно было использовать эмоджи в UI (название тулзы: радость —> 😂, когда наводишь, делает это очень быстро)
// пора начать оформлять дизайн
// на старых виндах fallback: https://github.com/twitter/twemoji

var CONFIG = require('./config'),
    time = Date.now(),
    delay = 0,
    input = document.getElementById('input'),
    output = document.getElementById('output'),
    worker = new Worker('./bin/worker.js');

function tick() {
  if ((Date.now() - time) > delay && time !== 0) {
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

  // instant translate for short texts and delay for long texts (to prevent this: https://i.imgur.com/6ZChXob.gif)
  if (input.value.length >= CONFIG.LONG_TEXT_LENGTH) {
    delay = CONFIG.LONG_TEXT_DELAY;
  } else {
    delay = 0;
  }
}

requestAnimationFrame(tick);