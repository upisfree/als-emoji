// отсылать на проверку только изменившиеся части текста С ПОСЛЕДНЕЙ ПРОВЕРКИ и если много поменялось, то проверять всё
// fallback: https://github.com/lautis/emojie

// var diff = require('diff');
// var oldText = '';

var input = document.getElementById('input');
var output = document.getElementById('output');


// 217 ms — 1578 words

var worker = new Worker('./bin/worker.js');

worker.onmessage = function(e) {
  output.textContent = e.data;
}

input.oninput = function(e) {
  worker.postMessage(input.value);
}