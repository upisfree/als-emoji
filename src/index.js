// лол кек фу и прочее добавить !
// ждать, пока юзер кончит печатать и тогда отправлять воркеру, а не по изменению текста (но и учитывать ctrl+c, ctrl+v)
// гульпом при релизе копировать json и делать из него js и подключать в html. эмоджи вынести в отдельный файл, что коннектится в index.html, чтобы можно было использовать эмоджи в UI (название тулзы: радость —> 😂, когда наводишь, делает это очень быстро)
// пора начать оформлять дизайн
// на старых виндах fallback: https://github.com/lautis/emojie
// (?) diff таки надо, время последней отправки 
//


var input = document.getElementById('input');
var output = document.getElementById('output');

var worker = new Worker('./bin/worker.js');

worker.onmessage = function(e) {
  output.textContent = e.data;
}

input.oninput = function() {
  worker.postMessage(input.value);
}

// requestAnimationFrame