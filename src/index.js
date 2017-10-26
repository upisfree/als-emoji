// fallback: https://github.com/lautis/emojie

var input = document.getElementById('input');
var output = document.getElementById('output');

var worker = new Worker('./bin/worker.js');

worker.onmessage = function(e) {
  output.textContent = e.data;
}

input.oninput = function() {
  worker.postMessage(input.value);
}