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